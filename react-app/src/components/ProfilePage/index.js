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
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
      <ul>
        {galleries.length &&
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
          ))}
      </ul>
    </>
  );
}

export default Profile;
