import { useState } from "react";
import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";

export default function SendMessage() {
    const [messageState, setMessageState] = useState("");


    return (
        <section>
            <form>
                <Input 
                    type="text"
                    name="message"
                    placeholder="....."
                    title="Send message"
                    value={messageState}
                    setValue={setMessageState}
                />
            </form>
            <Button 
                type="submit"
                title="Send message"
            >
                send
            </Button>
        </section>
    );
}