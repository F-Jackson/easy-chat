import { FaFileAlt } from "react-icons/fa";

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
        return SText;
    }

    return (
        <div>
            <div>
                <FaFileAlt />
                <p>{props.type}</p>
            </div>
            <p>{getFileName()}</p>
        </div>
    );
}