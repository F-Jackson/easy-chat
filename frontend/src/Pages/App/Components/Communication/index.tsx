import Messages from "./Components/Messages";
import SendMessage from "./Components/SendMessage";
import styles from "./Communication.module.scss";
import DeleteMessages from "./Components/DeleteMessages";
import { useRecoilValue } from "recoil";
import { messagesSelectedAtom } from "../../../../States/messagesSelected";
import { messagesInfoAtom } from "../../../../States/messages";
import { useRef } from "react";
import ExpandedFile from "./Components/ExpandedFile";
import { expandedFileAtom } from "States/expandedFile";


export default function Communication() {
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const messagesSelectedState = useRecoilValue(messagesSelectedAtom);
    const expandedFile = useRecoilValue(expandedFileAtom);

    const bottomRef: any = useRef(null);


    return (
        <>
            { 
                expandedFile.src !== undefined && expandedFile.src !== "" && expandedFile.type !== undefined && expandedFile.type !== "" ? 
                <ExpandedFile /> : <></>
            }
            <div className={styles.messages__container}>
                <Messages 
                    key={messagesInfoState.chatId}
                    bottomRef={bottomRef}
                />
                { messagesSelectedState.length > 0 ? <DeleteMessages /> : <SendMessage /> }
            </div>
        </>
    );
}