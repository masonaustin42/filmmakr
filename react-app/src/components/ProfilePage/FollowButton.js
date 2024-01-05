import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../store/session";

function FollowButton({ user, profileUsername, profileId }) {
  const dispatch = useDispatch();

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user?.following) {
      setIsFollowing(user.following.includes(profileUsername));
    }
  }, [user, profileUsername]);

  const onClick = async () => {
    if (isFollowing) {
      await dispatch(unfollowUser(profileId, profileUsername));
    } else {
      await dispatch(followUser(profileId, profileUsername));
    }
  };

  return (
    <button className="follow-button" onClick={onClick}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
