import { FILESMAXDIMENSIONS } from "Constants/messages";

interface Props {
    file: string,
    type: string
}

export default function FileImage(props: Props) {

    return (
        <video
            controls
        >
            <source src={props.file} type={props.type}/>
        </video>
    );
}