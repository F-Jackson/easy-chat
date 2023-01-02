import { atom } from "recoil";


type TMessage = {
    id: string,
    user: string,
    message: string,
    date: Date
}

interface IMessages {
    chatId: number | undefined,
    talkingTo: string | undefined,
    messages: TMessage[]
}

const messagesAtom = atom({
    key: "messagesAtom",
    default: {
        chatId: undefined,
        talkingTo: undefined,
        messages: []
    } as IMessages
});

export { messagesAtom };
