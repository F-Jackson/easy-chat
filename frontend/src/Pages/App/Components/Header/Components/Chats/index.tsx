import styles from "./Chats.module.scss";
import Chat from "./Components/Chat";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import axios from "axios";
import Input from "../../../../../../Components/Input";
import Button from "../../../../../../Components/Button";
import chats from "../../../../../../FakeData/chats.json";
import { chatSelectedAtom } from "../../../../../../States/chatsSelected";
import { errorAtom } from "../../../../../../States/error";


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
    const userUsernameState = useRecoilValue(userUsernameAtom);
    const errorsState = useSetRecoilState(errorAtom);

    function _Error(error: any) {
        if('response' in error && 'error' in error.response.data) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function _deleteChats() {
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
        axios.get('http://127.0.0.1:8000/chats/', {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            const chats: IChat[] = response.data['chats'];
            setChatsState((_) => chats);

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