interface Props {
    file: string
    type: string
}

export default function FileAudio(props: Props) {

    return (
        <audio controls>
            <source src={props.file} type={props.type}/>
        </audio>
    );
}