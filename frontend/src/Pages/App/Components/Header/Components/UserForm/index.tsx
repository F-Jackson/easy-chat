import styles from "./UserForm.module.scss";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { useState } from "react";


type TFormAction = "login" | "register"

export default function UserForm() {
    const [formActionState, setFormActionState] = useState<TFormAction>("login");

    function changeFormAction() {
        setFormActionState((_) => formActionState === "login" ? "register" : "login");
    }


    return (
        <section
            className={styles.userForm}
        >
            <div>
                <Button
                    title={formActionState === "login" ? "change to register" : "change to login"}
                    onClick={() => changeFormAction()}
                >
                    {formActionState}
                </Button>
            </div>
            <form
                className={styles.form}
            >
                <Input 
                    type="text"
                    name="username"
                    placeholder="Your Username"
                    title="username"
                />
                {
                    formActionState === "register" ?
                    <Input 
                        type="text"
                        name="email"
                        placeholder="User@User.com"
                        title="user email"
                    /> : <></>
                }
                <Input 
                    type="text"
                    name="password"
                    placeholder="Your Password"
                    title="user password"
                />
            </form>

            <Button 
                type="submit"
                title="Submit user form"
            >
                Send
            </Button>
        </section>
    );
}