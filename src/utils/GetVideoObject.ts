import {LocalStream} from "@100mslive/hmsvideo-web";
import {RemoteStream} from "@100mslive/hmsvideo-web/lib/stream";

export default function setVideoStream(video: HTMLVideoElement, stream: LocalStream | RemoteStream, name: string): void {
    if (!video)
        return
    video.autoplay = true;
    video.srcObject = stream;
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
    if (stream instanceof LocalStream) {
        video.muted = true;
        video.style.webkitTransform = "scaleX(-1)";
        video.style.transform = "scaleX(-1)";
    }
}