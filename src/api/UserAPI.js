import { useState, useEffect } from "react";
import axios from "axios";

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]); // Search for localStorage orders stored in the cart
  const [history, setHistory] = useState([]); // Search for localStorage orders stored in the history
  const [orderCount, setOrderCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt DESC");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isDone, setIsDone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    console.log("ran");
    const fetchOrderHistory = async () => {
      const [sortBy, sortDirection] = sort.split(" ");
      try {
        const { orders, count } = (
          await axios.get(
            `http://localhost:8888/admin/orders?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
            {
              headers: {
                Authorization: `Barear ${token}`,
              },
            }
          )
        ).data;

        setHistory(orders);
        setOrderCount(count);
      } catch (error) {
        if (error.response) alert(error.response.data.message);
      }
    };

    if (token) {
      setIsLogged(true);
      setIsAdmin(true);

      fetchOrderHistory();
    } else {
      try {
        const orders = JSON.parse(localStorage.getItem("orders"));

        setHistory(orders instanceof Array ? orders : []);
        setOrderCount(orders.length);
      } catch (err) {
        console.warn("Cannot load orders from local storage.");
      }
    }
  }, [token, limit, page, sort, callback]);

  const addCart = async (product) => {
    const preExistence = cart.every((item) => {
      return item.id !== product.id;
    });
    if (preExistence) {
      setCart([...cart, { ...product, quantity: 1 }]);
    } else {
      alert("This product is has been added to cart."); // TODO: USE model instead
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    orders: [history, setHistory],
    ordersCount: [orderCount, setOrderCount],
    ordersLimit: [limit, setLimit],
    ordersPage: [page, setPage],
    ordersSort: [sort, setSort],
    ordererFirstName: [firstName, setFirstName],
    ordererLastName: [lastName, setLastName],
    ordererPhoneNumber: [phoneNumber, setPhoneNumber],
    orderEndDate: [endDate, setEndDate],
    orderStartDate: [startDate, setStartDate],
    orderIsDone: [isDone, setIsDone],
    orderZipCode: [zipCode, setZipCode],
    refresh: [callback, setCallback],
  };
}

export default UserAPI;
