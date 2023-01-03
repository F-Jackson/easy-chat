import { useRecoilState, useSetRecoilState } from "recoil";
import useLongPress from "../../../../../../../../Hooks/longPress";
import styles from "./Chat.module.scss";
import { MdOutlineWhatshot } from "react-icons/md";
import { chatSelectedAtom } from "../../../../../../../../States/chatsSelected";
import { useState } from "react";
import axios from "axios";
import { jwtTokenAtom } from "../../../../../../../../States/user";
import { TMessage, messagesAtom } from "../../../../../../../../States/messages";
import { errorAtom } from "../../../../../../../../States/error";


interface Props {
    id: number,
    name: string,
    newMessages: number,
}

export default function Chat(props: Props) {
    const [clickedState, setClickedState] = useState(false);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>();

    const backspaceLongPress = useLongPress(() => AddChatToDeleteList(), 500, () => HandlesClick(), clickedState);
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const setMessagesState = useSetRecoilState(messagesAtom);
    const setErrorsState = useSetRecoilState(errorAtom);

    let newStyles = {
        borderTop: "solid white 2px"
    } as React.CSSProperties;


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

    function _HandlePress() {
        setClickedState(true);

        clearInterval(timerId);
        setTimerId(setTimeout(() => setClickedState(false), 1000));
    }

    function AddChatToDeleteList() {
        _HandlePress();
        if(!(chatSelectedState.includes(props.id))){
            setChatSelectedState((old) => [...old, props.id]);
        } else {
            _RemoveChat();
        }
    }

    function OpenChat() {
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
            console.log(error);
            _Error(error);
        });
    }

    function HandlesClick() {
        _HandlePress();
        if(!(chatSelectedState.includes(props.id))){
            OpenChat();
        } else {
            _RemoveChat();
        }
    }


    return (
        <button
            title="Open chat"
            className={styles.chat}
            {...backspaceLongPress}
            style={ chatSelectedState.includes(props.id) ? newStyles : {} as React.CSSProperties}
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
            {
                props.newMessages ?
                <p
                    className={styles.newMsg}
                >
                    {props.newMessages}
                    <MdOutlineWhatshot />
                </p>
                : <></>
            }
        </button>
    );
}