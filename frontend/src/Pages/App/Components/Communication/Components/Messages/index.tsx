import { useRecoilValue } from "recoil";
import Message from "./Components/Message";
import styles from "./Messages.module.scss";
import { messagesAtom } from "../../../../../../States/messages";
import { userUsernameAtom } from "../../../../../../States/user";


export default function Messages() {
    const messagesState = useRecoilValue(messagesAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);


    return (
        <ul className={styles.messages}>
            {
                messagesState.messages?.map(message => (
                    <Message
                        message={message.message}
                        owner={message.user === userUsernameState ? "you" : "other"}
                        key={message.id}
                    />
                ))
            }
        </ul>
    );
}