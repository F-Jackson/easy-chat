import Message from "./Components/Message";


interface IMessage {
    id: number,
    msg: string,
    owner: 'sender' | 'recipient'
}

interface Props {
    messages?: IMessage[]
}

export default function Messages(props: Props) {
    return (
        <ul>
            {
                props.messages?.map(message => (
                    <li
                        key={message.id}
                    >
                        <Message 
                            message={message.msg}
                            owner={message.owner}
                        />
                    </li>
                ))
            }
        </ul>
    );
}