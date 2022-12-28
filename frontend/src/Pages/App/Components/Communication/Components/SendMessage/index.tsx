import { useState } from "react";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { BiMailSend } from "react-icons/bi";
import styles from "./SendMessage.module.scss";
import classNames from "classnames";


export default function SendMessage() {
    const [messageState, setMessageState] = useState("");
    const [sendingState, setSendingState] = useState(false);

    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(!sendingState) {
            setSendingState(true);

            setTimeout(() => {
                setSendingState(false);
                setMessageState("");
            }, 701);
        }
    }

    return (
        <section
            className={styles.sendMessageContainer}
        >
            <form
                onSubmit={(e) => sendMessage(e)}
                className={classNames({
                    [styles.form]: true,
                    [styles['form--sending']]: sendingState
                })}
            >
                <Input 
                    type="text"
                    name="message"
                    placeholder="....."
                    title="Send message"
                    value={messageState}
                    setValue={setMessageState}
                />
                <div className={styles.div__to__animate}></div>
                <Button 
                    title="Send message"
                    animate={false}
                >
                    <BiMailSend />
                </Button>
            </form>
        </section>
    );
}