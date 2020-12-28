import React, {useContext} from "react";
import {MeetContext} from "../contexts/MeetContext";
import EntryForm from "../components/EntryForm";
import BottomBar from "../components/BottomBar";
import ChatWindow from "../components/ChatWindow";
import setVideoStream from "../utils/GetVideoObject";

export default function Hero(): JSX.Element {
    const {client, streamObjects, localStream, localScreen} = useContext(MeetContext);

    return client ? (
        <React.Fragment>
            <div className="call__wrapper">
                {localStream !== null && <video ref={el => setVideoStream(el, localStream, "Me")}/>}
                {localScreen !== null && <video ref={el => setVideoStream(el, localScreen, "Me")}/>}
                {streamObjects !== null && (
                    Object.values(streamObjects)?.map(object => <video
                        ref={el => setVideoStream(el, object.stream, object.name)}/>)
                )}
            </div>
            <BottomBar/>
            <ChatWindow/>
        </React.Fragment>
    ) : (
        <EntryForm/>
    );
}