import { useRecoilValue } from "recoil";
import Message from "./Components/Message";
import styles from "./Messages.module.scss";
import { messagesAtom } from "../../../../../../States/messages";
import { userUsernameAtom } from "../../../../../../States/user";
import { useEffect, useRef } from "react";


export default function Messages() {
    const messagesState = useRecoilValue(messagesAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);

    const bottomRef: any = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesState]);
    

    return (
        <ul
            className={styles.messages}
        >
            {
                messagesState.messages?.map(message => (
                    <Message
                        message={message.message}
                        owner={message.user === userUsernameState ? "you" : "other"}
                        sendedNow={message.sendedNow}
                        key={message.id}
                    />
                ))
            }

            <div ref={bottomRef} />
        </ul>
    );
}