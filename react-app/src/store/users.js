const GET_USERS = "users/GET_USERS";

const getUsers = (users) => ({
  type: GET_USERS,
  users,
});

export const getAllUsers = () => async (dispatch) => {
  const response = await fetch("/api/users");
  const users = await response.json();
  dispatch(getUsers(users.users));
  return users;
};

export default function usersReducer(state = {}, action) {
  switch (action.type) {
    case GET_USERS:
      const newState = {};
      action.users.forEach((user) => {
        newState[user.id] = user;
      });
      return newState;
    default:
      return state;
  }
}
