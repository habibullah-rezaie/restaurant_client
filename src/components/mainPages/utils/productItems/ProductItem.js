import React from "react";
import { Link, useHistory } from "react-router-dom";

function ProductItem({ product, isAdmin, deleteProduct }) {
  const history = useHistory();
  return (
    <div className="product-card">
      <img
        src={`http://localhost:8888/files/${
          product.files.find((file) => file.mimeType !== "video/mp4")
            ? product.files.find((file) => file.mimeType !== "video/mp4")
                .fileName
            : ""
        }`}
        alt=""
        onClick={() => history.push(`/detail/${product.id}#top`)}
      />
      <div
        className="product-box"
        onClick={() => history.push(`/detail/${product.id}#top`)}>
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.outPrice}</span>
        <p>{product.description}</p>
      </div>
      {isAdmin && (
        <>
          <Link
            id="btn-buy"
            to="#!"
            onClick={() => deleteProduct(product.id, product.files.pubilc_id)}>
            Delete
          </Link>
          <Link id="btn-view" to={`/edit_product/${product.id}`}>
            Edit
          </Link>{" "}
        </>
      )}
    </div>
  );
}

export default ProductItem;
