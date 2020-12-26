import {LocalStream} from "@100mslive/hmsvideo-web";
import {RemoteStream} from "@100mslive/hmsvideo-web/lib/stream";

export default function getVideoElement(stream: LocalStream | RemoteStream, name: string): HTMLVideoElement {
    const video: HTMLVideoElement = document.createElement('video');
    video.autoplay = true;
    video.srcObject = stream;
    video.className = "video__item";
    video.title = name;
    return video;
}