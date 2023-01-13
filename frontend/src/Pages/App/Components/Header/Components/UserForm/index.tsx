import styles from "./UserForm.module.scss";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";
import { useState } from "react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtTokenAtom, userUsernameAtom } from "../../../../../../States/user";
import { errorAtom } from "../../../../../../States/error";
import { apiLoadingStatusAtom } from "States/apiLoadingStatus";


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
    const setUserUsernameState = useSetRecoilState(userUsernameAtom);
    const [apiLoadingStatusState, setApiLoadingStatusState] = useRecoilState(apiLoadingStatusAtom);

    function _Error(error: any) {
        setApiLoadingStatusState(false);

        setJwtToken((_) => "");
        if('response' in error && 'error' in error.response.data) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function changeFormAction() {
        setFormActionState((_) => formActionState === "login" ? "register":  "login");
    }

    function _GetUserUsername(jwtToken: string) {
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        axios.get('http://127.0.0.1:8000/user/', {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setApiLoadingStatusState(false);
            setJwtToken(response.data['token']);

            const username = response.data['user']['username']
            
            setUserUsernameState((old) => old === username ? old : username);
        }).then(error => {
            setJwtToken("");
            _Error(error);
        })
    }

    function _Login(data: IRequestData) {
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        axios.post('http://127.0.0.1:8000/auth/login/', data).then(response => {
            setApiLoadingStatusState(false);
            _GetUserUsername(response.data['token']);

            setJwtToken(response.data['token']);
        }).catch(error => {
            _Error(error);
        })
    }

    function _Register(data: IRequestData) {
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        axios.post('http://127.0.0.1:8000/user/', data).then(response => {
            setApiLoadingStatusState(false);
            _Login(data);
        }).catch(error => {
            _Error(error);
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