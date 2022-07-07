import React, { useEffect, useRef, useState } from "react";
import { TextSubmit } from "../partials/TextSubmit";

function CommunicationPanel({ creator, players, myPlayerId, socket, gameId }) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatMessagesBottomRef = useRef(null);

  useEffect(() => {
    socket.on("chat-message-receive", (playerName, message) => {
      setChatMessages((prevState) => [
        ...prevState,
        { text: message, playerName, fromMe: false },
      ]);
    });
  }, []);

  useEffect(() => {
    chatMessagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const playersTable = (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th aria-label="info" />
        </tr>
      </thead>
      <tbody>
        {creator &&
          players &&
          players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{`${creator.id === player.id ? "Creator " : ""}${
                player.id === myPlayerId ? "(you)" : ""
              }`}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  const displayChatMessages = (
    <div className="w-full h-60 overflow-y-auto mb-4 rounded-lg border border-gray-500 p-2">
      {chatMessages.map((msg, index) => (
        <>
          {!msg.fromMe &&
            (index === 0 ||
              chatMessages[index - 1].playerName !== msg.playerName) && (
              <div className="text-sm text-gray-500 p-0">{msg.playerName}</div>
            )}
          <div
            className={`rounded-lg mb-2 w-fit max-w-[75%] px-4 py-2 ${
              msg.fromMe ? " bg-green-100 ml-auto " : " bg-blue-100 mr-auto "
            }`}
          >
            {msg.text}
          </div>
        </>
      ))}
      <div ref={chatMessagesBottomRef} />
    </div>
  );

  const handleWordSubmit = (e) => {
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
        <h3>Players</h3>
        {playersTable}
      </div>
      <div>
        <h3>Chat</h3>
        <div className="select-none">
          {displayChatMessages}
          <TextSubmit
            submitHandler={handleWordSubmit}
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
