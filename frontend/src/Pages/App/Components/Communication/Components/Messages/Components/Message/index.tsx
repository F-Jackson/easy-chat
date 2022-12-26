interface Props {
    message?: string,
    owner: 'sender' | 'recipient'
}

export default function Message(props: Props) {
    return (
        <p>
            {props.message}
        </p>
    );
}