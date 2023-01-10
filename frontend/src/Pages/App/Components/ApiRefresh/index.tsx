import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../States/user";
import { errorAtom } from "../../../../States/error";
import { useEffect } from "react";
import axios from "axios";
import { TMessage, messagesAtom, messagesInfoAtom } from "../../../../States/messages";
import { TChats, chatAtom } from "../../../../States/chats";
import { chatSelectedAtom } from "../../../../States/chatsSelected";
import { messagesSelectedAtom } from "../../../../States/messagesSelected";
import { inputMessagesAtom } from "../../../../States/inputMessage";


type ILastMessage = {
    id: number,
    last_message: Date
};

export default function ApiRefresh() {
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const setErrorsState = useSetRecoilState(errorAtom);
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const [messagesInfoState, setMessagesInfoState] = useRecoilState(messagesInfoAtom);
    const [chatsState, setChatsState] = useRecoilState(chatAtom);
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const setMessagesSelectedState = useSetRecoilState(messagesSelectedAtom);
    const setInputMessagesState = useSetRecoilState(inputMessagesAtom);


    function _Error(error: any) {
        if('response' in error && 'error' in error.response.data) {
            setErrorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            setErrorsState((_) => []);
        }
    }

    function _getMessages() {
        axios.get(`http://127.0.0.1:8000/messages/chat/${messagesInfoState.chatId}/page:1/`, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setJwtToken(response.data['token']);
            const messages: TMessage[] = response.data['messages'].map((msg: TMessage) => (
                {
                    id: msg.id,
                    user: msg.user,
                    message: msg.message,
                    date: new Date(msg.date),
                    sendedNow: false
                }
            )).reverse();

            const messagesIds= messages.map(msg => msg.id);
            const oldMessages = messagesState.filter(msg => !messagesIds.includes(msg.id));

            setMessagesState([...oldMessages, ...messages]);
        }).catch(error => {
            _Error(error);
        });
    }

    function _compareDate(lastMsg: Date, messagesLastDate: Date): boolean {
        const day = lastMsg.getDate() === messagesLastDate.getDate();
        const month = lastMsg.getMonth() === messagesLastDate.getMonth();
        const hours = lastMsg.getHours() === messagesLastDate.getHours();
        const minutes = lastMsg.getMinutes() === messagesLastDate.getMinutes();
        const seconds = lastMsg.getSeconds() - messagesLastDate.getSeconds();

        const isNotDiference = [day, month, hours, minutes].every(value => value === true);

        if(Math.abs(seconds) > 5 || !isNotDiference) return true;
        return false;
    }

    function _verifyNewMessages(lastMessages: ILastMessage[]) {
        if(messagesInfoState.chatId) {
            const lastMsg = lastMessages.find(lastMsg => lastMsg.id === messagesInfoState.chatId);

            if(lastMsg === undefined) return;

            if(messagesState.length === 0) {
                _getMessages();
                return;
            }

            const messagesLastDate = messagesState[messagesState.length - 1].date;

            const diferentDates = _compareDate(lastMsg.last_message, messagesLastDate);

            if(!diferentDates) return;

            _getMessages();
        }
    }

    function _GetChats() {
        setMessagesSelectedState([]);
    
        axios.get('http://127.0.0.1:8000/chats/', {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            const chats: TChats = response.data['chats'];
            setChatsState((_) => chats);

            setInputMessagesState((_) => chats.map(chat => {
                return {
                    chatId: chat.id,
                    message: ""
                }
            }));

            setJwtToken((_) => response.data['token']);
        }).catch(error => {
            _Error(error);
        });
    }

    function _verifyUseStateChanged(oldState: number[], newState: number[]): boolean {
        if(oldState.length !== newState.length) return true;

        const oldStateSorted = oldState.sort();
        const newStateSorted = newState.sort(); 

        for(let oldStateIndex = 0; oldStateIndex < oldStateSorted.length; oldStateIndex++) {
            if(oldStateSorted[oldStateIndex] !== newStateSorted[oldStateIndex]) return true;
        }

        return false;
    }

    function _verifyMessageInfoState(lastMessagesIds: number[]) {
        if(messagesInfoState.chatId) {
            const messagesChatsIdInLastMessages = lastMessagesIds.includes(messagesInfoState.chatId);

            if (!messagesChatsIdInLastMessages) {
                setMessagesInfoState({
                    chatId: undefined,
                    talkingTo: undefined
                });

                setMessagesState([]);
            }
        };
    }

    function _verifyChatInBackend(lastMessagesIds: number[]) {
        const chatsIds = chatsState?.map(chat => chat.id);

        if(chatsIds) {
            const chatsStateChanged = _verifyUseStateChanged(chatsIds, lastMessagesIds);
            if(chatsStateChanged) _GetChats();
        }

        const newSelectedChats = chatSelectedState?.filter(chatId => lastMessagesIds.includes(chatId));
        const selectedChatsStateChanged = _verifyUseStateChanged(chatSelectedState, newSelectedChats);
        if(selectedChatsStateChanged) setChatSelectedState(newSelectedChats);
    }

    function getLastMessages() {
        axios.get('http://127.0.0.1:8000/last-messages', {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setJwtToken(response.data['token']);

            let lastMessages: ILastMessage[] = response.data['last_messages'];
            lastMessages = lastMessages.map(lastMsg => {
                return {
                    id: lastMsg.id,
                    last_message: new Date(lastMsg.last_message)
                };
            });
            const lastMessagesIds = lastMessages.map(lastMsg => lastMsg.id);

            _verifyChatInBackend(lastMessagesIds);

            _verifyMessageInfoState(lastMessagesIds);

            _verifyNewMessages(lastMessages);
        }).catch(error => {
            _Error(error);
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(jwtToken) getLastMessages();
        }, 1000);
        return () => clearInterval(interval);
    }, [messagesInfoState.chatId, jwtToken, chatsState, messagesState]);

    return (
        <></>
    );
}