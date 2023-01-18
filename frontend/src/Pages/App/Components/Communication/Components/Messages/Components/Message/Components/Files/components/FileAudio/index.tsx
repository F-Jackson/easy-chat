import styles from './FileAudio.module.scss';


interface Props {
    file: string
    type: string
}

export default function FileAudio(props: Props) {
    return (
        <div>
            <audio controls className={styles.audio__container} >
                <source src={props.file} type={props.type}/>
            </audio>
        </div>
    );
}