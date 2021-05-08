import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import "./category.css";

function Categories() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });
  const [token] = state.authAPI.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (!category.name) {
        return setNameErr("Name is required");
      } else if (!onEdit && categories.find((ctg) => ctg.name === category.name)) {
        return setNameErr("Category already exists.");
      }

      if (category.description.length > 2000) {
        return setDescriptionErr("Description longer than 2000 characters!");
      }

      if (onEdit) {
        const res = await axios.put(
          `http://localhost:8888/admin/products/categories/${id}`,
          { name: category.name, description: category.description },
          {
            headers: { Authorization: `Barear ${token}` },
          }

          //TODO: Show a message
          //  show some sort of model
        );

        setID("");
      } else {
        const res = await axios.post(
          "http://localhost:8888/admin/products/categories",
          { name: category.name, description: category.description },
          {
            headers: { Authorization: `Barear ${token}` },
          }
        );

        alert(res.data.message); // TODO: SHOW a message
      }
      setOnEdit(false);
      setCategory({ name: "", description: "" });
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const onInputsChange = ({ name, description }) => {
    if (!category.name) {
      setNameErr("Name is required");
    } else {
      if (nameErr) setNameErr("");
    }

    if (category.description.length > 2000) {
      setDescriptionErr("Description longer than 2000 characters!");
    } else {
      if (descriptionErr) setDescriptionErr("");
    }

    setCategory({ name, description });
  };

  const editCategory = async (id, { name, description }) => {
    window.location.href = "/category#form";
    setID(id);
    setCategory({ name, description });
    setOnEdit(true);
  };

  //   Delete a category
  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8888/admin/products/categories/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.message);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  return (
    <div className="categories">
      <form onSubmit={createCategory} id="form">
        <label htmlfor="category">name:</label>
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={(e) =>
            onInputsChange({ ...category, name: e.target.value })
          }
          required
        />

        {nameErr && (
          <div className="" style={{ border: "1px solid red" }}>
            {nameErr}
          </div>
        )}

        <label htmlfor="">description:</label>
        <textarea
          type="text"
          name="description"
          value={category.description}
          onChange={(e) =>
            onInputsChange({ ...category, description: e.target.value })
          }
          required></textarea>
        {descriptionErr && (
          <div className="" style={{ border: "1px solid red" }}>
            {descriptionErr}
          </div>
        )}
        <button type="submit" disabled={nameErr || descriptionErr}>
          {onEdit ? "Update" : "Create"}
        </button>
      </form>

      <div className="col">
        {categories.map((category) => (
          <div className="row" key={category.id}>
            <p>
              <strong>{category.name}</strong>
            </p>
            <p>{category.description}</p>
            <div>
              <button
                onClick={() =>
                  editCategory(category.id, {
                    name: category.name,
                    description: category.description,
                  })
                }>
                Edit
              </button>
              <button onClick={() => deleteCategory(category.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
