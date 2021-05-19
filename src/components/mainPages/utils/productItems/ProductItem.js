import React, { useState } from "react";
import BtnRender from "./BtnRender";

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
      />

      <div className="product-box">
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.outPrice}</span>
        <p>{product.description}</p>
      </div>

      <BtnRender
        product={product}
        loading={loading}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}

export default ProductItem;
