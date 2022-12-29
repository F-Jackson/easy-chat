import { atom } from "recoil";


const errorAtom = atom({
    key: "errorAtom",
    default: [] as string[]
});

export { errorAtom }