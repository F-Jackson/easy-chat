import React, { useState } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";


interface Props {
    type?: "button" | "submit" | "reset" | undefined,
    title: string,
    children?: React.ReactNode,
    onClick?: () => void,
    animate: boolean,
    newStyle?: React.CSSProperties
}

export default function Button(props: Props) {
    const [clickedState, setClickedState] = useState(false);
    let timeOutId: NodeJS.Timeout

    function buttonClick() {
        setClickedState((_) => false);
        clearTimeout(timeOutId);

        if(props.animate) {
            setClickedState((_) => true);

            timeOutId = setTimeout(() => {
                setClickedState((_) => false)
            }, 300)
        }
    }


    return (
        <button
            type={props.type}
            title={props.title}
            onClick={() => {
                if(props.onClick) {
                    props.onClick()
                };
                buttonClick();
            }}
            className={classNames({
                [styles.button]: true,
                [styles['button--clicked']]: clickedState
            })}
            style={props.newStyle}
        >
            {props.children}
        </button>
    );
}