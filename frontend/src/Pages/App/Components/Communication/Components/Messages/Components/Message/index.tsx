import styles from "./Message.module.scss";
import Selectable from "../../../../../../../../Components/Selectable";
import { useRecoilState, useRecoilValue } from "recoil";
import { messagesSelectedAtom } from "../../../../../../../../States/messagesSelected";
import { BiTrash } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import variables from 'styles/_variables.module.scss';
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { baseUrl } from "Constants/baseUrl";
import uniqid from "uniqid";
import Files from "./Components/Files";
import { dateNowAtom } from "States/dateNow";
import { visualizedDateAtom } from "States/chats";


type TFile = {
    fileLink: string | undefined,
    fileType: string | undefined
}

interface Props {
    id: number,
    message?: string,
    owner: 'you' | 'other',
    sendedNow: boolean,
    date: Date,
    fileLink?: string
    fileType?: string,
    fileObj?: File | Blob
}

export default function Message(props: Props) {
    const [messagesSelectedState, setMessagesSelectedState] = useRecoilState(messagesSelectedAtom);
    const [file, setFile] = useState<TFile>({fileLink: undefined, fileType: undefined});
    const [filesKey, setFilesKey] = useState("");
    const [timeState, setTimeState] = useState<string>();
    const dateNow = useRecoilValue(dateNowAtom);
    const chatVisualizedState = useRecoilValue(visualizedDateAtom);

    function HandleClick() {
        const newMessages = messagesSelectedState.filter(msgId => msgId !== props.id);
        setMessagesSelectedState(newMessages);
    };

    function AddMessageToDeleteList() {
        if(props.owner === 'you') {
            if(messagesSelectedState.includes(props.id)) {
                const newMessages = messagesSelectedState.filter(msgId => msgId !== props.id);
                setMessagesSelectedState(newMessages);
            } else {
                setMessagesSelectedState((old) => [...old, props.id]);
            }
        }
    };

    function getTime() {
        const seconds = Math.floor((dateNow.getTime() - props.date.getTime()) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const mouths = dateNow.getMonth() - props.date.getMonth();
        const years = dateNow.getFullYear() - props.date.getFullYear();

        if(years > 0) {
            setTimeState(`${years} year${years > 1 ? 's' : ''} ago`);
            return;
        }
        
        if(mouths > 0) {
            setTimeState(`${mouths} mouth${mouths > 1 ? 's' : ''} ago`);
            return;
        }

        if(days > 0) {
            setTimeState(`${days} day${days > 1 ? 's' : ''} ago`); 
            return;
        }

        if(hours > 0) {
            setTimeState(`${hours} hour${hours > 1 ? 's' : ''} ago`);
            return;
        }

        if(minutes > 0) {
            setTimeState(`${minutes} minute${minutes > 1 ? 's' : ''} ago`); 
            return;
        }

        if(seconds > 5) {
            setTimeState(`${seconds} second${seconds > 1 ? 's' : ''} ago`);
            return;
        }

        setTimeState(`now`);
    }

    useEffect(() => {
        if(props.fileObj !== undefined && props.fileObj !== null) {
            setFile({
                fileLink: URL.createObjectURL(props.fileObj),
                fileType: props.fileType
            });
            return;
        }

        if(props.fileLink !== undefined && props.fileLink !== null && props.fileType !== undefined && props.fileType !== null) {
            setFile({
                fileLink: `${baseUrl}/${props.fileLink}`,
                fileType: props.fileType
            });
        }
    }, [props.fileLink, props.fileObj, props.fileType, setFile]);

    useEffect(() => {
        setFilesKey(`${uniqid()}${file.fileLink}`);
    }, [file]);

    useEffect(() => {
        getTime();
    }, [dateNow]);

    return (
        <Selectable
            title="Select message"
            className={classNames({
                [styles.message__selectable]: true,
                [variables['messages__component__you']]: props.owner === 'you',
                [variables['messages__component__other']]: props.owner !== 'you'
            })}
            handleClick={HandleClick}
            handleHold={AddMessageToDeleteList}
            holdTime={250}
        >
            <p
                className={classNames({
                    [styles.message__text]: true
                })}
            >
                { props.message }
            </p>
            {
                file.fileLink !== undefined && file.fileLink !== null && file.fileType !== undefined && file.fileType !== null ? 
                <div key={filesKey} className={styles.file}>
                    <Files
                        fileLink={file.fileLink}
                        fileType={file.fileType}
                        id={props.id}
                    />
                </div> : <></>
            }
            <div 
                className={classNames({
                    [styles.notifications__details]: true,
                    [variables['chat__delete__component']]: messagesSelectedState.includes(props.id)
                })}
            >
                <GoEye 
                    className={classNames({
                        [styles.eye]: true,
                        [styles['eye--visualized']]: chatVisualizedState && chatVisualizedState?.getTime() >= props.date.getTime()
                    })}
                    style={props.owner === 'you' ? {} : {color: 'transparent'} as React.CSSProperties}
                />
                <span className={styles.date}>
                    { timeState }
                </span>
                <BiTrash 
                    className={styles.trash}
                    style={ messagesSelectedState.includes(props.id) ? { right: 0 } : {}}
                />
            </div>
        </Selectable>
    );
}