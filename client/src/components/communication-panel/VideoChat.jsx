import React, { useEffect, useRef, useState } from "react";
import { Logger } from "shared";
import Peer from "simple-peer";
import { usePlayer } from "../../contexts/UserContext";
import { PlayerVideo } from "./PlayerVideo";

function VideoChat({ socket, gameId, players }) {
  const myPlayer = usePlayer().player;
  const [myStream, setMyStream] = useState(null);
  const myVideoRef = useRef(null);
  const [playerVideos, setPlayerVideos] = useState({});
  const [canCall, setCanCall] = useState(true);

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
        myVideoRef.current.srcObject = stream;
        socket.emit("ready-for-call", gameId, myPlayer.id);
      } catch (err) {
        Logger.warn("unable to get user media");
        socket.emit("cant-call", gameId, myPlayer.id);
        setCanCall(false);
      }
    };

    getVideoStream();
  }, []);

  function addPlayerVideo(playerId, peer) {
    setPlayerVideos((prevState) => ({
      ...prevState,
      [playerId]: { peer },
    }));
  }

  function setPlayerVideoStream(playerId, stream) {
    setPlayerVideos((prevState) => ({
      ...prevState,
      [playerId]: { ...prevState[playerId], stream },
    }));
  }

  const callPlayer = (playerId) => {
    Logger.info(`call player ${playerId}`);

    if (!canCall) {
      socket.emit("cant-call", gameId, myPlayer.id);
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myStream,
    });
    addPlayerVideo(playerId, peer);

    peer.on("signal", (data) => {
      socket.emit("call-player", myPlayer.id, playerId, data);
    });

    peer.on("stream", (stream) => {
      setPlayerVideoStream(playerId, stream);
    });

    socket.on("call-accepted", (signal) => {
      Logger.info("call accepted");
      peer.signal(signal);
    });
  };

  const cantCall = (playerId) => {
    Logger.info(`can't call player ${playerId}`);
    addPlayerVideo(playerId, null);
  };

  const answerCall = (fromPlayerId, callerSignal) => {
    Logger.info(`answer call from player ${fromPlayerId}`);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myStream,
    });
    addPlayerVideo(fromPlayerId, peer);

    peer.on("signal", (data) => {
      socket.emit("answer-player-call", fromPlayerId, data);
    });

    peer.on("stream", (stream) => {
      setPlayerVideoStream(fromPlayerId, stream);
    });

    peer.signal(callerSignal);
  };

  const leaveCall = (playerId) => {
    Logger.info(`player left ${playerId}`);
    if (Object.hasOwn(playerVideos, playerId)) {
      if (playerVideos[playerId].peer) {
        playerVideos[playerId].peer.destroy();
      }
      const newPlayerVideos = { ...playerVideos };
      delete newPlayerVideos[playerId];
      setPlayerVideos(newPlayerVideos);
    }
  };

  useEffect(() => {
    if (!myStream) return;
    socket.on("player-ready-for-call", callPlayer);
    socket.on("player-cant-be-called", cantCall);
    socket.on("player-calling", answerCall);
    socket.on("player-left-game", leaveCall);
  }, [myStream]);

  const renderPlayerVideos = players
    .filter((player) => player.id !== myPlayer.id)
    .map((player) => (
      <PlayerVideo
        playerName={player.name}
        isConnecting={canCall && !Object.hasOwn(playerVideos, player.id)}
        unavailable={
          !canCall ||
          (Object.hasOwn(playerVideos, player.id) &&
            playerVideos[player.id].peer === null)
        }
        stream={
          Object.hasOwn(playerVideos, player.id)
            ? playerVideos[player.id].stream
            : null
        }
      />
    ));

  return (
    <>
      <div className="w-full grid grid-cols-2">{renderPlayerVideos}</div>
      <div className="w-1/3 m-auto">
        <video playsInline muted ref={myVideoRef} autoPlay />
      </div>
    </>
  );
}

export { VideoChat };
