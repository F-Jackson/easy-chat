import { atom } from "recoil";


interface IChat {
    id: number,
    user_1: string,
    user_2: string,
    hasNewMsg: boolean
}

type TChats = IChat[]

const chatAtom = atom({
    key: "chatAtom",
    default: [] as TChats | undefined
});

const visualizedDateAtom = atom({
    key: "visualizedDateAtom",
    default: undefined as Date | undefined
});

export { chatAtom, visualizedDateAtom }
export type { TChats, IChat }
