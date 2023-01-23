import { useEffect, useState } from "react";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { BiMailSend } from "react-icons/bi";
import styles from "./SendMessage.module.scss";
import classNames from "classnames";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { messagesAtom, messagesInfoAtom } from "../../../../../../States/messages";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import { inputMessagesAtom } from "../../../../../../States/inputMessage";
import Compressor from 'compressorjs';
import { ACCEPTEDFILEMAXSIZE, ACCEPTEDFILETYPES, audioTypes, imageTypes, videoTypes, textTypes } from "Constants/sendMessage";
import { baseUrl } from "Constants/baseUrl";
import { errorAtom } from "States/error";
import { AudioRecorder, useAudioRecorder  } from 'react-audio-voice-recorder';
import { HiMicrophone, HiStop } from "react-icons/hi";
import { GoFileSymlinkDirectory } from "react-icons/go";
import { BsFillFileEarmarkMusicFill, BsFillFileEarmarkImageFill, BsFillFileEarmarkPlayFill, BsFillFileEarmarkTextFill } from "react-icons/bs";


type TData = {
    chat: number,
    message: string,
    file?: File | Blob
}

export default function SendMessage() {
    const [messageState, setMessageState] = useState("");
    const [fileState, setFileState] = useState<File | undefined>(undefined);
    const [sendingState, setSendingState] = useState(false);
    const [sendingMessageState, setSendingMessageState] = useState(false);
    const [messagesToSend, setMessagesToSend] = useState<TData[]>([]);

    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [inputMessagesState, setInputMessagesState] = useRecoilState(inputMessagesAtom);
    const userUsernameState = useRecoilValue(userUsernameAtom);
    const errorsState = useSetRecoilState(errorAtom);


    const iconFiles = [
        {type: audioTypes, icon: <BsFillFileEarmarkMusicFill />},
        {type: imageTypes, icon: <BsFillFileEarmarkImageFill />},
        {type: videoTypes, icon: <BsFillFileEarmarkPlayFill />},
        {type: textTypes, icon: <BsFillFileEarmarkTextFill />}
    ]


    function _Error(error: any) {
        setSendingState(false);
        setMessageState("");

        if(error.includes('response') && error.response.data.includes('error')) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(!sendingState) {
            setSendingState(true);

            const message = messageState;
            let data: TData = {
                chat: messagesInfoState.chatId ? messagesInfoState.chatId : 0,
                message: message,
            }

            if(fileState !== undefined) data.file = fileState;

            setMessagesToSend((old) => [...old, data]);

            setTimeout(() => {
                setSendingState(false);
                setMessageState("");
            }, 701);
        }
    }

    function _Send(msg: TData) {
        axios.post(`${baseUrl}/messages/`, msg, {
            headers: {
                'token': jwtToken,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const newMessage = {
                id: response.data['message'].id,
                user: userUsernameState,
                message: msg.message,
                date: new Date(response.data['message'].date),
                sendedNow: true,
                file: {
                    obj: msg.file ? msg.file : undefined,
                    type: msg.file ? msg.file.type : undefined
                }
            };

            setJwtToken(response.data['token']);

            setMessagesState((old) => [...old, newMessage]);

            setMessagesToSend((old) => old.length > 1 ? old.slice(1) : []);
            setSendingMessageState(false);
            setFileState(undefined);
        }).catch(error => {
            setSendingMessageState(false);
            _Error(error);
        });
    }

    useEffect(() => {
        if(messagesToSend.length > 0 && !sendingMessageState) {
            setSendingMessageState(true);
            _Send(messagesToSend[0]);
        }
    }, [messagesToSend, sendingMessageState]);

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

    const addAudioElement = (blob: Blob) => {
        const date = new Date();
        const file = new File([blob], `audio-${userUsernameState}-${date.toJSON()}.webm`, {type:"audio/webm", lastModified: new Date().getTime()});

        if(file.size <= ACCEPTEDFILEMAXSIZE) {
            setFileState(file);
        } else {
            setFileState(undefined);
        }
    };

    const recorderControls = useAudioRecorder();

    function handleRecording() {
        if(recorderControls.isRecording) {
            recorderControls.stopRecording()
        } else {
            recorderControls.startRecording()
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
                <div className={styles.send__file__container}>
                    <input 
                        type="file"
                        name="send-file"
                        id="send-file"
                        title="Send File"
                        onChange={(e) => setFile(e)}
                        accept={ACCEPTEDFILETYPES.join(',')}
                        hidden
                    />
                    <label htmlFor="send-file" >
                        <GoFileSymlinkDirectory />
                    </label>
                </div>
                <div className={styles.send__audio__container}>
                    <div className={styles.send__audio__recorder}>
                        <AudioRecorder
                            onRecordingComplete={(blob) => addAudioElement(blob)}
                            recorderControls={recorderControls}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRecording}
                        title="send-audio"
                    >
                        {recorderControls.isRecording ? <HiStop /> : <HiMicrophone />}
                    </button>
                </div>
                <div className={styles.input__container}>
                    <Input
                        type="text"
                        name="message"
                        placeholder="....."
                        title="Send message"
                        value={messageState}
                        setValue={setMessageState}
                        maxLength={200}
                    />
                </div>
                <div className={styles.div__to__animate}></div>
                <Button 
                    title="Send message"
                    animate={false}
                >
                    <BiMailSend />
                </Button>
            </form>
            {
                fileState ?
                <div className={styles.file__preview}>
                    <div className={styles.file__icon__container}>
                        {
                            iconFiles.find(iconFile => iconFile.type.includes(fileState.type)) ?
                            iconFiles.find(iconFile => iconFile.type.includes(fileState.type))?.icon :
                            <></>
                        }
                    </div>
                    <div className={styles.file__name__container}>
                        <p>{fileState.name}</p>
                    </div>
                </div> :
                <></>
            }
        </section>
    );
}