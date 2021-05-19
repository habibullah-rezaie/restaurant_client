import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import "./PostalCodes.css";

function PostalCodes() {
  const state = useContext(GlobalState);
  const [postalCodes] = state.postalCodesAPI.postalCodes;
  const [postalCode, setPostalCode] = useState({
    code: "",
    description: "",
  });
  const [token] = state.authAPI.token;
  const [, setPostalCodesRefreshFlag] = state.postalCodesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [codeErr, setCodeErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!postalCode.code) {
        return setCodeErr("Postal Code is required.");
      } else if (!/^\d{5}$/.test(postalCode.code)) {
        return setCodeErr("Postal Code is invalid.");
      } else if (
        !onEdit &&
        postalCodes.find((p) => p.code === postalCode.code)
      ) {
        return setCodeErr("Postal Code already exists.");
      }

      if (postalCode.description.length > 255) {
        return setDescriptionErr("Description longer than 255 characters!");
      }

      if (onEdit) {
        await axios.put(
          `http://localhost:8888/admin/zipCodes/${postalCode.code}`,
          { description: postalCode.description },
          {
            headers: { Authorization: `Barear ${token}` },
          }
        );

        setOnEdit(false);
      } else {
        await axios.post(
          "http://localhost:8888/admin/zipCodes",
          { code: postalCode.code, description: postalCode.description },
          {
            headers: { Authorization: `Barear ${token}` },
          }
        );
      }
      setPostalCode({ code: "", description: "" });
      setPostalCodesRefreshFlag((prevValue) => !prevValue);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const onInputsChange = ({ code, description }) => {
    if (!code) {
      setCodeErr("Postal Code is required");
    } else if (!/^\d{5}$/.test(code)) {
      setCodeErr("Postal Code is invalid.");
    } else {
      if (codeErr) setCodeErr("");
    }

    if (description.length > 255) {
      setDescriptionErr("Description longer than 255 characters!");
    } else {
      if (descriptionErr) setDescriptionErr("");
    }

    setPostalCode({ code, description });
  };

  const editPostalCode = async ({ code, description }) => {
    setOnEdit(true);
    window.location.href = "/postal_codes#form";
    setPostalCode({ code, description });
  };

  //   Delete a postal code
  const deletePostalCode = async (code) => {
    try {
      await axios.delete(`http://localhost:8888/admin/zipCodes/${code}`, {
        headers: { Authorization: `Barear ${token}` },
      });
      setPostalCodesRefreshFlag((prevValue) => !prevValue);
    } catch (err) {}
  };

  return (
    <div className="postal-codes">
      <form onSubmit={handleFormSubmit} id="form">
        <label htmlFor="postalCode">Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={postalCode.code}
          onChange={(e) =>
            onInputsChange({ ...postalCode, code: e.target.value })
          }
          id="postalCode"
          disabled={onEdit}
          required
          placeholder="#####"
        />

        {codeErr && <div className="alert alert--error">{codeErr}</div>}

        <label htmlFor="description">description:</label>
        <textarea
          className="bg-gray-100"
          type="text"
          name="description"
          value={postalCode.description}
          onChange={(e) =>
            onInputsChange({ ...postalCode, description: e.target.value })
          }
          placeholder="your description"></textarea>
        {descriptionErr && (
          <div className="alert alert--error">{descriptionErr}</div>
        )}
        <button type="submit" disabled={codeErr || descriptionErr}>
          {onEdit ? "Update" : "Create"}
        </button>
      </form>

      <div className="col">
        {postalCodes.map((postalCode) => (
          <div className="row" key={postalCode.code}>
            <p>
              <strong>{postalCode.code}</strong>
            </p>
            <p>{postalCode.description}</p>
            <div className="flex space-x-1">
              <button
                className="btn btn__ok"
                onClick={() =>
                  editPostalCode({
                    code: postalCode.code,
                    description: postalCode.description,
                  })
                }>
                Edit
              </button>
              <button
                className="btn btn__cancel"
                onClick={() => deletePostalCode(postalCode.code)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostalCodes;
