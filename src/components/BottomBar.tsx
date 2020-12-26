import React, {useContext, useState} from "react";
import {MediaStatus} from "../types/Types";
import {MeetContext} from "../contexts/MeetContext";
import {LocalStream} from "@100mslive/hmsvideo-web";
import ActionTypes from "../types/ActionTypes";

export default function BottomBar(): JSX.Element {
    const {client, localStream, roomID, dispatch, localScreen} = useContext(MeetContext);
    const [mediaStatus, setMediaStatus] = useState<MediaStatus>({audio: true, video: true});

    const toggleMedia = async (type: "audio" | "video"): Promise<void> => {
        if (mediaStatus[type]) {
            setMediaStatus(prevState => {
                return {...prevState, [type]: false}
            })
            await localStream.mute(type);
        } else {
            setMediaStatus(prevState => {
                return {...prevState, [type]: true}
            })
            await localStream.unmute(type);
        }
    }

    const toggleScreen = async (): Promise<void> => {
        if (localScreen !== null) {
            await localScreen.unpublish();
            dispatch({
                type: ActionTypes.SET_ENTIRE_STATE,
                payload: {
                    localScreen: null,
                }
            });
            return;
        }
        const screen: LocalStream = await client.getLocalScreen({
            advancedMediaConstraints: undefined,
            resolution: "vga",
            shouldPublishAudio: true,
            shouldPublishVideo: true,
            bitrate: 0,
            codec: "VP8",
            frameRate: 10
        });
        await screen.publish(roomID);
        dispatch({
            type: ActionTypes.SET_ENTIRE_STATE,
            payload: {
                localScreen: screen,
            }
        });
    }

    return (
        <div className="bottomBar">
            <button onClick={() => toggleMedia("video")}>{
                mediaStatus.video ? "Off Video" : "On Video"
            }</button>
            <button onClick={() => toggleMedia("audio")}>{
                mediaStatus.audio ? "Off Audio" : "On Audio"
            }</button>
            <button onClick={toggleScreen}>{
                localScreen === null ? "Share Screen" : "Stop Sharing"
            }</button>
            <div className="room-id"
                 title="CLICK TO COPY"
                 onClick={() => (
                     navigator.clipboard.writeText(`${window.location.href.split("?")[0]}?roomID=${roomID}`)
                 )}
            >Join Link : {`${window.location.href.split("?")[0]}?roomID=${roomID}`}</div>
        </div>
    );
}