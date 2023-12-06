import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  matchPath,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { fetchGallery } from "../../store/gallery";
import OpenModalButton from "../OpenModalButton";
import CreateItemModal from "../CreateItemModal";
import DeleteItemModal from "../DeleteItemModal";
import UpdateItemModal from "../UpdateItemModal";

function Gallery() {
  const { galleryId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const password = new URLSearchParams(location.search).get("p");
  const gallery = useSelector((state) => state.gallery);
  const user = useSelector((state) => state.session?.user);

  useEffect(() => {
    dispatch(fetchGallery(galleryId, password));
  }, [dispatch, galleryId, password]);

  const formatDate = (datestring) => {
    const date = new Date(datestring);
    return `${date.getUTCDate()}/${
      date.getUTCMonth() + 1
    }/${date.getUTCFullYear()}`;
  };

  const MatchElementToItem = (item, type, isPreview = false) => {
    if (VIDEO_TYPES.includes(type)) {
      if (isPreview) {
        return (
          <video
            autoPlay={true}
            muted={true}
            key={item.id}
            className="preview-item"
          >
            <source src={`${item.url}`} />
          </video>
        );
      } else {
        return (
          <video
            controls
            key={item.id}
            className={item.is_main ? "main-item" : "item video"}
          >
            <source src={`${item.url}`} />
          </video>
        );
      }
    } else if (AUDIO_TYPES.includes(type)) {
      return (
        <audio
          key={item.id}
          className={item.is_main ? "main-item" : "item audio"}
        >
          <source src={`${item.url}`} />
        </audio>
      );
    } else if (IMAGE_TYPES.includes(type)) {
      if (isPreview) {
        <img alt="" key={item.id} className="preview-item">
          <source src={`${item.url}`} />
        </img>;
      } else {
        return (
          <img
            alt=""
            key={item.id}
            className={item.is_main ? "main-item" : "item image"}
            src={`${item.url}`}
          />
        );
      }
    } else {
      return null;
    }
  };

  if (!gallery) return null;

  const mainItem = gallery.items?.main || {};
  const items = gallery?.items ? Object.values(gallery.items) : null;

  const preview = gallery.preview
    ? {
        url: gallery.preview,
        type: gallery.preview
          .split(".")
          [gallery.preview.split(".").length - 1].toLowerCase(),
      }
    : {};

  console.log("PREVIEW:, ", preview);

  const VIDEO_TYPES = ["mp4", "mov", "avi", "mpeg"];
  const AUDIO_TYPES = ["mp3", "aiff", "wmv", "wav", "flac"];
  const IMAGE_TYPES = ["jpg", "jpeg", "png", "tiff"];

  return (
    <>
      <div id="preview">{MatchElementToItem(preview, preview.type, true)}</div>
      <h1>{gallery.title}</h1>
      {gallery?.date && <h2>{formatDate(gallery.date)}</h2>}
      {gallery?.ownerId === user?.id && (
        <OpenModalButton
          buttonText="Upload an Item"
          modalComponent={<CreateItemModal galleryId={galleryId} />}
        />
      )}
      <div id="main-item-container">
        {mainItem.name && <p>{mainItem.name}</p>}
        {MatchElementToItem(mainItem, mainItem.type)}
        {gallery?.ownerId === user?.id && (
          <>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteItemModal itemId={mainItem.id} />}
            />
            <OpenModalButton
              buttonText="Update"
              modalComponent={<UpdateItemModal item={mainItem} />}
            />
          </>
        )}
      </div>
      <div id="items-container">
        {items &&
          items.map((item) => {
            if (!item.is_main)
              return (
                <div key={item.id}>
                  {item.name && <p>{item.name}</p>}
                  {MatchElementToItem(item, item.type)}
                  {gallery?.ownerId === user?.id && (
                    <>
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteItemModal itemId={item.id} />}
                      />
                      <OpenModalButton
                        buttonText="Update"
                        modalComponent={<UpdateItemModal item={item} />}
                      />
                    </>
                  )}
                </div>
              );
            else return null;
          })}
      </div>
    </>
  );
}

export default Gallery;
