const SET_GALLERY = "gallery/SET_GALLERY";
const CLEAR_GALLERY = "gallery/CLEAR_GALLERY";
const PATCH_GALLERY = "gallery/PATCH_GALLERY";
const ADD_ITEM = "gallery/ADD_ITEM";
const REMOVE_ITEM = "gallery/REMOVE_ITEM";
const PUT_ITEM = "gallery/PUT_ITEM";

const setGallery = (gallery) => ({
  type: SET_GALLERY,
  payload: gallery,
});

export const clearGallery = () => ({
  type: CLEAR_GALLERY,
});

const patchGallery = (gallery) => ({
  type: PATCH_GALLERY,
  payload: gallery,
});

const addItem = (item) => ({
  type: ADD_ITEM,
  payload: item,
});

const removeItem = (itemId, isMain) => ({
  type: REMOVE_ITEM,
  itemId,
  isMain,
});

const putItem = (item) => ({
  type: PUT_ITEM,
  payload: item,
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
  } else {
    return await response.json();
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

export const updateGallery = (formdata, galleryId) => async (dispatch) => {
  const response = await fetch(`/api/galleries/${galleryId}`, {
    method: "PUT",
    body: formdata,
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
    dispatch(patchGallery(data.gallery));
    return data;
  }
};

export const uploadItem = (formdata, galleryId) => async (dispatch) => {
  const response = await fetch(`/api/galleries/${galleryId}/items`, {
    method: "POST",
    body: formdata,
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
    dispatch(addItem(data));
    return data;
  }
};

export const deleteItem = (itemId, isMain) => async (dispatch) => {
  const response = await fetch(`/api/items/${itemId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
    dispatch(removeItem(itemId, isMain));
    return data;
  }
};

export const updateItem = (formdata, itemId) => async (dispatch) => {
  const response = await fetch(`/api/items/${itemId}`, {
    method: "PUT",
    body: formdata,
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    }
    dispatch(putItem(data));
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
    case CLEAR_GALLERY:
      return {};
    case PATCH_GALLERY:
      return { ...state, ...action.payload };
    case ADD_ITEM:
      if (action.payload.is_main) {
        const newState = { ...state };
        for (let key in newState.items) {
          newState.items[key].is_main = false;
        }
        if (newState.items.main) {
          const notMainItem = newState.items.main;
          newState.items[notMainItem.id] = notMainItem;
        }
        newState.items.main = action.payload;
        return newState;
      } else {
        return {
          ...state,
          items: { ...state.items, [action.payload.id]: action.payload },
        };
      }

    case REMOVE_ITEM:
      const newState = { ...state };
      if (action.isMain) {
        delete newState.items.main;
      } else {
        delete newState.items[parseInt(action.itemId)];
      }
      return newState;
    case PUT_ITEM:
      const updatedItems = { ...state.items };
      if (updatedItems.main) {
        updatedItems[updatedItems.main.id] = updatedItems.main;
        updatedItems[updatedItems.main.id].is_main = false;
        delete updatedItems.main;
      }
      updatedItems[action.payload.id] = action.payload;
      let main = Object.values(updatedItems).find((item) => item.is_main);
      if (main) {
        updatedItems.main = main;
        delete updatedItems[main.id];
      }
      return {
        ...state,
        items: updatedItems,
      };
    default:
      return state;
  }
}
