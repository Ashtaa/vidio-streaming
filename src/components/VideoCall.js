import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const VideoCall = () => {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [connected, setConnected] = useState(false);

    const localVideo = useRef();
    const remoteVideo = useRef();
    const peerInstance = useRef();

    useEffect(() => {
        // Initialize PeerJS
        const peer = new Peer();
        peerInstance.current = peer;

        // Get and set the user's unique peer ID
        peer.on("open", (id) => {
            setPeerId(id);
            console.log("My Peer ID:", id);
        });

        // Handle incoming call
        peer.on("call", (call) => {
            // Get user's media stream
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    // Answer the call with local stream
                    call.answer(stream);

                    // Display local video
                    localVideo.current.srcObject = stream;

                    // Listen for remote stream
                    call.on("stream", (remoteStream) => {
                        remoteVideo.current.srcObject = remoteStream;
                    });
                });
        });
    }, []);

    const callPeer = () => {
        // Get user's media stream
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                // Display local video
                localVideo.current.srcObject = stream;

                // Call the remote peer
                const call = peerInstance.current.call(remotePeerId, stream);

                // Listen for remote stream
                call.on("stream", (remoteStream) => {
                    remoteVideo.current.srcObject = remoteStream;
                });

                setConnected(true);
            })
            .catch((err) => {
                console.error("Failed to get media stream:", err);
            });
    };

    return (
        <div>
            <h2>Video Call App</h2>
            <div>
                <p>Your Peer ID: {peerId}</p>
                <input
                    type="text"
                    placeholder="Enter Remote Peer ID"
                    value={remotePeerId}
                    onChange={(e) => setRemotePeerId(e.target.value)}
                />
                <button onClick={callPeer} disabled={connected}>
                    Call
                </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <div>
                    <h3>Local Video</h3>
                    <video ref={localVideo} autoPlay muted style={{ width: "300px" }} />
                </div>
                <div>
                    <h3>Remote Video</h3>
                    <video ref={remoteVideo} autoPlay style={{ width: "300px" }} />
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
