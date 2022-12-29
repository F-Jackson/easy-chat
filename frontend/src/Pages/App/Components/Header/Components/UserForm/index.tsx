import styles from "./UserForm.module.scss";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../../../States/user";
import { errorAtom } from "../../../../../../States/error";


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
    const errorsState = useSetRecoilState(errorAtom);

    function changeFormAction() {
        setFormActionState((_) => formActionState === "login" ? "register":  "login");
    }

    function _Login(data: IRequestData) {
        axios.post('http://127.0.0.1:8000/auth/login/', data).then(response => {
            setJwtToken(response.data['token']);
        }).catch(error => {
            if('response' in error &&'error' in error.response.data) {
                errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
            } else {
                errorsState((_) => []);
            }
        })
    }

    function _Register(data: IRequestData) {
        axios.post('http://127.0.0.1:8000/user/', data).then(response => {
            _Login(data);
        }).catch(error => {
            if('response' in error &&'error' in error.response.data) {
                errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
            } else {
                errorsState((_) => []);
            }
        });
    }

    function formSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = {
            'username': usernameState,
            'email': emailState,
            'password': passwordState
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
                    {formActionState === "login" ? "register" : "login" }
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