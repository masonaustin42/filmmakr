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

export const createGallery = (formdata) => async (dispatch) => {
  const response = await fetch(`/api/galleries/new`, {
    method: "POST",
    body: formdata,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

export default function galleryReducer(state = {}, action) {
  switch (action.type) {
    case SET_GALLERY:
      const gallery = action.payload;
      const normalizedItems = {};
      for (let i in gallery.items) {
        let item = gallery.items[i];
        if (item.is_main) normalizedItems.main = item;
        else normalizedItems[item.id] = item;
      }
      gallery.items = normalizedItems;
      return gallery;

    default:
      return state;
  }
}
