import { useDispatch } from "react-redux";
import { uploadItem } from "../../store/gallery";
import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useModal } from "../../context/Modal";
import FileUpload from "../FileUpload";
import "./CreateItem.css";

function CreateItemModal({ galleryId }) {
  const dispatch = useDispatch();
  // const { closeModal } = useModal();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [isMain, setIsMain] = useState(false);
  const [localFile, setLocalFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

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
    setIsUploading(true);
    const newItem = await dispatch(uploadItem(formdata, galleryId));
    if (newItem?.errors) {
      setErrors(newItem.errors);
    }
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
      {!isUploading ? (
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
        <FileUpload />
      )}
    </>
  );
}

export default CreateItemModal;
