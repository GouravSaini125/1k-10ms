import {useContext, useEffect, useState} from "react";
import {MeetContext} from "../contexts/MeetContext";
import ActionTypes from "../types/ActionTypes";
import {useLocation} from "react-router-dom";
import {Role} from "../types/Types";

export default function EntryForm(): JSX.Element {
    const {role, dispatch, roomID, roomName, userName, connect} = useContext(MeetContext);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const handleChange = (type: string, val: string): void => {
        dispatch({
            type: ActionTypes.SET_ENTIRE_STATE,
            payload: {
                [type]: val,
            }
        });
    }

    const path = new URLSearchParams(useLocation().search).get("roomID");
    useEffect(() => {
        setIsConnecting(false);
        if (path)
            dispatch({
                type: ActionTypes.SET_ENTIRE_STATE,
                payload: {
                    role: Role.GUEST,
                    roomID: path,
                }
            });
    }, []);

    return (
        <div className="main__wrapper">
            <div className="card">
                <div className="type">
                    <button onClick={() => handleChange("role", Role.HOST)}>Create Room</button>
                    <button onClick={() => handleChange("role", Role.GUEST)}>Join Room</button>
                </div>
                <form onSubmit={e => {
                    e.preventDefault();
                    if (isConnecting) {
                        alert("Already connecting...");
                        return;
                    }
                    setIsConnecting(true);
                    connect();
                }}
                >
                    {
                        role === Role.HOST ? (
                            <input
                                type="text"
                                placeholder="Room Name" required
                                value={roomName} autoFocus
                                onChange={e => handleChange("roomName", e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                placeholder="Room ID" required
                                value={roomID} autoFocus
                                onChange={e => handleChange("roomID", e.target.value)}
                            />
                        )
                    }
                    <input
                        type="text"
                        placeholder="User Name" required
                        value={userName}
                        onChange={e => handleChange("userName", e.target.value)}
                    />
                    <button type="submit">
                        {
                            role === Role.HOST ? "Create" : "Join"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}