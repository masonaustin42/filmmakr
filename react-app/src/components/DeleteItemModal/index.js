import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteItem } from "../../store/gallery";

function DeleteItemModal({ itemId, isMain }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  return (
    <>
      <h1>Are you sure you want to delete this item?</h1>
      <div id="delete-container">
        <button className="no-delete" onClick={() => closeModal()}>
          No (go back)
        </button>
        <button
          className="delete"
          onClick={async () => {
            await dispatch(deleteItem(itemId, isMain)).then(() => closeModal());
          }}
        >
          Yes (delete item)
        </button>
      </div>
    </>
  );
}

export default DeleteItemModal;
