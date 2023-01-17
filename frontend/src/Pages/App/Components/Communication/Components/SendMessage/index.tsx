import { useEffect, useState } from "react";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { BiMailSend } from "react-icons/bi";
import styles from "./SendMessage.module.scss";
import classNames from "classnames";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { messagesAtom, messagesInfoAtom } from "../../../../../../States/messages";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import { inputMessagesAtom } from "../../../../../../States/inputMessage";
import { apiLoadingStatusAtom } from "States/apiLoadingStatus";
import Compressor from 'compressorjs';
import { ACCEPTEDFILEMAXSIZE, ACCEPTEDFILETYPES } from "Constants/sendMessage";
import { baseUrl } from "Constants/baseUrl";


type TData = {
    chat: number,
    message: string,
    file?: File | Blob
}

export default function SendMessage() {
    const [messageState, setMessageState] = useState("");
    const [fileState, setFileState] = useState<File | undefined>(undefined);
    const [sendingState, setSendingState] = useState(false);

    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [inputMessagesState, setInputMessagesState] = useRecoilState(inputMessagesAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);
    const [apiLoadingStatusState, setApiLoadingStatusState] = useRecoilState(apiLoadingStatusAtom);

    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        if(!sendingState) {
            setSendingState(true);

            const message = messageState;
            let data: TData = {
                chat: messagesInfoState.chatId ? messagesInfoState.chatId : 0,
                message: message,
            }

            if(fileState !== undefined) data.file = fileState;

            axios.post(`${baseUrl}/messages/`, data, {
                headers: {
                    'token': jwtToken,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                setApiLoadingStatusState(false); 
                const newMessage = {
                    id: response.data['message'].id,
                    user: userUsernameState,
                    message: message,
                    date: new Date(),
                    sendedNow: true,
                    file: {
                        obj: fileState ? fileState : undefined,
                        type: fileState?.type
                    }
                };

                setJwtToken(response.data['token']);

                setMessagesState([...messagesState, newMessage]);

            }).catch(error => {
                setApiLoadingStatusState(false);
                setMessageState("");
            });

            setTimeout(() => {
                setSendingState(false);
                setMessageState("");
            }, 701);
        }
    }

    useEffect(() => {
        const chatId = messagesInfoState.chatId;

        const old = inputMessagesState.filter(inputMsg => inputMsg.chatId !== chatId);

        const newMsg = {
            chatId: chatId as number,
            message: messageState
        }

        setInputMessagesState((_) => [...old, newMsg]);
    }, [messageState]);

    useEffect(() => {
        const chatId = messagesInfoState.chatId;

        const message = inputMessagesState.find(inputMsg => inputMsg.chatId === chatId);
        
        if(message) {
            setMessageState(message.message);
        }
    }, [messagesState]);

    function setFile(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files && e.target.files.length > 0) {
            const file: File = e.target.files[0];
            const fileType = file.type;

            if(ACCEPTEDFILETYPES.includes(fileType) && file.size <= ACCEPTEDFILEMAXSIZE) {
                setFileState(file);
            } else {
                setFileState(undefined);
            }
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
                <input 
                    type="file"
                    name="send-file"
                    title="Send File"
                    onChange={(e) => setFile(e)}
                    accept={ACCEPTEDFILETYPES.join(',')}
                />
                <Input 
                    type="text"
                    name="message"
                    placeholder="....."
                    title="Send message"
                    value={messageState}
                    setValue={setMessageState}
                    maxLength={200}
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