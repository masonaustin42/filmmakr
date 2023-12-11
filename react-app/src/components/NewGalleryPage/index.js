import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGallery } from "../../store/gallery";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal";
import "./newGallery.css";

function NewGallery() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setModalContent } = useModal();
  const user = useSelector((state) => state.session?.user);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [preview, setPreview] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const errorsObj = {};
    if (title === "") errorsObj.title = "Title is required";
    if (isPrivate && password === "")
      errorsObj.password = "Password is required if gallery is private";
    if (isPrivate && confirmPassword === "")
      errorsObj.confirmPassword = "Password is required if gallery is private";
    if (isPrivate && password !== "" && password !== confirmPassword)
      errorsObj.confirmPassword = "Passwords do not match";
    setErrors(errorsObj);
  }, [title, password, confirmPassword, isPrivate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setModalContent(<LoginFormModal />);
    const formdata = new FormData();
    formdata.append("title", title);
    if (date) formdata.append("date", date);
    if (password && isPrivate) formdata.append("password", password);
    if (preview) formdata.append("preview", preview);
    const newGallery = await dispatch(createGallery(formdata));
    if (newGallery?.errors) {
      setErrors({ ...errors, ...newGallery.errors });
    } else {
      let url = `/galleries/${newGallery.id}`;
      if (isPrivate && password !== "") url += `?p=${password}`;
      history.push(url);
    }
  };

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setPreview(e.target.files[0]);
      setLocalPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const VIDEO_TYPES = ["mp4", "mov", "avi", "mpeg"];
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
      <form id="gallery-form" onSubmit={onSubmit} encType="multipart/formdata">
        <h1 className="gallery-form-header">New Gallery</h1>
        <label className="gallery-form-label">
          <span>
            Title<span className="req">*</span>
          </span>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={errors.title ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.title}</p>
        <label className="gallery-form-label">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={errors.date ? "form-bad" : "form-good"}
          />
          <button type="button" onClick={() => setDate("")}>
            Remove Date
          </button>
        </label>
        <p className="error">{errors.date}</p>
        <label id="gallery-form-private">
          Set Gallery to Private?
          <input
            type="checkbox"
            value={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
        </label>
        {isPrivate && (
          <>
            <label className="gallery-form-label">
              <span>
                Password<span className="req">*</span>
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={errors.password ? "form-bad" : "form-good"}
              />
            </label>
            <p className="error">{errors.password}</p>
            <label className="gallery-form-label">
              <span>
                Confirm Password<span className="req">*</span>
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={errors.confirmPassword ? "form-bad" : "form-good"}
              />
            </label>

            <p className="error">{errors.confirmPassword}</p>
          </>
        )}
        {localPreview && MatchElementToItem(preview, localPreview)}
        <label className="gallery-form-label">
          Preview Media (Image or Video File)
          <input type="file" onChange={onImageChange} />
        </label>

        <p>
          <span className="req">*</span> indicates required fields
        </p>

        <button disabled={Object.values(errors).length}>Create Gallery</button>
      </form>
    </>
  );
}

export default NewGallery;
