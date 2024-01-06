const GET_GALLERIES = "galleries/GET_GALLERIES";

const getGalleries = (galleries) => ({
  type: GET_GALLERIES,
  galleries,
});

export const getAllGalleries = () => async (dispatch) => {
  const response = await fetch("/api/galleries");
  const galleries = await response.json();
  dispatch(getGalleries(galleries.galleries));
  return galleries;
};

export default function galleriesReducer(state = {}, action) {
  switch (action.type) {
    case GET_GALLERIES:
      const newState = {};
      action.galleries.forEach((gallery) => {
        newState[gallery.id] = gallery;
      });
      return newState;

    default:
      return state;
  }
}
