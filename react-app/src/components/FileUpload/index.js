import { useState, useEffect } from "react";
import { socket } from "../../socket";
import { useModal } from "../../context/Modal";
import "./FileUpload.css";

const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const { closeModal } = useModal();

  useEffect(() => {
    socket.connect();
  });

  socket.on("progress", function (data) {
    setUploadProgress(data.percentage.toFixed());
  });

  useEffect(() => {
    if (uploadProgress >= 100) {
      closeModal();
      socket.disconnect();
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
