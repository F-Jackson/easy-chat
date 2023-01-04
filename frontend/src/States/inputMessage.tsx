import { atom } from "recoil";


type TInputMessage = {
    chatId: number,
    message: string
}

const inputMessagesAtom = atom({
    key: "inputMessagesAtom",
    default: [] as TInputMessage[]
});

export { inputMessagesAtom };