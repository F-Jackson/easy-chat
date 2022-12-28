import styles from "./Message.module.scss";


interface Props {
    message?: string,
    owner: 'sender' | 'recipient'
}

export default function Message(props: Props) {
    return (
        <p className={styles.message}>
            {props.message}
        </p>
    );
}