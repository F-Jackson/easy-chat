import styles from "./Chats.module.scss";
import Chat from "./Components/Chat";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import axios from "axios";
import Input from "../../../../../../Components/Input";
import Button from "../../../../../../Components/Button";
import { messagesInfoAtom, messagesAtom } from "../../../../../../States/messages";
import { chatSelectedAtom } from "../../../../../../States/chatsSelected";
import { errorAtom } from "../../../../../../States/error";
import { messagesSelectedAtom } from "../../../../../../States/messagesSelected";
import { inputMessagesAtom } from "../../../../../../States/inputMessage";
import { TChats, chatAtom } from "../../../../../../States/chats";
import { baseUrl } from "Constants/baseUrl";


export default function Chats() {
    const [formInputState, setFormInputState] = useState("");
    const [timerId, setTimerId] = useState<NodeJS.Timeout>();
    
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const [messagesInfoState, setMessagesInfoState] = useRecoilState(messagesInfoAtom);
    const setMessagesState = useSetRecoilState(messagesAtom);
    const [chatsState, setChatsState] = useRecoilState(chatAtom);
    const setMessagesSelectedState = useSetRecoilState(messagesSelectedAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);
    const errorsState = useSetRecoilState(errorAtom);
    const setInputMessagesState = useSetRecoilState(inputMessagesAtom);
    const [apiLoadingStatusState, setApiLoadingStatusState] = useState(false);

    const bottomRef: any = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatsState]);

    function _Error(error: any) {
        setApiLoadingStatusState(false);

        if(error.includes('response') && error.response.data.includes('error')) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function _cleanMessagesState() {
        if(messagesInfoState.chatId && chatSelectedState.includes(messagesInfoState.chatId)) {
            setMessagesInfoState({
                chatId: undefined,
                talkingTo: undefined
            });

            setMessagesState([]);
        }
    }

    function _deleteChats() {
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        setMessagesSelectedState([]);

        axios.delete(`${baseUrl}/chats/`, {
            headers: {
                'token': jwtToken
            },
            data: {
                'chats_id_to_delete': chatSelectedState
            }
        }).then(response => {
            setApiLoadingStatusState(false);
            setJwtToken(response.data['token']);

            const newsChats = chatsState?.filter(chat => !(chatSelectedState.includes(chat.id)));

            _cleanMessagesState();

            setChatSelectedState([]);

            setChatsState(newsChats);
        }).catch(error => {
            _Error(error);
        });
    }

    function _addChat() {
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        const data = {
            'talk_to': formInputState
        }

        axios.post(`${baseUrl}/chats/`, data, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setApiLoadingStatusState(false);
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
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        setMessagesSelectedState([]);

        axios.get(`${baseUrl}/chats/`, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setApiLoadingStatusState(false);
            const chats: TChats = response.data['chats'].map((chat: { id: any; user_1: string; user_2: string; last_message: Date }) => {
                return {
                    id: chat.id,
                    user_1: chat.user_1,
                    user_2: chat.user_2,
                    hasNewChat: false
                }
            });
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
                            timerId={timerId}
                            setTimerId={setTimerId}
                            hasNewChat={chat.hasNewMsg}
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