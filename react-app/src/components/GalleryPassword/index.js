import { useState } from "react";
import "./GalleryPassword.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function GalleryPassword({ location, reset }) {
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    history.replace(`${location.pathname}?p=${password}`);
    reset(false);
  };

  return (
    <form id="gallery-password-form" onSubmit={onSubmit}>
      <h2>This gallery is password protected by the gallery owner</h2>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={password.length === 0 ? "form-bad" : "form-good"}
          placeholder="Password"
        />
      </label>
      <p className="error">{location.search && "Incorrect Password"}</p>
      <p className="error">{password.length === 0 && "Password required"}</p>
      <button disabled={password.length === 0}>Submit</button>
    </form>
  );
}

export default GalleryPassword;
