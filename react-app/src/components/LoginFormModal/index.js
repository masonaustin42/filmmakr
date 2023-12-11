import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function LoginFormModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(credential, password));

    if (data.errors) {
      setErrors(data.errors);
    } else {
      closeModal();
      history.push(`/profiles/${data.username}`);
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
            className={errors.credential ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.credential}</p>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className={errors.password ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.password}</p>
        <button type="submit">Log In</button>
      </form>
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(login("hallie@aa.io", "passwordHallie")).then(() => {
            closeModal();
            history.push("/profiles/hallieaustinvideo");
          });
        }}
      >
        Log In as Demo User
      </button>
    </>
  );
}

export default LoginFormModal;
