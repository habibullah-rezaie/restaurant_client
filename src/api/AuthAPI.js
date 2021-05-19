import axios from "axios";
import { useEffect, useState } from "react";

const AuthAPI = () => {
  const [token, setToken] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    let id;
    if (refreshToken) {
      async function refreshAccessToken() {
        try {
          console.log("auth api run 1");
          const res = await axios.get(
            `http://localhost:8888/auth/token?refreshToken=${refreshToken}`
          );

          setToken(res.data.token);
          setIsAdmin(true);

          id = setTimeout(() => {
            refreshAccessToken();
          }, 15 * 60 * 1000);
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
