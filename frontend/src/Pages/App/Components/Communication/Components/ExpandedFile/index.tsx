import { expandedFileAtom } from "States/expandedFile";
import { useRecoilState } from "recoil";
import Files from "../Messages/Components/Message/Components/Files";
import { useEffect, useState } from "react";
import styles from "./ExpandedFile.module.scss";
import Button from "Components/Button";

export default function ExpandedFile() {
    const [expandedFile, setExpandedFile] = useRecoilState(expandedFileAtom);
    const [extend, setExtend] = useState(false);

    const newStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '4',
        marginLeft: '15px',
        marginTop: '15px'
    } as React.CSSProperties

    useEffect(() => {
        setExtend(expandedFile.src !== undefined && expandedFile.src !== null && expandedFile.type !== undefined && expandedFile.type !== null);
    }, [expandedFile]);

    return (
        <div className={styles.file}>
            <Button onClick={() => setExpandedFile((_) => (
                {
                    component: undefined,
                    type: '',
                    src: ''
                }
            ))} newStyle={newStyle} title={"Close fullscreen"} animate={true}>X</Button>
            {
                extend ?
                <Files fileLink={expandedFile.src} fileType={expandedFile.type} controls={true} expands={false}/> :
                <></>
            }
        </div>
    )
}