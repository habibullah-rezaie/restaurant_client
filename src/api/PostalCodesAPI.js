import { useState, useEffect } from "react";
import axios from "axios";

function PostalCodesAPI() {
  const [postalCodes, setPostalCodes] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    console.log("PostalCodesAPI ran");
    async function fetchPostalCodes() {
      try {
        const res = await axios({
          method: "get",
          url: "http://localhost:8888/zipCodes",
          headers: {},
        });
        setPostalCodes(res.data.zipCodes);
      } catch (err) {
        if (err.response) alert(err.response.data.message);
      }
    }
    fetchPostalCodes();
  }, [callback]);

  return {
    postalCodes: [postalCodes, setPostalCodes],
    callback: [callback, setCallback],
  };
}

export default PostalCodesAPI;
