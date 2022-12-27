import styles from "./Chats.module.scss";
import Chat from "./Components/Chat";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { jwtTokenAtom } from "../../../../../../States/user";
import axios from "axios";
import Input from "../../../../../../Components/Input";
import Button from "../../../../../../Components/Button";
import chats from "../../../../../../FakeData/chats.json";
import { chatSelectedAtom } from "../../../../../../States/chatsSelected";


interface IChat {
    id: number,
    name: string,
    newMessages: number
}

export default function Chats() {
    const [chatsState, setChatsState] = useState<IChat[]>([]);
    const [formInputState, setFormInputState] = useState("");
    
    const [jwtTokenState, setJwtTokenState] = useRecoilState(jwtTokenAtom);
    const chatSelectedState = useRecoilValue(chatSelectedAtom);

    function _deleteChats() {
        axios.delete(`http://127.0.0.1:8000/chats/`, {
            headers: {
                'token': jwtTokenState
            }
        }).then(response => {
            setJwtTokenState(response.data['token']);
        }).catch(error => {
            setJwtTokenState((_) => "");
        });
    }

    function _addChat() {
        const data = {
            'user_id': formInputState
        }

        axios.put(`http://127.0.0.1:8000/chats/`, data, {
            headers: {
                'token': jwtTokenState
            }
        }).then(response => {
            setJwtTokenState(response.data['token']);
        }).catch(error => {
            setJwtTokenState((_) => "");
        });
    }

    function HandleForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        chatSelectedState.length > 0 ? _deleteChats() : _addChat()
    }

    function _GetChats() {
        axios.get('http://127.0.0.1:8000/chats/', {
            headers: {
                'token': jwtTokenState
            }
        }).then(response => {
            const chats: IChat[] = response.data['chats'];
            setChatsState((_) => chats);

            setJwtTokenState((_) => response.data['token']);
        }).catch(errors => {
            setJwtTokenState((_) => "");
        });
    }

    useEffect(() => {
        _GetChats();
    }, [jwtTokenState]);


    return (
        <>
            <ul
                className={styles.chats}
            >
                {chats?.map(chat => (
                    <li
                        key={chat.id}
                    >
                        <Chat
                            id={chat.id}
                            name={chat.name}
                            newMessages={chat.newMessages}
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
                    <Input 
                        type="text"
                        name={ chatSelectedState.length > 0 ? "removeChats" : "addChats"}
                        placeholder={ chatSelectedState.length > 0 ? "Confirm: (Yes or No)" : "Username to talk"}
                        title={ chatSelectedState.length > 0 ? "Remove Chats Confirmation" : "Add Chats Username"}
                        value={formInputState}
                        setValue={setFormInputState}
                    />
                    <Button 
                        type='submit'
                        title={ chatSelectedState.length > 0 ? "Remove Chats" : "Add Chats"}
                    >
                        { chatSelectedState.length > 0 ? "Remove Chats" : "Add Chats"}
                    </Button>
                </form>
            </section>
        </>
    );
}