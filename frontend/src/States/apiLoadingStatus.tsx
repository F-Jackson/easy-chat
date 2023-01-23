import { atom } from "recoil";

const apiLoadingQueueAtom = atom({
    key: "apiLoadingQueueAtom",
    default: []
});

export { apiLoadingQueueAtom }