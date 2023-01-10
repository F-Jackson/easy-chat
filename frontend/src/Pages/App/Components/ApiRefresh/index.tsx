import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../States/user";
import { errorAtom } from "../../../../States/error";
import { useEffect } from "react";
import axios from "axios";
import { TMessage, messagesAtom, messagesInfoAtom } from "../../../../States/messages";
import { IChat, TChats, chatAtom } from "../../../../States/chats";
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

    function _getMessages(lastMessageDate: Date) {
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

            const newMessageInfo = {
                chatId: messagesInfoState.chatId,
                talkingTo: messagesInfoState.talkingTo,
                lastMessageDate: new Date(lastMessageDate)
            } 

            setMessagesInfoState(newMessageInfo);

            setMessagesSelectedState((old) => (
                old.filter(oldId => messagesIds.includes(oldId))
            ));
        }).catch(error => {
            _Error(error);
        });
    }

    function _compareDate(lastMsg: Date, messagesLastDate: Date): boolean {
        const day = lastMsg.getDate() <= messagesLastDate.getDate();
        const month = lastMsg.getMonth() <= messagesLastDate.getMonth();
        const hours = lastMsg.getHours() <= messagesLastDate.getHours();
        const minutes = lastMsg.getMinutes() <= messagesLastDate.getMinutes();
        const seconds = lastMsg.getSeconds() - messagesLastDate.getSeconds();

        const toCompare = [month, day, hours, minutes];

        for(let i=0; i<toCompare.length; i++) {
            if(!toCompare[i]) {
                return true;
            };
        }

        if(Math.abs(seconds) > 2) return true;
        return false;
    }

    function _verifyNewMessages(lastMessages: ILastMessage[]) {
        if(messagesInfoState.chatId) {
            const lastMsg = lastMessages.find(lastMsg => lastMsg.id === messagesInfoState.chatId);

            if(lastMsg === undefined) return;

            const messagesLastDate = messagesInfoState.lastMessageDate;

            const diferentDates = _compareDate(lastMsg.last_message, messagesLastDate);

            if(!diferentDates) return;

            _getMessages(lastMsg.last_message);
        }
    }

    function _GetChats() {
        setMessagesSelectedState([]);
    
        axios.get('http://127.0.0.1:8000/chats/', {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            const chats: TChats = response.data['chats'].map((chat: { id: any; user_1: string; user_2: string; last_message: Date }) => {
                return {
                    id: chat.id,
                    user_1: chat.user_1,
                    user_2: chat.user_2,
                    lastMessageDate: new Date(chat.last_message),
                    hasNewChat: false
                }
            });
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

    function _ChatsNewsMessages(lastMessages: ILastMessage[]) {
        const difLastMsgs = chatsState?.map(chat => chat.hasNewMsg ? 1 : 0);

        const chats = chatsState?.map(chat => {
            const lastMsgDate = lastMessages.find(lastMsg => lastMsg.id === chat.id);
            
            if(lastMsgDate && messagesInfoState.chatId !== chat.id) {
                const diferentDates = _compareDate(lastMsgDate.last_message, chat.lastMessageDate);

                if(diferentDates) {
                    return {
                        id: chat.id,
                        user_1: chat.user_1,
                        user_2: chat.user_2,
                        lastMessageDate: new Date(lastMsgDate.last_message),
                        hasNewMsg: true
                    } as IChat
                }
            }
            
            return {
                id: chat.id,
                user_1: chat.user_1,
                user_2: chat.user_2,
                lastMessageDate: new Date(chat.lastMessageDate),
                hasNewMsg: chat.hasNewMsg
            } as IChat
        });

        const difNewLastMsgs = chats?.map(chat => chat.hasNewMsg ? 1 : 0);

        if(difLastMsgs && difNewLastMsgs) {
            if(_verifyUseStateChanged(difLastMsgs, difNewLastMsgs)) {
                setChatsState((_) => chats);
            }
        }
    }

    function _verifyUseStateChanged(oldState: number[] | boolean[], newState: number[] | boolean[]): boolean {
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
                    talkingTo: undefined,
                    lastMessageDate: new Date()
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

            _ChatsNewsMessages(lastMessages);

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