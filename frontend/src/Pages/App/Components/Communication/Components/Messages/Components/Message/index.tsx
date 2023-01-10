import classNames from "classnames";
import styles from "./Message.module.scss";
import Selectable from "../../../../../../../../Components/Selectable";
import { useRecoilState } from "recoil";
import { messagesSelectedAtom } from "../../../../../../../../States/messagesSelected";
import { BiTrash } from "react-icons/bi";


interface Props {
    id: string,
    message?: string,
    owner: 'you' | 'other',
    sendedNow: boolean,
}

export default function Message(props: Props) {
    const [messagesSelectedState, setMessagesSelectedState] = useRecoilState(messagesSelectedAtom);

    const youContainerStyle = {
        alignSelf: 'flex-end',
        '--from-position-animation': '300px'
    };

    const youMessageStyle = {
        border: 'solid #2A3990 2px',
        backgroundColor: '#2A3990',
        color: 'white',
    };

    const otherContainerStyle = {
        alignSelf: 'flex-start',
        '--from-position-animation': '-300px'
    };

    const otherMessageStyle = {
        border: 'solid white 2px',
        backgroundColor: 'white',
        color: 'black'
    };

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


    return (
        <li 
            className={classNames({
                [styles.message]: true,
                [styles['message--sendedNow']]: props.sendedNow,
                [styles['message--notSendedNow']]: !props.sendedNow,
            })}
            style={ props.owner === 'you' ? youContainerStyle : otherContainerStyle}
        >
            <Selectable
                title="Select message"
                className={styles.message__selectable}
                handleClick={HandleClick}
                handleHold={AddMessageToDeleteList}
                holdTime={250}
                newStyles={ messagesSelectedState.includes(props.id) ? { borderBottom: '2px solid rgb(133, 0, 0)' } : {} }
            >
                <BiTrash 
                    className={styles.trash}
                    style={ messagesSelectedState.includes(props.id) ? { right: 0 } : {}}
                />
                <p
                    className={styles.message__text}
                    style={ props.owner === 'you' ? youMessageStyle : otherMessageStyle }
                >
                    {props.message}
                </p>
            </Selectable>
        </li>
    );
}