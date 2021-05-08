import React, { createContext } from "react";
import AuthAPI from "./api/AuthAPI";
import UserAPI from "./api/UserAPI";
import ProductsAPI from "./api/ProductsAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import TimingAPI from "./api/TimingAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const authAPI = AuthAPI();
  const userAPI = UserAPI(authAPI.token[0], authAPI.isAdmin[0]);
  const productsAPI = ProductsAPI();
  const categoriesAPI = CategoriesAPI();
  const timingsAPI = TimingAPI();

  const state = {
    authAPI,
    productsAPI,
    userAPI,
    categoriesAPI,
    timingsAPI
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
export default GlobalState;
