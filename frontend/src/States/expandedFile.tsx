import { atom } from "recoil";
import { ReactElement, ReactNode } from 'react';


type TComponent = undefined | ReactElement | ReactNode;
type TExpandedFile = {
    component: TComponent,
    src: string,
    type: string,
    id: number
}

const expandedFileAtom = atom({
    key: "expandedFileAtom",
    default: {
        component: undefined,
        src: "",
        type: "",
        id: 0
    } as TExpandedFile
});

export { expandedFileAtom }