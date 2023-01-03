import classNames from "classnames";
import styles from "./Message.module.scss";


interface Props {
    message?: string,
    owner: 'you' | 'other',
    sendedNow: boolean
}

export default function Message(props: Props) {
    let youContainerStyle = {
        alignSelf: 'flex-end',
        '--from-position-animation': '300px'
    };

    const youMessageStyle = {
        border: 'solid #2A3990 2px',
        backgroundColor: '#2A3990',
        color: 'white',
    };

    let otherContainerStyle = {
        alignSelf: 'flex-start',
        '--from-position-animation': '-300px'
    };

    const otherMessageStyle = {
        border: 'solid white 2px',
        backgroundColor: 'white',
        color: 'black'
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
            <p
                className={styles.message__text}
                style={ props.owner === 'you' ? youMessageStyle : otherMessageStyle}
            >
                {props.message}
            </p>
        </li>
    );
}