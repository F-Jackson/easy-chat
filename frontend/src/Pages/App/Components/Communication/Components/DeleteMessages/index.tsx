import axios from "axios";
import Button from "../../../../../../Components/Button";
import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../../../States/user";
import { messagesSelectedAtom } from "../../../../../../States/messagesSelected";
import { messagesAtom } from "../../../../../../States/messages";
import { errorAtom } from "../../../../../../States/error";
import styles from './DeleteMessages.module.scss';
import { apiLoadingStatusAtom } from "States/apiLoadingStatus";


export default function DeleteMessages() {
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [messagesSelectedState, setMessagesSelectedState] = useRecoilState(messagesSelectedAtom);
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const errorsState = useSetRecoilState(errorAtom);
    const [apiLoadingStatusState, setApiLoadingStatusState] = useRecoilState(apiLoadingStatusAtom);

    function _Error(error: any) {
        setApiLoadingStatusState(false);

        if('response' in error && 'error' in error.response.data) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function HandleClick() {
        if(apiLoadingStatusState) return;
        setApiLoadingStatusState(true);

        axios.delete(`http://127.0.0.1:8000/messages/`, {
            headers: {
                'token': jwtToken
            },
            data: {
                'messages_id_to_delete': messagesSelectedState
            }
        }).then(response => {
            setApiLoadingStatusState(false);
            setJwtToken(response.data['token']);

            const newMessages = messagesState.filter(message => !(messagesSelectedState.includes(message.id)));

            setMessagesSelectedState([]);

            setMessagesState(newMessages);
        }).catch(error => {
            _Error(error);
        });
    }


    return (
        <div 
            className={styles.delete__messages__container}
        >
            <Button
                title='Delete Messages'
                animate={true}
                onClick={() => HandleClick()}
            >
                Delete
            </Button>
        </div>
    );
}