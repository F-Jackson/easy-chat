import Button from "../../../../Components/Button";
import Messages from "./Components/Messages";
import SendMessage from "./Components/SendMessage";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import styles from "./Communication.module.scss";
import DeleteMessages from "./Components/DeleteMessages";
import { useRecoilValue } from "recoil";
import { messagesSelectedAtom } from "../../../../States/messagesSelected";


export default function Communication() {
    const messagesSelectedState = useRecoilValue(messagesSelectedAtom);


    return (
        <>
            <div>
                {/* <MeetingProvider
                config={{
                    meetingId: "meeting-id",
                    micEnabled: true,
                    webcamEnabled: true,
                    name: "Participant Name",
                    notification: {
                        title: "Code Sample",
                        message: "Meeting is running.",
                    },
                    participantId: "xyz",
                    // For Interactive Live Streaming we can provide mode, `CONFERENCE` for Host and  `VIEWER` for remote participant.
                    mode: "CONFERENCE", // "CONFERENCE" || "VIEWER"
                    }}
                    token={"token"}
                    joinWithoutUserInteraction // Boolean
                >

                </MeetingProvider> */}
            </div>
            <Button
                title="Open your chats"
                animate={true}
            >
                chat
            </Button>
            <div className={styles.messages__container}>
                <Messages />
                { messagesSelectedState.length > 0 ? <DeleteMessages /> : <SendMessage /> }
            </div>
        </>
    );
}

const MeetingView = () => {
    const meeting = useMeeting();

    return <>...</>;
};