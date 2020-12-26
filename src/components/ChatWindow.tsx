import React, {useContext} from "react";
import ActionTypes from "../types/ActionTypes";
import {MeetContext} from "../contexts/MeetContext";

export default function ChatWindow(): JSX.Element {
    const {client, userName, roomID, dispatch, msgs} = useContext(MeetContext);

    const handleMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const id: string = Date.now().toString();
        // @ts-ignore
        const msg: string = e.target.msg.value;
        await client.broadcast({msg, senderName: userName}, roomID);
        dispatch({
            type: ActionTypes.ADD_MSG,
            payload: {
                id,
                msg,
                name: "Me",
            },
        });
        // @ts-ignore
        e.target.reset();
    }

    return (
        <div className="chat">
            {
                msgs.map(item => (
                    <div className="msg" key={item.id}>
                        {item.msg}
                        <div className="name">{item.name}</div>
                    </div>
                ))
            }
            <form onSubmit={handleMessage}>
                <input name="msg" placeholder="Type your message" type="text"/>
            </form>
        </div>
    );
}