import ExpandFile from '../ExpandFile';
import styles from './FileVideo.module.scss';

interface Props {
    file: string,
    type: string,
    controls?: boolean,
    expands?: boolean,
    id: number
}

export default function FileImage(props: Props) {
    return (
        <ExpandFile type={props.type} src={props.file} expands={props.expands} id={props.id}>
            <video
                className={styles.video__container}
                controls={props.controls ? props.controls : false}
            >
                <source src={props.file} type={props.type}/>
            </video>
        </ExpandFile>
    );
}