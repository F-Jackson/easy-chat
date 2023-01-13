import { atom } from "recoil";


const apiLoadingStatusAtom = atom({
    key: "apiLoadingStatusAtom",
    default: false as boolean
});

export { apiLoadingStatusAtom }