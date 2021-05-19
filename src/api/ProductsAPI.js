import { useState, useEffect } from "react";
import axios from "axios";

function ProductsAPI() {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState('createdAt DESC');
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("productsAPI run");
    async function getProducts() {
      const [sortBy, sortDirection] = sort.split(" ");
      const { products, count } = (
        await axios.get(
          `http://localhost:8888/products?limit=${
            page * 9
          }&category=${category}&search=${search}&sortBy=${sortBy}&sortDirection=${sortDirection}` /*sort=${sort}&title[regex]=${search}`*/
        )
      ).data;

      for (const product of products) {
        product.images = (
          await axios.get(`http://localhost:8888/products/${product.id}/files`)
        ).data.files;
      }

      setProducts(products);
      setCount(count);
    }
    getProducts();
  }, [callback, category, sort, search, page]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    count: [count, setCount],
  };
}

export default ProductsAPI;
