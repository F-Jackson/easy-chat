import Messages from "./Components/Messages";
import SendMessage from "./Components/SendMessage";
import styles from "./Communication.module.scss";
import DeleteMessages from "./Components/DeleteMessages";
import { useRecoilValue } from "recoil";
import { messagesSelectedAtom } from "../../../../States/messagesSelected";
import { messagesInfoAtom } from "../../../../States/messages";
import { useRef } from "react";


export default function Communication() {
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const messagesSelectedState = useRecoilValue(messagesSelectedAtom);

    const bottomRef: any = useRef(null);


    return (
        <div className={styles.messages__container}>
            <Messages 
                key={messagesInfoState.chatId}
                bottomRef={bottomRef}
            />
            { messagesSelectedState.length > 0 ? <DeleteMessages /> : <SendMessage /> }
        </div>
    );
}