import React, { useEffect, useState } from "react";
import { usePlayer } from "../../contexts/UserContext";
import { TextSubmit } from "../partials/TextSubmit";
import { ChatMessages } from "./ChatMessages";
import { PlayersTable } from "./PlayersTable";
import { VideoChat } from "./VideoChat";

function CommunicationPanel({ creator, players, socket, gameId }) {
  const { player } = usePlayer();
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on("chat-message-receive", (playerName, message) => {
      setChatMessages((prevState) => [
        ...prevState,
        { text: message, playerName, fromMe: false },
      ]);
    });
  }, []);

  const handleChatMessageSubmit = (e) => {
    e.preventDefault();
    if (chatMessage === "") {
      return;
    }
    socket.emit("chat-message-send", gameId, player.id, chatMessage);
    setChatMessages((prevState) => [
      ...prevState,
      { text: chatMessage, playerName: null, fromMe: true },
    ]);
    setChatMessage("");
  };

  const handleChange = (e) => setChatMessage(e.target.value);

  return (
    <>
      <div>
        <h3 className="mt-2">Players: {players.length}</h3>
        <PlayersTable creator={creator} players={players} />
      </div>
      <div>
        <h3>Video</h3>
        <VideoChat socket={socket} gameId={gameId} players={players} />
      </div>
      <div>
        <h3>Chat</h3>
        <div className="select-none">
          <ChatMessages chatMessages={chatMessages} />
          <TextSubmit
            submitHandler={handleChatMessageSubmit}
            textValue={chatMessage}
            onChangeHandler={handleChange}
            placeholderText="enter message to chat..."
            buttonText="send"
            isDisabled={!players || players.length <= 1}
          />
        </div>
      </div>
    </>
  );
}

export { CommunicationPanel };
