import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGallery, fetchGallery } from "../../store/gallery";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal";
import "./updateGallery.css";

function UpdateGallery() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setModalContent } = useModal();
  const { galleryId } = useParams();
  const user = useSelector((state) => state.session?.user);
  const gallery = useSelector((state) => state.gallery);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [wasPrivate, setWasPrivate] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchGallery(galleryId));
  }, [dispatch, galleryId]);

  useEffect(() => {
    setTitle(gallery.title);
    if (gallery.date) {
      let galleryDate = new Date(gallery.date).toISOString();
      galleryDate = galleryDate.split("T")[0];
      setDate(galleryDate);
    }
    setIsPrivate(gallery.isPrivate);
    setWasPrivate(gallery.isPrivate);
    setLocalPreview(gallery.preview);
  }, [gallery, user]);

  useEffect(() => {
    if (!wasPrivate && isPrivate) setResetPassword(true);
    else if (!isPrivate) setResetPassword(false);
  }, [isPrivate, wasPrivate]);

  useEffect(() => {
    const errorsObj = {};
    if (title === "") errorsObj.title = "Title is required";
    if (resetPassword && password === "")
      errorsObj.password = "Password is required if gallery is private";
    if (resetPassword && confirmPassword === "")
      errorsObj.confirmPassword = "Password is required if gallery is private";
    if (resetPassword && password !== "" && password !== confirmPassword)
      errorsObj.confirmPassword = "Passwords do not match";
    setErrors(errorsObj);
  }, [title, password, confirmPassword, resetPassword]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setModalContent(<LoginFormModal />);
    const formdata = new FormData();
    formdata.append("title", title);
    if (date !== "") formdata.append("date", date);
    else formdata.append("remove_date", true);
    if (password && resetPassword) formdata.append("password", password);
    else formdata.append("remove_password", true);
    if (preview) formdata.append("preview", preview);
    const newGallery = await dispatch(updateGallery(formdata, galleryId));
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

  function MatchElementToItem(localItem) {
    const type = localItem
      .split(".")
      [localItem.split(".").length - 1].toLowerCase();
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
  }

  if (!gallery) return null;
  if (!gallery.ownerId) return null;
  if (user?.id !== gallery.ownerId) return setModalContent(<LoginFormModal />);

  return (
    <form id="gallery-form" onSubmit={onSubmit} encType="multipart/formdata">
      <h1 className="gallery-form-header">Update Gallery</h1>
      <label className="gallery-form-label">
        <span>
          Title<span className="req">*</span>
        </span>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        Private
        <input
          type="checkbox"
          value={isPrivate}
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
        />
      </label>
      <label
        id="gallery-form-reset-password"
        hidden={!(wasPrivate && isPrivate)}
      >
        Reset Password?
        <input
          type="checkbox"
          value={resetPassword}
          checked={resetPassword}
          onChange={() => setResetPassword(!resetPassword)}
        />
      </label>
      {resetPassword && (
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
              className={errors.confirmPassword ? "form-bad" : "form-good"}
            />
          </label>
          <p className="error">{errors.confirmPassword}</p>
        </>
      )}
      {localPreview && MatchElementToItem(localPreview)}

      <label className="gallery-form-label">
        Preview Media (Image or Video File)
        <input type="file" onChange={onImageChange} />
      </label>

      <p>
        <span className="req">*</span> indicates required fields
      </p>

      <button disabled={Object.values(errors).length}>Update Gallery</button>
    </form>
  );
}

export default UpdateGallery;
