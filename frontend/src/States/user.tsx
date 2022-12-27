import { atom } from "recoil";


const jwtTokenAtom = atom({
    key: "jwtTokenAtom",
    default: "" as string
});

export { jwtTokenAtom }