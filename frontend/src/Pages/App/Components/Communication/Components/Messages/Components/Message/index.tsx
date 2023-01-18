import styles from "./Message.module.scss";
import Selectable from "../../../../../../../../Components/Selectable";
import { useRecoilState } from "recoil";
import { messagesSelectedAtom } from "../../../../../../../../States/messagesSelected";
import { BiTrash } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import variables from 'styles/_variables.module.scss';
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { baseUrl } from "Constants/baseUrl";
import uniqid from "uniqid";
import Files from "./Components/Files";


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

    function getTime(): string {
        const now = new Date();

        const yearDiference = now.getFullYear() - props.date.getFullYear();
        if(yearDiference > 0) return `${yearDiference} year${yearDiference > 1 ? 's' : ''} ago`;

        const mouthDiference = now.getMonth() - props.date.getMonth();
        if(mouthDiference > 0) return `${mouthDiference} mouth${mouthDiference > 1 ? 's' : ''} ago`;

        const dayDiference = now.getDate() - props.date.getDate();
        if(dayDiference > 0) return `${dayDiference} day${dayDiference > 1 ? 's' : ''} ago`;

        const hoursDiference = now.getHours() - props.date.getHours();
        if(hoursDiference > 0) return `${hoursDiference} hour${hoursDiference > 1 ? 's' : ''} ago`;

        const minutesDiference = now.getMinutes() - props.date.getMinutes();
        if(minutesDiference > 0) return `${minutesDiference} minute${minutesDiference > 1 ? 's' : ''} ago`;

        const secondsDiference = now.getSeconds() - props.date.getSeconds();
        if(secondsDiference > 0) return `${secondsDiference} second${secondsDiference > 1 ? 's' : ''} ago`;

        return `now`;
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
                fileLink: `${baseUrl}${props.fileLink}`,
                fileType: props.fileType
            });
        }
    }, [props.fileLink, props.fileObj, props.fileType, setFile]);

    useEffect(() => {
        setFilesKey(`${uniqid()}${file.fileLink}`);
    }, [file]);

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
                        [styles['eye--visualized']]: true
                    })}
                    style={props.owner === 'you' ? {} : {color: 'transparent'} as React.CSSProperties}
                />
                <span className={styles.date}>
                    { getTime() }
                </span>
                <BiTrash 
                    className={styles.trash}
                    style={ messagesSelectedState.includes(props.id) ? { right: 0 } : {}}
                />
            </div>
        </Selectable>
    );
}