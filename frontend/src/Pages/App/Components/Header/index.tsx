import styles from "./Header.module.scss";

import Button from "../../../../Components/Button";
import Chats from "./Components/Chats";
import UserForm from "./Components/UserForm";
import { useState } from "react";
import classNames from "classnames";
import { TbMessageDots } from "react-icons/tb"
import { useRecoilValue } from "recoil";
import { jwtTokenAtom } from "../../../../States/user";
import { messagesInfoAtom } from "States/messages";

export default function Header() {
    const [sideMenuState, setSideMenuState] = useState(false);
    
    const messagesInfoState = useRecoilValue(messagesInfoAtom);
    const jwtTokenState = useRecoilValue(jwtTokenAtom);


    function openSideMenu() {
        setSideMenuState((_) => !sideMenuState)
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.talking__to__container}>
                    <img src={process.env.PUBLIC_URL + 'assets/img/user-icon-jpg-28.jpg'} alt={`Talking to ${messagesInfoState.talkingTo}`}/>
                </div>
                <Button
                    title="View your chats"
                    onClick={() => openSideMenu()}
                    animate={true}
                >
                    <TbMessageDots />
                </Button>
            </header>
            <aside className={classNames({
                [styles.asideMenu]: true,
                [styles['asideMenu--active']]: sideMenuState
            })}>
                <div
                    className={styles.buttonContainer}
                >
                    <Button
                        title="View your chats"
                        onClick={() => openSideMenu()}
                        animate={true}
                    >
                        <TbMessageDots />
                    </Button>
                </div>
                { jwtTokenState ? <Chats /> : <UserForm /> }
            </aside>
        </>
    );
}