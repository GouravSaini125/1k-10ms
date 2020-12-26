import ActionTypes from "./ActionTypes";
import {RemoteStream} from "@100mslive/hmsvideo-web/lib/stream";
import {HMSClient, LocalStream} from "@100mslive/hmsvideo-web";
import {Dispatch} from "react";

export type Action = {
    type: ActionTypes,
    payload: any,
}

export enum Role {
    HOST = "host",
    GUEST = "guest",
}

type StreamObject = {
    [mid: string]: {
        stream: RemoteStream,
        name: string,
    },
}

type Msg = {
    msg: string,
    name: string,
    id: string,
}

export type Video = {
    userName: string,
    roomName: string,
    roomID: string,
    role: Role,
    client: HMSClient | null,
    localStream: LocalStream,
    localScreen: LocalStream,
    streamObjects: StreamObject,
    msgs: Msg[],
    dispatch?: Dispatch<Action>,
    connect?: () => Promise<void>,
}

export type MediaStatus = {
    audio: boolean,
    video: boolean,
}