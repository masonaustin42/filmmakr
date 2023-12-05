import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteItem } from "../../store/gallery";

function DeleteItemModal({ itemId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Are you sure you want to delete this item?</h1>
      <button onClick={() => closeModal()}>No (go back)</button>
      <button
        onClick={async () => {
          await dispatch(deleteItem(itemId)).then(() => closeModal());
        }}
      >
        Yes (delete item)
      </button>
    </div>
  );
}

export default DeleteItemModal;
