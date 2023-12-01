const SET_GALLERY = "gallery/SET_GALLERY";

const setGallery = (gallery) => ({
  type: SET_GALLERY,
  payload: gallery,
});

export const fetchGallery = (galleryId, password) => async (dispatch) => {
  const response = await fetch(
    `/api/galleries/${galleryId}${password !== "null" && `?p=${password}`}`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
    dispatch(setGallery(data.gallery));
  }
};

export default function galleryReducer(state = {}, action) {
  switch (action.type) {
    case SET_GALLERY:
      return action.payload;

    default:
      return state;
  }
}
