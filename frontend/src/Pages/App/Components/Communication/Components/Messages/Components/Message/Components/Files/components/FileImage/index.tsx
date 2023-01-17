import { FILESMAXDIMENSIONS } from "Constants/messages";

interface Props {
    file: string
}

export default function FileImage(props: Props) {

    return (
        <img 
            src={props.file} 
            alt="sended"
        />
    );
}