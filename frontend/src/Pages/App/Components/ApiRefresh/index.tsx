import { useRecoilState, useSetRecoilState } from "recoil";
import { jwtTokenAtom } from "../../../../States/user";
import { errorAtom } from "../../../../States/error";
import { useEffect } from "react";
import axios from "axios";
import { TMessage, messagesAtom, messagesInfoAtom } from "../../../../States/messages";
import { IChat, TChats, chatAtom, visualizedDateAtom } from "../../../../States/chats";
import { chatSelectedAtom } from "../../../../States/chatsSelected";
import { messagesSelectedAtom } from "../../../../States/messagesSelected";
import { inputMessagesAtom } from "../../../../States/inputMessage";
import { baseUrl } from "Constants/baseUrl";
import { expandedFileAtom } from "States/expandedFile";
import { dateNowAtom } from "States/dateNow";


type ILastMessage = {
    chat_id: number,
    has_new: boolean,
    deleted_messages: number[],
    new_messages: TMessage[],
    visualized: string
};

export default function ApiRefresh() {
    const [jwtToken, setJwtToken] = useRecoilState(jwtTokenAtom);
    const setErrorsState = useSetRecoilState(errorAtom);
    const [messagesState, setMessagesState] = useRecoilState(messagesAtom);
    const [messagesInfoState, setMessagesInfoState] = useRecoilState(messagesInfoAtom);
    const [chatsState, setChatsState] = useRecoilState(chatAtom);
    const [chatSelectedState, setChatSelectedState] = useRecoilState(chatSelectedAtom);
    const setMessagesSelectedState = useSetRecoilState(messagesSelectedAtom);
    const [inputMessagesState, setInputMessagesState]= useRecoilState(inputMessagesAtom);
    const setExpandedFile = useSetRecoilState(expandedFileAtom);
    const setDateNow = useSetRecoilState(dateNowAtom);
    const setChatVisualizedState = useSetRecoilState(visualizedDateAtom);


    function _Error(error: any) {
        if(error.includes('response') && error.response.data.includes('error')) {
            setErrorsState((_) => typeof error.response.data['error'] === 'string' ? [error.response.data['error']] : [...error.response.data['error']]);
        } else {
            setErrorsState((_) => []);
        }
    }

    function _getMessages(lastMessage: ILastMessage) {
        const newMessages = lastMessage.new_messages.map((msg: TMessage) => (
            {
                id: msg.id,
                user: msg.user,
                message: msg.message,
                date: new Date(msg.date),
                sendedNow: true,
                file: msg.file
            }
        ));
        setMessagesState((old) => [...old, ...newMessages]);
    }

    function _deleteMessages(deletedMessages: number[]) {
        const filteredMessages = messagesState.filter(msg => !deletedMessages.includes(msg.id));
        setMessagesState(filteredMessages);
    }

    function _verifyNewMessages(lastMessages: ILastMessage[]) {
        if(messagesInfoState.chatId) {
            const lastMsg = lastMessages.find(lastMsg => lastMsg.chat_id === messagesInfoState.chatId);
            const messagesStateIds = messagesState.map(msg => msg.id);

            if(lastMsg !== undefined) {
                setChatVisualizedState(new Date(lastMsg.visualized));
                if(lastMsg.has_new) {
                    const newMessages = lastMsg.new_messages.filter(newMsg => !messagesStateIds.includes(newMsg.id));
                    const deletedMessages = lastMsg.deleted_messages.filter(deletedMsg => messagesStateIds.includes(deletedMsg));
                    if(newMessages.length > 0) _getMessages(lastMsg);
                    if(deletedMessages.length > 0) _deleteMessages(deletedMessages);
                }
            };
        }
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
    
    function _ChatsNewsMessages(lastMessages: ILastMessage[]) {
        const difLastMsgs = chatsState?.map(chat => chat.hasNewMsg ? 1 : 0);

        const chats = chatsState?.map(chat => {
            const lastMsg = lastMessages.find(lastMsg => lastMsg.chat_id === chat.id);
            
            if(lastMsg && messagesInfoState.chatId !== chat.id) {

                if(lastMsg.has_new) {
                    return {
                        id: chat.id,
                        user_1: chat.user_1,
                        user_2: chat.user_2,
                        hasNewMsg: true
                    } as IChat
                }
            }
            
            return {
                id: chat.id,
                user_1: chat.user_1,
                user_2: chat.user_2,
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

    function _GetChats(lastMessagesIds: number[]) {
        setMessagesSelectedState([]);

        function setNewChats(data: any) {
            const oldChats  = chatsState?.filter(chat => lastMessagesIds.includes(chat.id));
            const oldChatsIds = oldChats?.map(chat => chat.id);

            const responseChats: TChats = data.map((chat: { id: any; user_1: string; user_2: string; last_message: Date }) => {
                return {
                    id: chat.id,
                    user_1: chat.user_1,
                    user_2: chat.user_2,
                    lastMessageDate: new Date(chat.last_message),
                    hasNewMsg: true
                }
            });
            const newChats = responseChats.filter(chat => !oldChatsIds?.includes(chat.id));

            if(oldChats) {
                setChatsState([...oldChats, ...newChats]);
            } else {
                setChatsState([...newChats]);
            }
        };

        function setInputMessages() {
            const oldInputs = inputMessagesState.filter(input => lastMessagesIds.includes(input.chatId));
            const oldInputsIds = inputMessagesState.map(input => input.chatId);

            const lastMsgs = lastMessagesIds.filter(lastMsgId => !oldInputsIds.includes(lastMsgId));
            const newInputs = lastMsgs.map(lastMsgId => ({
                chatId: lastMsgId,
                message: ""
            }));

            setInputMessagesState([...oldInputs, ...newInputs]);
        }
    
        axios.get(`${baseUrl}/chats/`, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setNewChats(response.data['chats']);

            setInputMessages();

            setJwtToken((_) => response.data['token']);
        }).catch(error => {
            _Error(error);
        });
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

    function _verifyChatInBackend(lastMessagesIds: number[]) {
        let chatsIds = chatsState?.map(chat => chat.id);
        chatsIds = chatsIds !== undefined ? chatsIds : [];

        const chatsStateChanged = _verifyUseStateChanged(chatsIds, lastMessagesIds);

        if(chatsStateChanged) { 
            _GetChats(lastMessagesIds);
            if (messagesInfoState.chatId === undefined || !chatsIds.includes(messagesInfoState.chatId)) {
                setExpandedFile({
                    component: undefined,
                    src: "",
                    type: "",
                    id: 0
                });
            }
        };

        const newSelectedChats = chatSelectedState?.filter(chatId => lastMessagesIds.includes(chatId));
        const selectedChatsStateChanged = _verifyUseStateChanged(chatSelectedState, newSelectedChats);
        if(selectedChatsStateChanged) setChatSelectedState(newSelectedChats);
    }

    function getLastMessages() {
        axios.post(`${baseUrl}/last-messages/`, {chat_id: messagesInfoState.chatId}, {
            headers: {
                'token': jwtToken
            }
        }).then(response => {
            setJwtToken(response.data['token']);

            const now = new Date(response.data['date']);

            if(now.getSeconds() % 20 === 0) setDateNow(now);

            let lastMessages: ILastMessage[] = response.data['last_messages'];
            const lastMessagesIds = lastMessages.map(lastMsg => lastMsg.chat_id);

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
        }, 500);
        return () => clearInterval(interval);
    }, [messagesInfoState.chatId, jwtToken, chatsState, messagesState]);

    useEffect(() => {
        setChatVisualizedState(undefined);
    }, [messagesInfoState.chatId])

    return (
        <></>
    );
}