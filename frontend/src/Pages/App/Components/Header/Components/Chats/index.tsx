import Chat from "./Components/Chat";


interface IChat {
    id: number,
    name: string,
    newMessages: number
}

interface Props {
    chats?: IChat[]
}

export default function Chats(props: Props) {
    return (
        <ul>
            { props.chats?.map(chat => (
                <li
                    key={chat.id}
                >
                    <Chat 
                        name={chat.name}
                        newMessages={chat.newMessages}
                    />
                </li>
            )) }
        </ul>
    );
}