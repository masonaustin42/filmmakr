import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { fetchGallery } from "../../store/gallery";

function Gallery() {
  const { galleryId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const password = new URLSearchParams(location.search).get("p");
  const gallery = useSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchGallery(galleryId, password));
  }, [dispatch, galleryId, password]);

  return (
    <>
      <img src="" alt="" />
      <h1>{gallery.title}</h1>
    </>
  );
}

export default Gallery;
