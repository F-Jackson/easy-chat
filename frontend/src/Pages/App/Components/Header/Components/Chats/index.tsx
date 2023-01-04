import styles from "./Chats.module.scss";
import Chat from "./Components/Chat";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import axios from "axios";
import Input from "../../../../../../Components/Input";
import Button from "../../../../../../Components/Button";
import { messagesAtom } from "../../../../../../States/messages";
import { chatSelectedAtom } from "../../../../../../States/chatsSelected";
import { errorAtom } from "../../../../../../States/error";
import { messagesSelectedAtom } from "../../../../../../States/messagesSelected";
import { inputMessagesAtom } from "../../../../../../States/inputMessage";


interface IChat {
    id: number,
    user_1: string,
    user_2: string
}

export default function Chats() {
    const [chatsState, setChatsState] = useState<IChat[]>([]);
    const [formInputState, setFormInputState] = useState("");
    
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const setMessagesSelectedState = useSetRecoilState(messagesSelectedAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);
    const errorsState = useSetRecoilState(errorAtom);
    const setInputMessagesState = useSetRecoilState(inputMessagesAtom);

    const bottomRef: any = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatsState]);

    function _Error(error: any) {
        if('response' in error && 'error' in error.response.data) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function _cleanMessagesState() {
        if(messagesState.chatId && chatSelectedState.includes(messagesState.chatId)) {
            setMessagesState({
                chatId: undefined,
                talkingTo: undefined,
                messages: []
            });
        }
    }

    function _deleteChats() {
        setMessagesSelectedState([]);

        axios.delete(`http://127.0.0.1:8000/chats/`, {
            headers: {
                'token': jwtToken
            },
            data: {
                'chats_id_to_delete': chatSelectedState
            }
        }).then(response => {
            setJwtToken(response.data['token']);

            const newsChats = chatsState.filter(chat => !(chatSelectedState.includes(chat.id)));

            _cleanMessagesState();

            setChatSelectedState([]);

            setChatsState(newsChats);
        }).catch(error => {
            _Error(error);
        });
    }

    function _addChat() {
        const data = {
            'talk_to': formInputState
        }

        axios.post(`http://127.0.0.1:8000/chats/`, data, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setJwtToken(response.data['token']);
            _GetChats();
        }).catch(error => {
            _Error(error);
        });
    }

    function HandleForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        chatSelectedState.length > 0 ? _deleteChats() : _addChat()
    }

    function _GetChats() {
        setMessagesSelectedState([]);

        axios.get('http://127.0.0.1:8000/chats/', {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            const chats: IChat[] = response.data['chats'];
            setChatsState((_) => chats);

            setInputMessagesState((_) => chats.map(chat => {
                return {
                    chatId: chat.id,
                    message: ""
                }
            }));

            setJwtToken((_) => response.data['token']);
        }).catch(error => {
            _Error(error);
        });
    }

    useEffect(() => {
        if(jwtToken) {
            _GetChats();
        }
        else {
            setChatsState((_) => []);
        }
    }, [userUsernameState]);



    return (
        <>
            <ul
                className={styles.chats}
            >
                {chatsState?.map(chat => (
                    <li
                        key={chat.id}
                    >
                        <Chat
                            id={chat.id}
                            name={ userUsernameState === chat.user_1 ? chat.user_2 : chat.user_1}
                            newMessages={0}
                        />
                    </li>
                )) }
                <div ref={bottomRef} />
            </ul>
            <section
                className={styles.chatForm}
            >
                <form
                    onSubmit={(e) => HandleForm(e)}
                >
                    {
                        chatSelectedState.length <= 0 ? 
                        <Input 
                            type="text"
                            name={"addChats"}
                            placeholder={"Username to talk"}
                            title={"Add Chats Username"}
                            value={formInputState}
                            setValue={setFormInputState}
                        /> 
                        : <></>
                    }
                    <Button 
                        type='submit'
                        title={ chatSelectedState.length > 0 ? "Remove Chats" : "Add Chats"}
                        animate={true}
                    >
                        { chatSelectedState.length > 0 ? "Remove Chats" : "Add Chats"}
                    </Button>
                </form>
            </section>
        </>
    );
}