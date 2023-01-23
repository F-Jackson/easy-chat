import { expandedFileAtom } from "States/expandedFile";
import { ReactNode } from "react"
import { useSetRecoilState } from "recoil"
import styles from './ExpandFile.module.scss';
import { FiArrowUpLeft, FiArrowUpRight, FiArrowDownLeft, FiArrowDownRight } from 'react-icons/fi';


interface Props {
    children: ReactNode,
    type: string,
    src: string,
    expands?: boolean,
    id: number
}

export default function ExpandFile(props: Props) {
    const setExpandedFile = useSetRecoilState(expandedFileAtom);

    function Expand() {
        setExpandedFile((_) => (
            {
                component: props.children,
                src: props.src,
                type: props.type,
                id: props.id
            }
        ));
    }

    return (
        <>
            {
                props.expands === undefined || props.expands === true ?
                <button onClick={(e) => Expand()} className={styles.expand}>
                    {props.children}
                    <div className={styles.expand__icons}>
                        <FiArrowUpLeft className={styles.arrow1}/>
                        <FiArrowUpRight className={styles.arrow2}/>
                        <FiArrowDownLeft className={styles.arrow3}/>
                        <FiArrowDownRight className={styles.arrow4}/>
                    </div>
                </button> : 
                <>
                    {props.children}
                </>
            }
        </>
    );
}