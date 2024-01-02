// import { useState, useEffect } from "react";
// import { socket } from "../../socket";
// import { useModal } from "../../context/Modal";
// import { io } from "socket.io-client";
import "./FileUpload.css";

const FileUpload = ({ uploadProgress }) => {
  // const [uploadProgress, setUploadProgress] = useState(0);

  // const { closeModal } = useModal();

  // const URL =
  //   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
  // const socket = io(URL);

  // socket.on("progress", function (data) {
  //   console.log(data);
  //   setUploadProgress(data.percentage.toFixed());
  // });

  // useEffect(() => {
  //   if (uploadProgress >= 100) {
  //     closeModal();
  //     socket.disconnect();
  //   }
  // }, [uploadProgress]);

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
