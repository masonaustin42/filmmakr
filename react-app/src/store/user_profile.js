const SET_USER = "profile/SET_USER";
const DELETE_GALLERY = "profile/DELETE_GALLERY";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const deleteStateGallery = (galleryId) => ({
  type: DELETE_GALLERY,
  galleryId,
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

export const deleteGallery = (galleryId) => async (dispatch) => {
  const response = await fetch(`/api/galleries/${galleryId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
    dispatch(deleteStateGallery(galleryId));
    return data;
  }
};

export default function profileReducer(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      const galleries = action.payload.galleries;
      const galleriesObj = {};
      for (let i in galleries) {
        let gallery = galleries[i];
        galleriesObj[gallery.id] = gallery;
      }
      return { ...action.payload, galleries: galleriesObj };
    case DELETE_GALLERY:
      const newState = { ...state };
      delete newState.galleries[action.galleryId];
      return newState;
    default:
      return state;
  }
}
