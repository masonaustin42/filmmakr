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
  const [preview, setPreview] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchGallery(galleryId));
  }, [dispatch]);

  useEffect(() => {
    setTitle(gallery.title);
    if (gallery.date) {
      let galleryDate = new Date(gallery.date).toISOString();
      galleryDate = galleryDate.split("T")[0];
      setDate(galleryDate);
    }
    setIsPrivate(gallery.isPrivate);
    setLocalPreview(gallery.preview);
  }, [gallery, user]);

  useEffect(() => {
    const errorsObj = {};
    console.log(date, typeof date);
    if (title == "") errorsObj.title = "Title is required";
    if (isPrivate && password == "")
      errorsObj.password = "Password is required if gallery is private";
    if (isPrivate && password !== "" && password !== confirmPassword)
      errorsObj.confirmPassword = "Passwords do not match";
    setErrors(errorsObj);
  }, [title, password, confirmPassword, isPrivate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return console.log("Must be logged in");
    const formdata = new FormData();
    formdata.append("title", title);
    if (date) formdata.append("date", date);
    else formdata.append("date", null);
    if (password && isPrivate) formdata.append("password", password);
    else formdata.append("password", null);
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

  if (!gallery) return null;
  if (!gallery.ownerId) return null;
  if (user?.id !== gallery.ownerId) return setModalContent(<LoginFormModal />);

  return (
    <form id="gallery-form" onSubmit={onSubmit} encType="multipart/formdata">
      <h1 className="gallery-form-header">Update Gallery</h1>
      <label className="gallery-form-label">
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="gallery-form-label">
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <button onClick={() => setDate("")}>Remove Date</button>
      <label id="gallery-form-private">
        Private
        <input
          type="checkbox"
          value={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
        />
      </label>
      {isPrivate && (
        <>
          <label className="gallery-form-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="gallery-form-label">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </>
      )}

      <label className="gallery-form-label">
        Preview
        <input type="file" onChange={(e) => setPreview(e.target.files[0])} />
      </label>

      <button disabled={Object.values(errors).length}>Update Gallery</button>
    </form>
  );
}

export default UpdateGallery;
