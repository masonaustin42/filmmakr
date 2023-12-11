import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../store/user_profile";
import {
  useParams,
  Link,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import OpenModalButton from "../OpenModalButton";
import DeleteGalleryModal from "../DeleteGalleryModal";
import "./profile.css";

function Profile() {
  const history = useHistory();
  const [galleries, setGalleries] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  const { profileUsername } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.username === profileUsername) {
      dispatch(fetchProfile(profileUsername, true));
    } else {
      dispatch(fetchProfile(profileUsername));
    }
  }, [dispatch, user, profileUsername]);

  useEffect(() => {
    if (profile.galleries) {
      setGalleries(Object.values(profile.galleries));
    }
  }, [profile]);

  useEffect(() => {
    if (user?.username === profileUsername) setIsCurrentUser(true);
    else setIsCurrentUser(false);
  }, [profileUsername, user]);

  if (!profile) return null;

  return (
    <>
      <div id="profile-header">
        {profile.profile_pic && (
          <img id="profile-pic" src={profile.profile_pic} alt="" />
        )}
        <h1>{profile.name}</h1>
      </div>
      <p id="bio">{profile.bio}</p>
      <h2 id="profile-galleries-header">{profile.name}'s Galleries</h2>
      <ul id="profile-galleries-list">
        {galleries.length ? (
          galleries.map((gallery) => (
            <li key={gallery.id}>
              <Link to={`/galleries/${gallery.id}`}>{gallery.title}</Link>
              {isCurrentUser && (
                <>
                  <button
                    onClick={() =>
                      history.push(`/galleries/${gallery.id}/update`)
                    }
                  >
                    Update
                  </button>
                  <OpenModalButton
                    modalComponent={
                      <DeleteGalleryModal galleryId={gallery.id} />
                    }
                    buttonText="Delete"
                  />
                </>
              )}
            </li>
          ))
        ) : (
          <p>{profile.name} has not created any galleries yet.</p>
        )}
      </ul>
      {isCurrentUser ? (
        <Link to="/galleries/new">Create a New Gallery</Link>
      ) : null}
    </>
  );
}

export default Profile;
