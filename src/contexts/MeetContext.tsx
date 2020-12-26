import React, {Context, createContext, Dispatch, useReducer} from "react";
import ActionTypes from "../types/ActionTypes";
import {HMSClient, LocalStream} from "@100mslive/hmsvideo-web";
import axios from 'axios';
import MeetClient from "../configs/MeetClient";
import {Action, Role, Video} from "../types/Types";

const initialState: Video = {
    userName: "",
    roomName: "",
    roomID: "",
    client: null,
    localStream: null,
    localScreen: null,
    streamObjects: null,
    msgs: [],
    role: Role.HOST,
}


const initialData: Video = {
    ...initialState,
    dispatch: (): void => {
        throw new Error('setDispatch function must be overridden');
    }
}

export const MeetContext: Context<Video> = createContext<Video>(initialData);

const videoReducer = (state: Video, action: Action): Video => {
    switch (action.type) {
        case ActionTypes.SET_ENTIRE_STATE:
            return {
                ...state,
                ...action.payload
            };
        case ActionTypes.ADD_MSG:
            return {
                ...state,
                msgs: [
                    ...state.msgs,
                    action.payload,
                ]
            };
        case ActionTypes.ADD_STREAM:
            return {
                ...state,
                streamObjects: {
                    ...state.streamObjects,
                    ...action.payload,
                }
            };
        case ActionTypes.REMOVE_STREAM:
            const streamObjects = state.streamObjects;
            delete streamObjects[action.payload];
            return {
                ...state,
                streamObjects,
            };
        default:
            return state;
    }
}


export const MeetProvider = ({children}: any): JSX.Element => {
    const [video, dispatch] = useReducer(videoReducer, initialState);

    const connect = async (): Promise<void> => {

        try {
            let roomID: string;

            if (video.role === Role.HOST) {
                const result = await axios.post(`https://ms-services-niev75452488.runkit.sh/?api=room`, {
                    room_name: video.roomName,
                });

                roomID = result.data.id;
            } else {
                roomID = video.roomID;
            }

            console.log("roomID", roomID)

            const config: MeetClient = await (new MeetClient()).initiate(video.userName, roomID, video.role);

            dispatch({
                type: ActionTypes.SET_ENTIRE_STATE,
                payload: {
                    roomID: roomID,
                    client: config.client,
                }
            });

            setListeners(roomID, config.client, dispatch);

        } catch (e) {
            console.error("err", e);
        }
    }

    return (
        <MeetContext.Provider value={{...video, dispatch, connect}}>
            {children}
        </MeetContext.Provider>
    )
}

function setListeners(roomID: string, client: HMSClient, dispatch: Dispatch<Action>) {

    client.on('connect', async () => {
        await client.join(roomID);
        const localStream: LocalStream = await client.getLocalStream({
            resolution: "vga",
            bitrate: 256,
            codec: "VP8",
            frameRate: 20,
            shouldPublishAudio: true,
            shouldPublishVideo: true,
            advancedMediaConstraints: null,
        });
        dispatch({
            type: ActionTypes.SET_ENTIRE_STATE,
            payload: {
                localStream: localStream,
            }
        });
        await client.publish(localStream, roomID);
    });

    client.on('peer-join', (room, peer) => {
        dispatch({
            type: ActionTypes.SET_ENTIRE_STATE,
            payload: {
                roomName: room.name,
            }
        });
    });

    client.on('stream-add', async (room, peer, streamInfo) => {
        // room, peer, streamInfo - hms (current)
        // mid, info - client
        const remoteStream = await client.subscribe(streamInfo.mid, room);
        dispatch({
            type: ActionTypes.ADD_STREAM,
            payload: {
                [streamInfo.mid]: {
                    stream: remoteStream,
                    name: peer.name,
                },
            }
        });
    });

    client.on('stream-remove', (room, streamInfo) => {
        dispatch({
            type: ActionTypes.REMOVE_STREAM,
            payload: streamInfo.mid,
        });
    });

    client.on('broadcast', (room, peer, message) => {
        dispatch({
            type: ActionTypes.ADD_MSG,
            payload: {
                id: Date.now().toString(),
                msg: message,
                name: peer.name,
            },
        });
    });
}