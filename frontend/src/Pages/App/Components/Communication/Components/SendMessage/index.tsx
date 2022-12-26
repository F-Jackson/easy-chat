import Button from "../../../../../../Components/Button";
import Input from "../../../../../../Components/Input";

export default function SendMessage() {
    return (
        <section>
            <form>
                <Input 
                    type="text"
                    name="message"
                    placeholder="....."
                    title="Send message"
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