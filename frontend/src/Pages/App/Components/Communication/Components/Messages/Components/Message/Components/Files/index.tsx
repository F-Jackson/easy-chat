import { audioTypes, imageTypes, videoTypes } from "Constants/sendMessage";
import FileImage from "./components/FileImage";
import FileVideo from "./components/FileVideo";
import FileAudio from "./components/FileAudio";
import FileCommon from "./components/FileCommon";

interface Props {
    fileLink: string,
    fileType: string
}


export default function Files(props: Props) {
    return (
        <>
            {
                imageTypes.includes(props.fileType) ? <FileImage file={props.fileLink} /> 
                : videoTypes.includes(props.fileType) ? <FileVideo file={props.fileLink} type={props.fileType} />
                : audioTypes.includes(props.fileType) ? <FileAudio file={props.fileLink} type={props.fileType} /> 
                : <FileCommon file={props.fileLink} type={props.fileType} />
            }
        </>
    );
}