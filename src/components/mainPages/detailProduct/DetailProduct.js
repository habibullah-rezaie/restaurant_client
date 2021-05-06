import React, { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItems/ProductItem";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.ProductsAPI.products;
  const addCart = state.UserAPI.addCart;
  const [detailProduct, setDetailProduct] = useState("");
  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product.id === params.id) setDetailProduct(product);
      });
    }
  }, [params.id, products]);

  if (detailProduct.length === 0) return null;
  return (
    <>
      <div className="detail" id="product-detail">
        <img
          src={`http://localhost:8888/files/${
            detailProduct.images && detailProduct.images.length > 0
              ? detailProduct.images[0].fileName
              : ""
          }`}
          alt=""
        />
        <div className="box-detail">
          <div className="row">
            <h2>{detailProduct.title}</h2>
            {/* <h6>#id: {detailProduct.id}</h6> */}
          </div>
          <span>${detailProduct.outPrice}</span>
          <p>{detailProduct.description}</p>

          {/* FIXME: ??? */}
          {/* <p>{detailProduct.content}</p> */}

          {/* TODO: Add sold to response */}
          <p>Sold: {detailProduct.sold}</p>
          <Link
            to="/cart"
            className="cart"
            onClick={() => addCart(detailProduct)}>
            Buy Now
          </Link>
        </div>
      </div>

      <div>
        <h2>Related Products</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product.id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
