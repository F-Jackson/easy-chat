import styles from "./Header.module.scss";

import Button from "../../../../Components/Button";
import Chats from "./Components/Chats";
import UserForm from "./Components/UserForm";
import { useState } from "react";
import classNames from "classnames";
import { TbMessageDots } from "react-icons/tb"
import { useRecoilValue } from "recoil";
import { jwtTokenAtom } from "../../../../States/user";

export default function Header() {
    const [sideMenuState, setSideMenuState] = useState(false);

    const jwtTokenState = useRecoilValue(jwtTokenAtom);

    function openSideMenu() {
        setSideMenuState((_) => !sideMenuState)
    }

    return (
        <>
            <header className={styles.header}>
                <img src="" alt="Your user"/>
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