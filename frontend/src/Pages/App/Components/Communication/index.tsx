import Button from "../../../../Components/Button";
import Messages from "./Components/Messages";
import SendMessage from "./Components/SendMessage";


export default function Communication() {
    return (
        <>
            <div>
                Calling
            </div>
            <Button
                title="Open your chats"
            >
                chat
            </Button>
            <Messages />
            <SendMessage />
        </>
    );
}