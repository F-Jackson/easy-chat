import styles from "./Message.module.scss";


interface Props {
    message?: string,
    owner: 'you' | 'other'
}

export default function Message(props: Props) {
    const youContainerStyle = {
        alignSelf: 'flex-end'
    };
    
    const youMessageStyle = {
        border: 'solid #2A3990 2px',
        backgroundColor: '#2A3990',
        color: 'white',
    };

    const otherContainerStyle = {
        alignSelf: 'flex-start',
    };

    const otherMessageStyle = {
        border: 'solid white 2px',
        backgroundColor: 'white',
        color: 'black'
    };


    return (
        <li 
            className={styles.message}
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