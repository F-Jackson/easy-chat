import { useRecoilState } from "recoil";
import useLongPress from "../../../../../../../../Hooks/longPress";
import styles from "./Chat.module.scss";
import { MdOutlineWhatshot } from "react-icons/md";
import { chatSelectedAtom } from "../../../../../../../../States/chatsSelected";
import { useState } from "react";


interface Props {
    id: number,
    name: string,
    newMessages: number,

}

export default function Chat(props: Props) {
    const [clickedState, setClickedState] = useState(false);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>();

    const backspaceLongPress = useLongPress(() => AddChatToDeleteList(), 500, () => HandlesClick(), clickedState);
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);

    let newStyles = {
        borderTop: "solid white 2px"
    } as React.CSSProperties;

    function _RemoveChat() {
        const index = chatSelectedState.findIndex((id) => id === props.id);
        if (index !== -1) {
            setChatSelectedState([
                ...chatSelectedState.slice(0, index),
                ...chatSelectedState.slice(index + 1)
            ]);
        }
    }

    function _HandlePress() {
        setClickedState(true);

        clearInterval(timerId);
        setTimerId(setTimeout(() => setClickedState(false), 1000));
    }

    function AddChatToDeleteList() {
        _HandlePress();
        if(!(chatSelectedState.includes(props.id))){
            setChatSelectedState((old) => [...old, props.id]);
        } else {
            _RemoveChat();
        }
    }

    function HandlesClick() {
        _HandlePress();
        if(!(chatSelectedState.includes(props.id))){
            alert("open chat");
        } else {
            _RemoveChat();
        }
    }


    return (
        <button
            title="Open chat"
            className={styles.chat}
            {...backspaceLongPress}
            style={ chatSelectedState.includes(props.id) ? newStyles : {} as React.CSSProperties}
        >
            <img 
                src="" 
                alt="UserImage" 
                className={styles.image}
            />
            <p
                className={styles.name}
            >
                {props.name}
            </p>
            {
                props.newMessages ?
                <p
                    className={styles.newMsg}
                >
                    {props.newMessages}
                    <MdOutlineWhatshot />
                </p>
                : <></>
            }
        </button>
    );
}