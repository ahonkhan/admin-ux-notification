import "./App.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const socket = io("https://notification-server-qmpo.onrender.com");

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("receive_message", (data) => {
      setIsLoading(true);
      setMessageReceived(data.message);
      console.log("from server", data);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
    };
  }, [socket]);

  useEffect(() => {
    if (messageReceived) {
      setIsLoading(false);
    }
  }, [messageReceived]);
  if (isLoading) {
    return (
      <div className="App">
        <div className="card-container">
          <div className="card">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="card-container">
        <div className="card">
          <h1>Browser: {messageReceived?.useragent?.browser?.name}</h1>
          <h2>
            Device OS: {messageReceived?.useragent?.os?.name}{" "}
            {messageReceived?.useragent?.os?.version}
          </h2>
          <h2>
            Device Model: {messageReceived?.useragent?.device?.model}{" "}
            {messageReceived?.useragent?.device?.type}
          </h2>
          <h3>
            Latitude: {messageReceived?.location?.latitude ?? "fetching..."}
          </h3>
          <h3>
            Longitude: {messageReceived?.location?.longitude ?? "fetching..."}
          </h3>

          <a
            target="_blank"
            href={`https://www.latlong.net/c/?lat=${messageReceived?.location?.latitude}&long=${messageReceived?.location?.longitude}`}
          >
            View map
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
