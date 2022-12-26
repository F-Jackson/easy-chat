import styles from "./Header.module.scss";

import Button from "../../../../Components/Button";
import Chats from "./Components/Chats";
import UserForm from "./Components/UserForm";
import { useState } from "react";
import classNames from "classnames";
import { TbMessageDots } from "react-icons/tb"

export default function Header() {
    const [sideMenuState, setSideMenuState] = useState(false);

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
                    >
                        <TbMessageDots />
                    </Button>
                </div>
                <div>
                    <UserForm />
                </div>
                <Chats />
            </aside>
        </>
    );
}