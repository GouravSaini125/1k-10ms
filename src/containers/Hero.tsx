import React, {useContext, useEffect, useRef} from "react";
import {MeetContext} from "../contexts/MeetContext";
import EntryForm from "../components/EntryForm";
import BottomBar from "../components/BottomBar";
import ChatWindow from "../components/ChatWindow";
import getVideoElement from "../utils/GetVideoObject";

export default function Hero(): JSX.Element {
    const {client, streamObjects, localStream, userName, localScreen} = useContext(MeetContext);
    const containerRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (containerRef.current) {
            const el: HTMLDivElement = document.createElement('div');
            if (localStream) {
                el.appendChild(getVideoElement(localStream, userName));
            }
            if (localScreen) {
                el.appendChild(getVideoElement(localScreen, userName));
            }
            streamObjects && Object.values(streamObjects)?.forEach(object => {
                el.appendChild(getVideoElement(object.stream, object.name));
            });
            containerRef.current.replaceChild(el, containerRef.current.firstChild);
        }
    }, [containerRef.current, streamObjects, localScreen])

    return client ? (
        <React.Fragment>
            <div ref={containerRef} key={streamObjects ? Object.keys(streamObjects).length : 0}>
                <div/>
            </div>
            <BottomBar/>
            <ChatWindow/>
        </React.Fragment>
    ) : (
        <EntryForm/>
    );
}
