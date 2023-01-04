import { useRecoilState, useSetRecoilState } from "recoil";
import styles from "./Chat.module.scss";
import { chatSelectedAtom } from "../../../../../../../../States/chatsSelected";
import axios from "axios";
import { jwtTokenAtom } from "../../../../../../../../States/user";
import { TMessage, messagesAtom } from "../../../../../../../../States/messages";
import { errorAtom } from "../../../../../../../../States/error";
import Selectable from "../../../../../../../../Components/Selectable";
import { BiTrash } from "react-icons/bi";
import { messagesSelectedAtom } from "../../../../../../../../States/messagesSelected";


interface Props {
    id: number,
    name: string,
    newMessages: number,
}

export default function Chat(props: Props) {
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const setMessagesState = useSetRecoilState(messagesAtom);
    const setErrorsState = useSetRecoilState(errorAtom);
    const setMessagesSelectedState = useSetRecoilState(messagesSelectedAtom);

    const newStylesContainer = {
        borderColor: 'rgb(133, 0, 0)'
    };

    const newStylesTrash = {
        color: 'rgb(133, 0, 0)'
    };

    function _Error(error: any) {
        if('response' in error && 'error' in error.response.data) {
            setErrorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            setErrorsState((_) => []);
        }
    }

    function _RemoveChat() {
        const index = chatSelectedState.findIndex((id) => id === props.id);
        if (index !== -1) {
            setChatSelectedState([
                ...chatSelectedState.slice(0, index),
                ...chatSelectedState.slice(index + 1)
            ]);
        }
    }

    function AddChatToDeleteList() {
        if(!(chatSelectedState.includes(props.id))){
            setChatSelectedState((old) => [...old, props.id]);
        } else {
            _RemoveChat();
        }
    }

    function OpenChat() {
        setMessagesSelectedState([]);

        axios.get(`http://127.0.0.1:8000/messages/chat/${props.id}`, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            const messages = response.data['messages'].map((msg: TMessage) => (
                {
                    id: msg.id,
                    user: msg.user,
                    message: msg.message,
                    date: msg.date,
                    sendedNow: false
                }
            ));
            
            setJwtToken(response.data['token']);
            setMessagesState((_) => {
                const newMessages = {
                    chatId: props.id,
                    talkingTo: props.name,
                    messages: messages
                };
                return newMessages;
            });
        }).catch(error => {
            _Error(error);
        });
    }

    function HandleClick() {
        if(!(chatSelectedState.includes(props.id))){
            OpenChat();
        } else {
            _RemoveChat();
        }
    }


    return (
        <Selectable
            title="Open chat"
            className={styles.chat}
            handleClick={HandleClick}
            handleHold={AddChatToDeleteList}
            holdTime={250}
            newStyles={chatSelectedState.includes(props.id) ? newStylesContainer : {}}
        >
            <img 
                src="" 
                alt="UserImage" 
                className={styles.image}
            />
            <p
                className={styles.name}
            >
                {props.name}
            </p>
            <BiTrash 
                className={styles.trash}
                style={chatSelectedState.includes(props.id) ? newStylesTrash : {}}
            />
        </Selectable>
    );
}