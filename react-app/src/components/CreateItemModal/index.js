import { useDispatch } from "react-redux";
import { uploadItem } from "../../store/gallery";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import "./CreateItem.css";

function CreateItemModal({ galleryId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [isMain, setIsMain] = useState(false);
  const [localFile, setLocalFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);

  socket.on("progress", function (data) {
    setUploadProgress(data.percentage.toFixed());
  });

  useEffect(() => {
    if (uploadProgress >= 100) {
      closeModal();
    }

    const smooth = setInterval(() => {
      if (smoothProgress < uploadProgress) {
        if (file?.type.includes("video")) {
          setSmoothProgress((prev) => prev + 0.1);
        } else {
          setSmoothProgress((prev) => prev + 1);
        }
      }
    }, 10);

    return () => clearInterval(smooth);
  }, [uploadProgress]);

  useEffect(() => {
    const errorsObj = {};
    if (name.length > 255) errorsObj.name = "Name must be under 255 characters";
    if (!file) errorsObj.file = "Image, Audio, or Video file is required";
    setErrors(errorsObj);
  }, [name, file]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    if (name) formdata.append("name", name);
    formdata.append("media", file);
    formdata.append("is_main", isMain);
    const newItem = await dispatch(uploadItem(formdata, galleryId));
    if (newItem?.errors) setErrors(newItem.errors);
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setLocalFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const VIDEO_TYPES = ["mp4", "mov", "avi", "mpeg"];
  const AUDIO_TYPES = ["mp3", "aiff", "wmv", "wav", "flac"];
  const IMAGE_TYPES = ["jpg", "jpeg", "png", "tiff"];

  const MatchElementToItem = (item, localItem) => {
    const type = item.name
      .split(".")
      [item.name.split(".").length - 1].toLowerCase();
    if (VIDEO_TYPES.indexOf(type) !== -1) {
      return (
        <video
          controls
          style={{ width: "300px", height: "200px", objectFit: "cover" }}
          src={localItem}
        />
      );
    } else if (AUDIO_TYPES.indexOf(type) !== -1) {
      return (
        <audio
          controls
          src={localItem}
          style={{ width: "300px", height: "200px" }}
        />
      );
    } else if (IMAGE_TYPES.indexOf(type) !== -1) {
      return (
        <img
          src={localItem}
          alt=""
          style={{ width: "300px", height: "200px", objectFit: "cover" }}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {uploadProgress < 1 ? (
        <>
          <h2>Upload an Item</h2>
          <form onSubmit={onSubmit} encType="multipart/formdata">
            <label>
              Name
              <input
                type="text"
                value={name}
                placeholder="Name (optional)"
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "form-bad" : "form-good"}
              />
            </label>
            <p className="error">{errors.name}</p>

            {localFile && MatchElementToItem(file, localFile)}
            <label>
              <span>
                File
                <span className="req">*</span>
              </span>
              <input type="file" onChange={onFileChange} />
            </label>
            <p className="error">{errors.file}</p>
            <div id="is-main-container">
              <p>Is this item the main item of the gallery?</p>
              <label>
                <input
                  type="radio"
                  value={true}
                  name="isMain"
                  checked={isMain === true}
                  onChange={() => setIsMain(true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value={false}
                  name="isMain"
                  checked={isMain === false}
                  onChange={() => setIsMain(false)}
                />
                No
              </label>
            </div>

            <p>
              <span className="req">*</span> indicates required fields
            </p>
            <button disabled={Object.keys(errors).length}>Upload Item</button>
          </form>
        </>
      ) : (
        <>
          <h2>Uploading</h2>
          <p>Please do not navigate away from this page...</p>
          <div className="progress-bar-container">
            <span>{uploadProgress}%</span>
            <progress
              className="progress-bar"
              max="100"
              value={`${smoothProgress}`}
            >
              {smoothProgress}%
            </progress>
          </div>
        </>
      )}
    </>
  );
}

export default CreateItemModal;
