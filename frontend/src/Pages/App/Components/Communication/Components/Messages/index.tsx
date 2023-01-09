import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Message from "./Components/Message";
import styles from "./Messages.module.scss";
import { messagesAtom, messagesInfoAtom } from "../../../../../../States/messages";
import { userUsernameAtom } from "../../../../../../States/user";
import { useEffect } from "react";


interface Props {
    bottomRef: any
}

export default function Messages(props: Props) {
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);

    useEffect(() => {
        props.bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesInfoState.chatId]);
    

    return (
        <ul
            className={styles.messages}
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