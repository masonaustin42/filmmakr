// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const ADD_FOLLOW = "session/ADD_FOLLOW";
const REMOVE_FOLLOW = "session/REMOVE_FOLLOW";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const initialState = { user: null };

const addFollow = (follow) => ({
  type: ADD_FOLLOW,
  payload: follow,
});

const removeFollow = (follow) => ({
  type: REMOVE_FOLLOW,
  payload: follow,
});

export const authenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const login = (credential, password) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const logout = () => async (dispatch) => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export const signUp = (formdata) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: formdata,
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const followUser = (userId, username) => async (dispatch) => {
  const response = await fetch(`/api/follows/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addFollow(data));
    return data;
  }
};

export const unfollowUser = (userId, username) => async (dispatch) => {
  const response = await fetch(`/api/follows/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(removeFollow(data));
    return data;
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    case ADD_FOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, action.payload],
        },
      };
    case REMOVE_FOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.filter(
            (follow) => follow.id !== action.payload.id
          ),
        },
      };
    default:
      return state;
  }
}
