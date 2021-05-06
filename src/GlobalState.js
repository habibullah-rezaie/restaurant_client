import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshAccessToken = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8888/auth/token?refreshToken=${refreshToken}`
          );

          setToken(res.data.token);
          setTimeout(() => {
            refreshAccessToken();
          }, 60 * 1000);
        } catch (err) {
          console.error(err);
          if (err.response) alert(err.response.data.message);
        }
      };

      refreshAccessToken();
    }
  }, [token, setToken]); // before in token in this useEffect!!!!!!!111111!!!!!!!!!!!!!!!1

  const state = {
    token: [token, setToken],
    ProductsAPI: ProductsAPI(),
    UserAPI: UserAPI(token),
    CategoriesAPI: CategoriesAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
export default GlobalState;
