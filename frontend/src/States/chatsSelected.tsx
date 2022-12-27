import { atom } from "recoil";


const chatSelectedAtom = atom({
    key: "chatSelectedAtom",
    default: [] as number[]
});

export { chatSelectedAtom }