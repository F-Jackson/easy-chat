import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Message from "./Components/Message";
import styles from "./Messages.module.scss";
import { TMessage, messagesAtom, messagesInfoAtom } from "../../../../../../States/messages";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { errorAtom } from "../../../../../../States/error";
import classNames from "classnames";
import { baseUrl } from "Constants/baseUrl";


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
    const [wheelYState, setWheelYState] = useState(0);
    const [lastMessageId, setLastMessageId] = useState(0);

    const elementRef = useRef<any>([]);


    const otherContainerStyle = {
        alignSelf: 'flex-start',
        '--from-position-animation': '-300px'
    };

    const youContainerStyle = {
        alignSelf: 'flex-end',
        '--from-position-animation': '300px'
    };

    function _Error(error: any) {
        if(error.includes('response') && error.response.data.includes('error')) {
            setErrorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            setErrorsState((_) => []);
        }
    }

    function _GetNewMessages() {
        axios.get(`${baseUrl}/messages/chat/${messagesInfoState.chatId}/page:${pageState}/`, {
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
                    sendedNow: true,
                    file: msg.file
                }
            )).reverse();

            const messagesStateIds = messagesState.map(msg => msg.id);
            messages = messages.filter(msg => !messagesStateIds.includes(msg.id));

            setMessagesState([...messages, ...messagesState]);
            setPageState(pageState +1);
            setLastMessageId(messagesStateIds[0]);
        }).catch(error => {
            _Error(error);
        });
    }

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        if(Math.abs(e.currentTarget.scrollTop) < 11 && !reachedTopState) {
            setReachedTopState(true);
            e.currentTarget.scrollTo(0, 11);

            _GetNewMessages();
        } else if(Math.abs(e.currentTarget.scrollTop) > 10) {
            setReachedTopState(false);
        }
    } 

    const handleWheel = (e: React.WheelEvent<HTMLUListElement>) => {
        const wheelY = e.deltaY;

        if(Math.abs(e.currentTarget.scrollTop) < 11 && reachedTopState && wheelY < 0) {
            setWheelYState(wheelYState + 1);

            if (wheelYState > 3) {
                setWheelYState(0);
                _GetNewMessages();
            }
        } else {
            setWheelYState(0);
        }
    }

    useEffect(() => {
        setPageState(2);
        setLastMessageId(0);
        props.bottomRef.current?.scrollIntoView();
    }, [messagesInfoState.chatId]);

    useEffect(() => {
        if(elementRef.current.length > 0 && messagesState.length > 0) {
            const newMessagesStateIds = messagesState.map(msg => msg.id);
            const index = newMessagesStateIds.indexOf(lastMessageId);
            if(elementRef.current[index]) {
                elementRef.current[index].scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    }, [lastMessageId]);
    

    return (
        <ul
            className={styles.messages}
            onScroll={handleScroll}
            onWheel={(e) => handleWheel(e)}
        >
            {
                messagesState?.map((message, i) => (
                    <li 
                        key={message.id}
                        ref={ref => {elementRef.current[i] = ref}}
                        className={classNames({
                            [styles.message]: true,
                            [styles['message--sendedNow']]: message.sendedNow,
                            [styles['message--notSendedNow']]: !message.sendedNow,
                        })}
                        style={ message.user === userUsernameState ? youContainerStyle : otherContainerStyle}
                    >
                        <Message
                            id={message.id}
                            message={message.message}
                            owner={message.user === userUsernameState ? "you" : "other"}
                            sendedNow={message.sendedNow}
                            date={message.date}
                            fileLink={message.file.link}
                            fileType={message.file.type}
                            fileObj={message.file.obj}
                        />
                    </li>
                ))
            }

            <div ref={props.bottomRef} />
        </ul>
    );
}