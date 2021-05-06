import React, { useState } from "react";
import BtnRender from "./BtnRender";

function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
  const [loading] = useState(false); //before in setLoading is here but i remove it for warning!!!!!!!!!!!!!!!!!!!111

  return (
    <div className="product-card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product.id)}
        />
      )}
      <img
        src={`http://localhost:8888/files/${
          product.images.length > 0 ? product.images[0].fileName : ""
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
