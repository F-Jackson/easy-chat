import { atom } from "recoil";


type TMessage = {
    id: string,
    user: string,
    message: string,
    date: Date,
    sendedNow: boolean
}

interface IMessagesInfo {
    chatId: number | undefined,
    talkingTo: string | undefined,
}

const messagesInfoAtom = atom({
    key: "messagesInfoAtom",
    default: {
        chatId: undefined,
        talkingTo: undefined
    } as IMessagesInfo
});

const messagesAtom = atom({
    key: "messagesAtom",
    default: [] as TMessage[]
});

export { messagesAtom, messagesInfoAtom };
export type { TMessage };
