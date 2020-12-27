import {LocalStream} from "@100mslive/hmsvideo-web";
import {RemoteStream} from "@100mslive/hmsvideo-web/lib/stream";

export default function getVideoElement(stream: LocalStream | RemoteStream, name: string): HTMLVideoElement {
    const video: HTMLVideoElement = document.createElement('video');
    video.autoplay = true;
    video.srcObject = stream;
    video.muted = stream instanceof LocalStream;
    video.className = "video__item";
    video.title = name;
    video.style.cursor = "zoom-in";
    video.onclick = e => {
        if (video.requestFullscreen)
            video.requestFullscreen();
        // @ts-ignore
        else if (video.webkitRequestFullscreen)
            // @ts-ignore
            video.webkitRequestFullscreen();
        // @ts-ignore
        else if (video.msRequestFullScreen)
            // @ts-ignore
            video.msRequestFullScreen();
    }
    return video;
}