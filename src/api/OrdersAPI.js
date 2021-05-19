import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { isEqual } from "../helpers/helpers";

function OrdersAPI(token, isAdmin) {
  const [history, setHistory] = useState([]); // Search for localStorage orders stored in the history
  const [orderCount, setOrderCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt DESC");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isDone, setIsDone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [callback, setCallback] = useState(false);

  const latestHistory = useRef(history);

  useEffect(() => {
    console.log("useAPI ran");
    async function fetchOrderHistory() {
      const [sortBy, sortDirection] = sort.split(" ");
      try {
        let url = `http://localhost:8888/admin/orders?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}`;

        if (phoneNumber) url += `&phoneNumber=${phoneNumber}`;
        if (endDate) url += `&endDate=${endDate}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (isDone !== "") url += `&isDone=${isDone ? 1 : 0}`;
        if (zipCode) url += `&zipCode=${zipCode}`;

        const { orders, count } = (
          await axios.get(url, {
            headers: {
              Authorization: `Barear ${token}`,
            },
          })
        ).data;

        if (!isEqual(latestHistory.current, orders)) {
          setHistory(orders);
          setOrderCount(count);
          latestHistory.current = orders;
        }
      } catch (error) {
        if (error.response) alert(error.response.data.message);
      }
    }

    if (isAdmin) {
      fetchOrderHistory();
    } else {
      try {
        const orders = JSON.parse(localStorage.getItem("orders"));
        if (!isEqual(latestHistory.current, orders)) {
          setHistory(orders instanceof Array ? orders : []);
          setOrderCount(orders.length);
          latestHistory.current = orders;
        }
      } catch (err) {
        console.warn("Cannot load orders from local storage.");
      }
    }
  }, [
    isAdmin,
    token,
    limit,
    page,
    sort,
    phoneNumber,
    endDate,
    startDate,
    isDone,
    zipCode,
    callback,
  ]);

  return {
    orders: [history, setHistory],
    ordersCount: [orderCount, setOrderCount],
    ordersLimit: [limit, setLimit],
    ordersPage: [page, setPage],
    ordersSort: [sort, setSort],
    ordererPhoneNumber: [phoneNumber, setPhoneNumber],
    orderEndDate: [endDate, setEndDate],
    orderStartDate: [startDate, setStartDate],
    orderIsDone: [isDone, setIsDone],
    orderZipCode: [zipCode, setZipCode],
    refresh: [callback, setCallback],
  };
}

export default OrdersAPI;
