import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGallery } from "../../store/gallery";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewGallery() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session?.user);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const errorsObj = {};
    console.log(date, typeof date);
    if (title == "") errorsObj.title = "Title is required";
    if (!isPublic && password == "")
      errorsObj.password = "Password is required if gallery is private";
    if (!isPublic && password !== "" && password !== confirmPassword)
      errorsObj.confirmPassword = "Passwords do not match";
    setErrors(errorsObj);
  }, [title, password, confirmPassword, isPublic]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return console.log("Must be logged in");
    const formdata = new FormData();
    formdata.append("title", title);
    if (date) formdata.append("date", date);
    if (password && !isPublic) formdata.append("password", password);
    if (preview) formdata.append("preview", preview);
    const newGallery = await dispatch(createGallery(formdata));
    if (newGallery?.errors) {
      setErrors({ ...errors, ...newGallery.errors });
    } else {
      let url = `/galleries/${newGallery.id}`;
      if (!isPublic && password !== "") url += `?p=${password}`;
      history.push(url);
    }
  };

  return (
    <div>
      <h1>New Gallery</h1>
      <form onSubmit={onSubmit} encType="multipart/formdata">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button onClick={() => setDate("")}>Remove Date</button>
        <label>
          Public
          <input
            type="checkbox"
            value={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
        </label>
        <label hidden={isPublic}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label hidden={isPublic}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <label>
          Preview
          <input type="file" onChange={(e) => setPreview(e.target.files[0])} />
        </label>

        <button disabled={Object.values(errors).length}>Create Gallery</button>
      </form>
    </div>
  );
}

export default NewGallery;
