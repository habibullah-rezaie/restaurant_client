import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItems/ProductItem";
import Loading from "../utils/loading/Loading";
import axios from "axios";
import Filters from "./Filters";
import LoadMore from "./LoadMore";

function Products() {
  const state = useContext(GlobalState);

  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.authAPI.isAdmin;
  const [token] = state.authAPI.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product.id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const deleteProduct = await axios.delete(
        `http://localhost:8888/admin/products/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      await deleteProduct;
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.message);
      console.error(err);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isAllSelected;
    });
    setProducts([...products]);
    setIsAllSelected(!isAllSelected);
  };

  const deleteAllChecked = () => {
    window.location.href = "/";
    return new Promise(() => {
      products.forEach((product) => {
        if (product.checked) deleteProduct(product.id);
      });

      setLoading(false);
    });
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <>
      <Filters />

      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isAllSelected} onChange={checkAll} />
          <button onClick={deleteAllChecked}>Delete</button>
        </div>
      )}

      {/* Products */}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>

      {/* TODO: Set timeout for loading */}
      {products.length === 0 && <Loading />}
      <LoadMore />
    </>
  );
}

export default Products;
