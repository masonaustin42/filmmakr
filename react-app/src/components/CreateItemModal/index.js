import { useDispatch } from "react-redux";
import { uploadItem } from "../../store/gallery";
import { useModal } from "../../context/Modal";
import { useState } from "react";

function CreateItemModal({ galleryId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) setErrors({ file: "No file has been selected" });
    const formdata = new FormData();
    if (name) formdata.append("name", name);
    formdata.append("media", file);
    const newItem = await dispatch(uploadItem(formdata, galleryId));
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
        <button>Upload Item</button>
      </form>
    </div>
  );
}

export default CreateItemModal;
