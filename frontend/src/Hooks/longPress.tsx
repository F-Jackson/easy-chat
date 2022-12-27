import { useState, useEffect } from 'react';

export default function useLongPress(
    callback = () => {}, 
    ms = 300, 
    click?: () => void,
    clicked = false,
) {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (startLongPress && !clicked) {
            timerId = setTimeout(() => {
                callback();
            }, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => {
            setStartLongPress(false);
        },
        onClick: () => click && !clicked ? click() : {}
    };
}