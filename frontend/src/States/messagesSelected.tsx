import { atom } from "recoil";


const messagesSelectedAtom = atom({
    key: "messagesSelectedAtom",
    default: [] as string[]
});

export { messagesSelectedAtom }