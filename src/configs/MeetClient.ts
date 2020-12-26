import {HMSClient, HMSClientConfig, HMSPeer} from "@100mslive/hmsvideo-web";
import axios from "axios";
import {Role} from "../types/Types";

async function getToken(user_name: string, room_id: string, role: Role): Promise<string> {
    const response = await axios.post(`https://ms-services-niev75452488.runkit.sh/?api=token`, {
        room_id, user_name, role
    });
    return response.data.token;
}

export default class MeetClient {
    public client: HMSClient | null;
    private readonly config: HMSClientConfig;

    constructor() {
        this.client = null;
        this.config = new HMSClientConfig({
            endpoint: "wss://qa-in.100ms.live"
        });
    }

    public async initiate(userName: string, roomID: string, role: Role): Promise<MeetClient> {
        const authToken: string = await getToken(userName, roomID, role);
        const peer: HMSPeer = new HMSPeer(userName, authToken);
        const client: HMSClient = new HMSClient(peer, this.config);
        await client.connect();
        this.client = client;

        return this;
    }
}