import { atom } from "recoil";


const jwtTokenAtom = atom({
    key: "jwtTokenAtom",
    default: "" as string
});

const userUsernameAtom = atom({
    key: "usernameAtom",
    default: "" as string
});

export { jwtTokenAtom, userUsernameAtom }