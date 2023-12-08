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
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errorsObj = {};
    if (email.indexOf("@") === -1)
      errorsObj.email = "Email must have an @ symbol";
    else if (!email.split("@")[1].match(/[\w\d]+\.[\w\d]/))
      errorsObj.email = "Email must have a domain after the @ symbol";
    if (email === "") errorsObj.email = "Email is required";
    if (username.length < 3)
      errorsObj.username = "Username must be at least 3 characters";
    if (username === "") errorsObj.username = "Username is required";
    if (username.length > 40)
      errorsObj.username = "Username must be under 40 characters";
    if (firstName === "") errorsObj.firstName = "First Name is required";
    if (lastName === "") errorsObj.lastName = "Last Name is required";
    if (password.length < 8)
      errorsObj.password = "Password must be at least 8 characters";
    if (password === "") errorsObj.password = "Password is required";
    if (confirmPassword !== password && confirmPassword !== "")
      errorsObj.confirmPassword = "Passwords do not match";
    if (confirmPassword === "")
      errorsObj.confirmPassword = "Password is required";
    if (bio.length > 255) errorsObj.bio = "Bio must be under 1500 characters";
    setErrors(errorsObj);
  }, [email, username, firstName, lastName, password, confirmPassword, bio]);

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

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className={errors.email ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.email}</p>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className={errors.username ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.username}</p>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
            className={errors.firstName ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.firstName}</p>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            required
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            className={errors.lastName ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.lastName}</p>
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
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            className={errors.confirmPassword ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.confirmPassword}</p>
        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself!"
            className={errors.bio ? "form-bad" : "form-good"}
          />
        </label>
        <p className="error">{errors.bio}</p>
        {localProfilePic && <img src={localProfilePic} alt="" />}
        <label>
          Profile Picture
          <input type="file" onChange={profilePicChange} />
        </label>
        <p className="error">{errors.profilePic}</p>
        <button type="submit" disabled={Object.values(errors).length}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
