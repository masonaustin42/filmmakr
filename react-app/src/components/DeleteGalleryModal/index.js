import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGallery } from "../../store/user_profile";

function DeleteGalleryModal({ galleryId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Are you sure you want to delete this gallery?</h1>
      <button onClick={() => closeModal()}>No (go back)</button>
      <button
        onClick={async () => {
          await dispatch(deleteGallery(galleryId)).then(() => closeModal());
        }}
      >
        Yes (delete gallery)
      </button>
    </div>
  );
}

export default DeleteGalleryModal;
