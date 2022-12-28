import styles from "./UserForm.module.scss";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../../../States/user";


interface IRequestData {
    username: string,
    email: string,
    password: string
}

type TFormAction = "login" | "register";

export default function UserForm() {
    const [formActionState, setFormActionState] = useState<TFormAction>("login");

    const [usernameState, setUsernameState] = useState("");
    const [emailState, setEmailState] = useState("");
    const [passwordState, setPasswordState] = useState("");

    const setJwtToken = useSetRecoilState(jwtTokenAtom);

    function changeFormAction() {
        setFormActionState((_) => formActionState === "login" ? "register" : "login");
    }

    function _Login(data: IRequestData) {

        axios.post('http://127.0.0.1:8000/user/', data).then(response => {
            setJwtToken(response.data['token']);
        }).catch(error => {

        })
    }

    function _Register(data: IRequestData) {
        axios.put('http://127.0.0.1:8000/user/', data).then(response => {
            _Login(data);
        }).catch(error => {

        });
    }

    function formSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = {
            username: usernameState,
            email: emailState,
            password: passwordState
        }

        formActionState === "login" ? _Login(data) : _Register(data)
    }


    return (
        <section
            className={styles.userForm}
        >
            <div>
                <Button
                    title={formActionState === "login" ? "Change to register" : "Change to login"}
                    onClick={() => changeFormAction()}
                    animate={true}
                >
                    {formActionState}
                </Button>
            </div>
            <form
                className={styles.form}
                onSubmit={(e) => formSubmit(e)}
            >
                <Input 
                    type="text"
                    name="username"
                    placeholder="Your Username"
                    title="username"
                    value={usernameState}
                    setValue={setUsernameState}
                />
                {
                    formActionState === "register" ?
                    <Input 
                        type="email"
                        name="email"
                        placeholder="User@User.com"
                        title="user email"
                        value={emailState}
                        setValue={setEmailState}
                    /> : <></>
                }
                <Input 
                    type="password"
                    name="password"
                    placeholder="Your Password"
                    title="user password"
                    value={passwordState}
                    setValue={setPasswordState}
                />
                <Button 
                    type="submit"
                    title="Submit user form"
                    animate={true}
                >
                    Send
                </Button>
            </form>
        </section>
    );
}