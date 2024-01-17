import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { fetchGallery } from "../../store/gallery";
import OpenModalButton from "../OpenModalButton";
import CreateItemModal from "../CreateItemModal";
import DeleteItemModal from "../DeleteItemModal";
import UpdateItemModal from "../UpdateItemModal";
import GalleryPassword from "../GalleryPassword";
import "./gallery.css";

function Gallery() {
  const { galleryId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const [passwordRequired, setPasswordRequired] = useState(false);
  const password = new URLSearchParams(location.search).get("p");
  const gallery = useSelector((state) => state.gallery);
  const user = useSelector((state) => state.session?.user);

  useEffect(() => {
    (async () => {
      const getGallery = await dispatch(fetchGallery(galleryId, password));
      if (getGallery?.errors) setPasswordRequired(true);
    })();
  }, [dispatch, galleryId, password]);

  useEffect(() => {
    if (!gallery?.preview)
      document.querySelector("#navbar").classList.add("no-preview");
    else document.querySelector("#navbar").classList.remove("no-preview");
  }, [gallery]);

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
            key={item.id}
            className="preview-item"
            autoPlay={true}
            muted={true}
            loop={true}
            preload=""
            playsInline={true}
            disablePictureInPicture={true}
            disableRemotePlayback={true}
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
        return (
          <img alt="" key={item.id} className="preview-item" src={item.url} />
        );
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
  if (passwordRequired)
    return <GalleryPassword location={location} reset={setPasswordRequired} />;
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

  const VIDEO_TYPES = ["mp4", "mov", "avi", "mpeg"];
  const AUDIO_TYPES = ["mp3", "aiff", "wmv", "wav", "flac"];
  const IMAGE_TYPES = ["jpg", "jpeg", "png", "tiff"];

  return (
    <>
      {Object.keys(preview).length ? (
        <div id="preview">
          {MatchElementToItem(preview, preview.type, true)}
        </div>
      ) : null}

      <div
        id="gallery-title-container"
        className={
          Object.keys(preview).length ? "big-container" : "small-container"
        }
      >
        <h1
          id="gallery-title"
          className={Object.keys(preview).length ? "big" : "small"}
        >
          {gallery.title}
        </h1>
        {gallery?.date && (
          <h2
            id="gallery-date"
            className={Object.keys(preview).length ? "big" : "small"}
          >
            {formatDate(gallery.date)}
          </h2>
        )}
      </div>
      {gallery?.ownerId === user?.id && (
        <OpenModalButton
          buttonText="Upload an Item"
          modalComponent={<CreateItemModal galleryId={galleryId} />}
        />
      )}
      {mainItem?.url ? (
        <div id="main-item-container">
          {mainItem.name && <h2 id="main-item-name">{mainItem.name}</h2>}
          {MatchElementToItem(mainItem, mainItem.type)}
          {gallery?.ownerId === user?.id && (
            <>
              <OpenModalButton
                buttonText="Update"
                modalComponent={<UpdateItemModal item={mainItem} />}
              />
              <OpenModalButton
                buttonText="Delete"
                modalComponent={
                  <DeleteItemModal itemId={mainItem.id} isMain={true} />
                }
              />
            </>
          )}
        </div>
      ) : null}

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
                        buttonText="Update"
                        modalComponent={<UpdateItemModal item={item} />}
                      />
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={
                          <DeleteItemModal itemId={item.id} isMain={false} />
                        }
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
