import { Link } from 'react-router-dom';


interface Props {
    name: string,
    newMessages: number
}

export default function Chat(props: Props) {
    return (
        <Link>
            <img src="" alt="UserImage" />

            <div>
                <p>
                    {props.name}
                </p>
                <p>
                    {props.newMessages}
                </p>
            </div>
        </Link>
    );
}