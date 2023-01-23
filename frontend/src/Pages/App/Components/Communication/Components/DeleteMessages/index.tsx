import axios from "axios";
import Button from "../../../../../../Components/Button";
import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../../../States/user";
import { messagesSelectedAtom } from "../../../../../../States/messagesSelected";
import { messagesAtom } from "../../../../../../States/messages";
import { errorAtom } from "../../../../../../States/error";
import styles from './DeleteMessages.module.scss';
import { baseUrl } from "Constants/baseUrl";
import { expandedFileAtom } from "States/expandedFile";


export default function DeleteMessages() {
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const [messagesSelectedState, setMessagesSelectedState] = useRecoilState(messagesSelectedAtom);
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const errorsState = useSetRecoilState(errorAtom);
    const [expandedFile, setExpandedFile] = useRecoilState(expandedFileAtom);

    function _Error(error: any) {
        if(error.includes('response') && error.response.data.includes('error')) {
            errorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            errorsState((_) => []);
        }
    }

    function HandleClick() {
        axios.delete(`${baseUrl}/messages/`, {
            headers: {
                'token': jwtToken
            },
            data: {
                'messages_id_to_delete': messagesSelectedState
            }
        }).then(response => {
            setJwtToken(response.data['token']);

            const newMessages = messagesState.filter(message => !(messagesSelectedState.includes(message.id)));

            if(messagesSelectedState.includes(expandedFile.id)) setExpandedFile({
                component: undefined,
                src: "",
                type: "",
                id: 0
            });

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