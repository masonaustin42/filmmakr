const SET_GALLERY = "gallery/SET_GALLERY";

const setGallery = (gallery) => ({
  type: SET_GALLERY,
  payload: gallery,
});

export const fetchGallery =
  (galleryId, password = null) =>
  async (dispatch) => {
    const response = await fetch(
      `/api/galleries/${galleryId}${password && `?p=${password}`}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      dispatch(setGallery(data));
    }
  };

export default function galleryReducer(state = {}, action) {
  switch (action.type) {
    case SET_GALLERY:
      return { gallery: action.payload };

    default:
      return state;
  }
}
