const SET_USER = "profile/SET_USER";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const fetchProfile =
  (userId, is_current_user = false) =>
  async (dispatch) => {
    const response = await fetch(
      `/api/profiles/${userId}${is_current_user ? "/full" : ""}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return data;
      }
      dispatch(setUser(data));
    }
  };

export default function profileReducer(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    default:
      return state;
  }
}
