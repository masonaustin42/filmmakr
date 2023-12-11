import { useDispatch } from "react-redux";
import { updateItem } from "../../store/gallery";
import { useModal } from "../../context/Modal";
import { useState } from "react";

function UpdateItemModal({ item }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [name, setName] = useState(item.name);
  const [isMain, setIsMain] = useState(item.is_main);
  const [file, setFile] = useState(null);
  const [localFile, setLocalFile] = useState(item.url);
  // const [localFileType, setLocalFileType] = useState(item.type);
  const localFileType = item.type;
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    if (name) formdata.append("name", name);
    if (file) formdata.append("media", file);
    formdata.append("is_main", isMain);
    const newItem = await dispatch(updateItem(formdata, item.id));
    if (newItem.errors) setErrors(newItem.errors);
    else {
      closeModal();
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
    let type;
    if (item) {
      type = item.name
        .split(".")
        [item.name.split(".").length - 1].toLowerCase();
    } else {
      type = localFileType;
    }
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
      <h2>Upload an Item</h2>
      <form onSubmit={onSubmit} encType="multipart/formdata">
        <label>
          Name
          <input
            type="text"
            value={name}
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

        <button>Update Item</button>
      </form>
    </>
  );
}

export default UpdateItemModal;
