import { useState } from "react";
import useLongPress from "../../Hooks/longPress";

interface Props {
    title: string,
    children?: React.ReactNode,
    handleClick: () => void,
    handleHold: () => void,
    holdTime: number,
    className: string,
    newStyles?: React.CSSProperties
}


export default function Selectable(props: Props) {
    const [clickedState, setClickedState] = useState(false);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>();

    const backspaceLongPress = useLongPress(() => HandleHold(), props.holdTime, () => HandleClick(), clickedState);

    function _HandlePress() {
        setClickedState(true);

        clearInterval(timerId);
        setTimerId(setTimeout(() => setClickedState(false), 1000));
    }

    function HandleClick() {
        _HandlePress();
        
        props.handleClick();
    }

    function HandleHold() {
        _HandlePress();

        props.handleHold();
    }


    return (
        <button
            {...backspaceLongPress}
            title={props.title}
            className={props.className}
            style={props.newStyles}
        >
            {props.children}
        </button>
    );
}