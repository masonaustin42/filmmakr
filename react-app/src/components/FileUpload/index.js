import { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { io } from "socket.io-client";
import "./FileUpload.css";

const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const { closeModal } = useModal();

  useEffect(() => {
    const URL =
      process.env.NODE_ENV === "production"
        ? "wss://filmmakr.onrender.com/"
        : "http://localhost:3000";
    const socket = io(URL);

    socket.on("connect", () => {
      console.log("websocket connected");
    });

    socket.on("progress", function (data) {
      setUploadProgress(data.percentage.toFixed());
    });

    return () => {
      socket.disconnect();
      console.log("websocket disconnected");
    };
  }, []);

  useEffect(() => {
    if (uploadProgress >= 100) {
      closeModal();
    }
  }, [uploadProgress]);

  return (
    <>
      <h2>Uploading</h2>
      <p>Please do not navigate away from this page...</p>
      <div className="progress-bar-container">
        <span>{uploadProgress}%</span>
        <progress
          className="progress-bar"
          max="100"
          value={`${uploadProgress}`}
        >
          {uploadProgress}%
        </progress>
      </div>
    </>
  );
};

export default FileUpload;
