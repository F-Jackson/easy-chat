import { FaFileAlt } from "react-icons/fa";
import { baseUrl } from "Constants/baseUrl";
import styles from "./FileCommon.module.scss";

interface Props {
    file: string,
    type: string
}

export default function FileCommon(props: Props) {
    function getFileName(): string {
        const FIndex =  props.file.search('media');
        const FText = props.file.slice(FIndex);
        const SIndex = FText.search('/');
        const SText = FText.slice(SIndex);
        return SText.slice(1);
    }

    return (
        <button onClick={() => window.open(`${baseUrl}/media/${getFileName()}`)} className={styles.file}>
            <div className={styles.icon}>
                <FaFileAlt className={styles.icon__image}/>
                <p className={styles.icon__type}>{props.type}</p>
            </div>
            <p className={styles.name}>{getFileName()}</p>
        </button>
    );
}