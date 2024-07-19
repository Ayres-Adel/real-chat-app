import { useEffect, useState } from 'react';
import io from  'socket.io-client'
const socket = io.connect("http://localhost:3001")
function App() {

  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room, type: "sent" });
    setMessages([...messages, { message, type: "sent" }]);
    setMessage(""); // Clear the input field after sending message
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages([...messages, { message: data.message, type: "received" }]);
    });
    // Clean up socket listener when component unmounts
    return () => socket.off("receive_message");
  }, [messages]); // Listen for changes in messages array

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        value={room}
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />

      <button onClick={joinRoom}>Join Room</button>

      <input
        placeholder="Message..."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>

      <div>
        {messages.map((msg, index) => (
          <h1 key={index} className={msg.type}>
            {msg.type === "sent" ? "Sent: " : "Received: "}{msg.message}
          </h1>
        ))}
      </div>
    </div>
  );
}

export default App;
