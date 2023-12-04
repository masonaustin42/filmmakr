import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [localProfilePic, setLocalProfilePic] = useState(null);
  const [profileBackground, setProfileBackground] = useState(null);
  const [localProfileBackground, setLocalProfileBackground] = useState(null);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errorsObj = {};
    if (!email.match(/^[\w\d]+@[\w\d\.]+\.[\w\d]+$/))
      errorsObj.email = "Email is invalid";
    if (email === "") errorsObj.email = "Email is required";
    if (username === "") errorsObj.username = "Username is required";
    if (firstName === "") errorsObj.firstName = "First Name is required";
    if (lastName === "") errorsObj.lastName = "Last Name is required";
    if (password === "") errorsObj.password = "Password is required";
    if (confirmPassword !== password && confirmPassword !== "")
      errorsObj.confirmPassword = "Passwords do not match";
    setErrors(errorsObj);
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("username", username);
    formdata.append("first_name", firstName);
    formdata.append("last_name", lastName);
    formdata.append("password", password);
    if (bio !== "") formdata.append("bio", bio);
    if (profilePic) formdata.append("profile_pic", profilePic);
    if (profileBackground) formdata.append("portfolio_pic", profileBackground);
    const data = await dispatch(signUp(formdata));
    if (data) {
      setErrors({ ...errors, ...data });
    } else {
      closeModal();
    }
  };

  function profilePicChange(e) {
    setProfilePic(e.target.files[0]);
    setLocalProfilePic(URL.createObjectURL(e.target.files[0]));
  }

  function profileBackgroundChange(e) {
    setProfileBackground(e.target.files[0]);
    setLocalProfileBackground(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <h1>Sign Up</h1>
      {Object.values(errors).map((error) => (
        <p key={error}>{error}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Bio
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        {localProfilePic && <img src={localProfilePic} alt="" />}
        <label>
          Profile Picture
          <input type="file" onChange={profilePicChange} />
        </label>
        {localProfileBackground && <img src={localProfileBackground} alt="" />}
        <label>
          Profile Background
          <input type="file" onChange={profileBackgroundChange} />
        </label>
        <button type="submit" disabled={Object.values(errors).length}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
