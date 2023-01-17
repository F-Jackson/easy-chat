import { useRecoilState, useSetRecoilState } from "recoil";
import styles from "./Chat.module.scss";
import { chatSelectedAtom } from "../../../../../../../../States/chatsSelected";
import axios from "axios";
import { jwtTokenAtom } from "../../../../../../../../States/user";
import { TMessage, messagesAtom, messagesInfoAtom } from "../../../../../../../../States/messages";
import { errorAtom } from "../../../../../../../../States/error";
import Selectable from "../../../../../../../../Components/Selectable";
import { BiTrash } from "react-icons/bi";
import { FaFire }  from "react-icons/fa";
import { messagesSelectedAtom } from "../../../../../../../../States/messagesSelected";
import { chatAtom } from "../../../../../../../../States/chats";
import variables from 'styles/_variables.module.scss';
import classNames from "classnames";
import { apiLoadingStatusAtom } from "States/apiLoadingStatus";
import { baseUrl } from "Constants/baseUrl";


interface Props {
    id: number,
    name: string,
    newMessages: number,
    timerId: NodeJS.Timeout | undefined,
    setTimerId: React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>,
    hasNewChat: boolean,
    lastMessageDate: Date
}

export default function Chat(props: Props) {
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const setMessagesState = useSetRecoilState(messagesAtom);
    const setErrorsState = useSetRecoilState(errorAtom);
    const setMessagesSelectedState = useSetRecoilState(messagesSelectedAtom);
    const setMessagesInfoState = useSetRecoilState(messagesInfoAtom);
    const [chatsState, setChatsState] = useRecoilState(chatAtom);
    const [apiLoadingStatusState, setApiLoadingStatusState] = useRecoilState(apiLoadingStatusAtom);
    

    function _Error(error: any) {
        setApiLoadingStatusState(false);

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
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        setMessagesSelectedState([]);

        axios.get(`${baseUrl}/messages/chat/${props.id}/page:1/`, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setApiLoadingStatusState(false);
            clearTimeout(props.timerId);

            const messages = response.data['messages'].map((msg: TMessage) => (
                {
                    id: msg.id,
                    user: msg.user,
                    message: msg.message,
                    date: new Date(msg.date),
                    sendedNow: false,
                    file: msg.file
                }
            ));

            setJwtToken(response.data['token']);

            setMessagesInfoState((_) => {
                return {
                    chatId: undefined,
                    talkingTo: undefined,
                    lastMessageDate: new Date()
                };
            });

            props.setTimerId(setTimeout(() => {
                setMessagesInfoState((_) => {
                    return {
                        chatId: props.id,
                        talkingTo: props.name,
                        lastMessageDate: new Date(props.lastMessageDate) 
                    };
                });
    
                setMessagesState(messages.reverse());
            }, 300));

            const newsChats = chatsState?.map(chat => {
                if(chat.id === props.id) {
                    return {
                        id: chat.id,
                        user_1: chat.user_1,
                        user_2: chat.user_2,
                        lastMessageDate: chat.lastMessageDate,
                        hasNewMsg: false
                    }
                } else {
                    return {
                        id: chat.id,
                        user_1: chat.user_1,
                        user_2: chat.user_2,
                        lastMessageDate: chat.lastMessageDate,
                        hasNewMsg: chat.hasNewMsg
                    }
                }
            });

            setChatsState(newsChats);
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
            className={classNames({
                [styles.chat]: true,
                [styles['chat--selected']]: chatSelectedState.includes(props.id)
            })}
            handleClick={HandleClick}
            handleHold={AddChatToDeleteList}
            holdTime={250}
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
                className={classNames({
                    [styles.trash]: true,
                    [styles['trash--selected']]: chatSelectedState.includes(props.id)
                })}
            />
            {
                props.hasNewChat ? 
                <FaFire 
                    className={styles.new__message}
                /> : <></>
            }
        </Selectable>
    );
}