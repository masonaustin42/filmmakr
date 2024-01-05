import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../../store/user_profile";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import FollowButton from "../ProfilePage/FollowButton";

function Followers() {
  const history = useHistory();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { profileUsername } = useParams();

  useEffect(() => {
    dispatch(fetchProfile(profileUsername));
  }, [dispatch, profileUsername]);

  useEffect(() => {
    if (user?.username === profileUsername) setIsCurrentUser(true);
    else setIsCurrentUser(false);
  }, [profileUsername, user]);

  if (!profile) return null;

  return (
    <>
      <div>
        <h1>Following</h1>
        <div>
          {profile?.following
            ? profile.following.map((follower) => (
                <div key={follower.id}>
                  <div
                    className="follow-user"
                    onClick={() => {
                      history.push(`/profiles/${follower.username}`);
                    }}
                  >
                    <img
                      className="profile-pic-small"
                      src={follower.profile_pic}
                      alt=""
                    />
                    <p>{follower.username}</p>
                  </div>
                  {user && user.id !== follower.id ? (
                    <FollowButton
                      user={user}
                      profileUsername={follower.username}
                      profileId={follower.id}
                    />
                  ) : null}
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}

export default Followers;
