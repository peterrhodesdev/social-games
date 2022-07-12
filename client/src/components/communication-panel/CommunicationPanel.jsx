import React, { useEffect, useState } from "react";
import { TextSubmit } from "../partials/TextSubmit";
import { ChatMessages } from "./ChatMessages";
import { PlayersTable } from "./PlayersTable";

function CommunicationPanel({ creator, players, myPlayerId, socket, gameId }) {
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
    socket.emit("chat-message-send", gameId, myPlayerId, chatMessage);
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
        <PlayersTable
          creator={creator}
          players={players}
          myPlayerId={myPlayerId}
        />
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
            buttonText="Enter"
            isDisabled={!players || players.length <= 1}
          />
        </div>
      </div>
    </>
  );
}

export { CommunicationPanel };
