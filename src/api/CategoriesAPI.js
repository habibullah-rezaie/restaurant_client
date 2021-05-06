import { useState, useEffect } from "react";
import axios from "axios";

function CategoriesAPI() {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8888/products/categories");
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err) 
        if (err.response) alert(err.response.data.message);
      }
    };
    getCategories();
  }, [callback]);

  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
}

export default CategoriesAPI;
