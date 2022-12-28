import Button from "../../../../Components/Button";
import Messages from "./Components/Messages";
import SendMessage from "./Components/SendMessage";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import styles from "./Communication.module.scss";


export default function Communication() {
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
            <Messages />
            <SendMessage />
        </>
    );
}

const MeetingView = () => {
    const meeting = useMeeting();

    return <>...</>;
};