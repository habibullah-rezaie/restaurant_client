import React, { createContext, useState } from "react";
/* LOCAL IMPORTS */
import AuthAPI from "./api/AuthAPI";
import CartAPI from "./api/CartAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import OrdersAPI from "./api/OrdersAPI";
import PostalCodesAPI from "./api/PostalCodesAPI";
import ProductsAPI from "./api/ProductsAPI";
import TimingAPI from "./api/TimingAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const authAPI = AuthAPI();
  const productsAPI = ProductsAPI();
  const categoriesAPI = CategoriesAPI();
  const timingsAPI = TimingAPI();
  const postalCodesAPI = PostalCodesAPI();
  const cartAPI = CartAPI();
  const ordersAPI = OrdersAPI(authAPI.token[0], authAPI.isAdmin[0]);
  const fromTo = useState("");

  const state = {
    authAPI,
    productsAPI,
    categoriesAPI,
    timingsAPI,
    postalCodesAPI,
    ordersAPI,
    cartAPI,
    fromTo,
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
export default GlobalState;
