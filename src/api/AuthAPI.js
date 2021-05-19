import axios from "axios";
import React, { useEffect, useState } from "react";

const AuthAPI = () => {
  const [token, setToken] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

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
      return () => {
        clearTimeout(id);
      };
    }
  });

  useEffect(() => {
    if (token) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  return {
    token: [token, setToken],
    isAdmin: [isAdmin, setIsAdmin],
  };
};

export default AuthAPI;
