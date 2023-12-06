import { useDispatch } from "react-redux";
import { updateItem } from "../../store/gallery";
import { useModal } from "../../context/Modal";
import { useState } from "react";

function UpdateItemModal({ item }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [name, setName] = useState(item.name);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    if (name) formdata.append("name", name);
    if (file) formdata.append("media", file);
    const newItem = await dispatch(updateItem(formdata, item.id));
    if (newItem.errors) setErrors(newItem.errors);
    else {
      closeModal();
    }
  };
  return (
    <div>
      <h2>Upload an Item</h2>
      {Object.values(errors).map((error) => (
        <p>{error}</p>
      ))}
      <form onSubmit={onSubmit} encType="multipart/formdata">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          File
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button>Update Item</button>
      </form>
    </div>
  );
}

export default UpdateItemModal;
