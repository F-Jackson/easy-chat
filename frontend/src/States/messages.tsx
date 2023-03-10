import { atom } from "recoil";


type TFile = {
    link?: string,
    type?: string,
    obj?: Blob | File
}

type TMessage = {
    id: number,
    user: string,
    message: string,
    date: Date,
    sendedNow: boolean,
    file: TFile
}

interface IMessagesInfo {
    chatId: number | undefined,
    talkingTo: string | undefined
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
