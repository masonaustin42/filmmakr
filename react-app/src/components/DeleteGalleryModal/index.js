import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGallery } from "../../store/user_profile";
import "./DeleteModal.css";

function DeleteGalleryModal({ galleryId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  return (
    <>
      <h1>Are you sure you want to delete this gallery?</h1>
      <div id="delete-container">
        <button className="no-delete" onClick={() => closeModal()}>
          No (go back)
        </button>
        <button
          className="delete"
          onClick={async () => {
            await dispatch(deleteGallery(galleryId)).then(() => closeModal());
          }}
        >
          Yes (delete gallery)
        </button>
      </div>
    </>
  );
}

export default DeleteGalleryModal;
