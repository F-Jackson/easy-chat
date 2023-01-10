import { atom } from "recoil";


interface IChat {
    id: number,
    user_1: string,
    user_2: string,
    lastMessageDate: Date,
    hasNewMsg: boolean
}

type TChats = IChat[]

const chatAtom = atom({
    key: "chatAtom",
    default: [] as TChats | undefined
});

export { chatAtom }
export type { TChats, IChat }
