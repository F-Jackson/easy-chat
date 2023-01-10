import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Message from "./Components/Message";
import styles from "./Messages.module.scss";
import { TMessage, messagesAtom, messagesInfoAtom } from "../../../../../../States/messages";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import { createRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import { errorAtom } from "../../../../../../States/error";


interface Props {
    bottomRef: any,
}

export default function Messages(props: Props) {
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);
    const setErrorsState = useSetRecoilState(errorAtom);

    const [pageState, setPageState] = useState(2);
    const [reachedTopState, setReachedTopState] = useState(false);


    function _Error(error: any) {
        if('response' in error && 'error' in error.response.data) {
            setErrorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            setErrorsState((_) => []);
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        if(Math.abs(e.currentTarget.scrollTop) < 15 && !reachedTopState) {
            setReachedTopState(true);

            axios.get(`http://127.0.0.1:8000/messages/chat/${messagesInfoState.chatId}/page:${pageState}/`, {
                headers: {
                    'token': jwtToken
                }
            }).then(response => {
                setJwtToken(response.data['token']);
                let messages: TMessage[] = response.data['messages'].map((msg: TMessage) => (
                    {
                        id: msg.id,
                        user: msg.user,
                        message: msg.message,
                        date: new Date(msg.date),
                        sendedNow: false
                    }
                )).reverse();

                const messagesStateIds = messagesState.map(msg => msg.id);
                messages = messages.filter(msg => !messagesStateIds.includes(msg.id));

                setMessagesState([...messages, ...messagesState]);
                setPageState(pageState +1);
            }).catch(error => {
                _Error(error);
            });
        } else if(Math.abs(e.currentTarget.scrollTop) > 25) {
            setReachedTopState(false);
        }
    } 

    useEffect(() => {
        setPageState(2);
        props.bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesInfoState.chatId]);
    

    return (
        <ul
            className={styles.messages}
            onScroll={handleScroll}
        >
            {
                messagesState?.map(message => (
                    <Message
                        id={message.id}
                        message={message.message}
                        owner={message.user === userUsernameState ? "you" : "other"}
                        sendedNow={message.sendedNow}
                        key={message.id}
                    />
                ))
            }

            <div ref={props.bottomRef} />
        </ul>
    );
}