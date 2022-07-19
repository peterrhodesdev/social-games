import Peer from "simple-peer";

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#using_the_new_api_in_older_browsers
async function getStream() {
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = (constraints) => {
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return stream;
}

function createPeer(stream, initiator) {
  return new Peer({
    stream,
    initiator,
    trickle: false,
    reconnectTimer: 1000,
    iceTransportPolicy: "relay",
    config: {
      iceServers: [
        { urls: process.env.REACT_APP_STUN_SERVERS.split(",") },
        {
          urls: process.env.REACT_APP_TURN_SERVERS.split(","),
          username: process.env.REACT_APP_TURN_USERNAME,
          credential: process.env.REACT_APP_TURN_CREDENTIAL,
        },
      ],
    },
  });
}

export { createPeer, getStream };
