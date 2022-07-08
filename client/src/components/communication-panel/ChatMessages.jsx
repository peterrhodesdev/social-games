import React, { useEffect, useRef } from "react";

function ChatMessages({ chatMessages }) {
  const chatMessagesBottomRef = useRef(null);

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatMessagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
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
}

export { ChatMessages };
