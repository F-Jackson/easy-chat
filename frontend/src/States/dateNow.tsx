import { atom } from "recoil";


const dateNowAtom = atom({
    key: "dateNowAtom",
    default: new Date()
});

export { dateNowAtom }