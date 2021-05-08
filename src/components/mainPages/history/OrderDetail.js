import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";

function OrderDetail() {
  const state = useContext(GlobalState);
  const [order, setOrder] = useState(undefined);
  const [token] = state.authAPI.token;
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    // Get the details of the order from server.
    const fetchOrder = async () => {
      setLoading(true);
      if (params.id && token) {
        const config = {
          method: "get",
          url: `http://localhost:8888/admin/orders/${params.id}`,
          headers: {
            Authorization: `Barear ${token}`,
          },
        };

        let res;
        try {
          res = await axios(config);
          setOrder(res.data.order);
          setProducts(res.data.products);
          setLoading(false);
        } catch (err) {
          console.error(err);
          if (err.response) alert(err.response.data.message);
        }
      }
    };

    fetchOrder();
  }, [params.id, token, callback]);

  const handleDeliveryStatusChange = async () => {
    const response = prompt(
      `Do you want to change delivery status to ${
        order.isDone ? `"Pending"` : `"Delivered"`
      }`
    );

    if (response && response.startsWith("y")) {
      await axios({
        method: "patch",
        url: "http://localhost:8888/admin/orders/" + order.id,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setCallback(!callback);
    }
  };

  const errorMarkup = () => (
    <p
      style={{
        border: "1px solid red",
        padding: "1rem",
        backgroundColor: "#bb0000",
      }}>
      No Order exist with Given Id.
    </p>
  );

  const successMarkup = () => (
    <div className="history-page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "2rem",
          marginBottom: ".5rem",
        }}>
        {order.isDone ? (
          <div style={{ height: "1.75rem" }} className="alert alert--ok">
            <strong>Deliverd</strong>{" "}
            <span
              style={{ marginLeft: ".2rem" }}
              onClick={handleDeliveryStatusChange}>
              EDIT
            </span>
          </div>
        ) : (
          <div style={{ height: "1.75rem" }} className="alert alert--error">
            <strong>Pending</strong>{" "}
            <span
              style={{ marginLeft: ".2rem" }}
              onClick={handleDeliveryStatusChange}>
              EDIT
            </span>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>postal Code </th>
            {/* <th>Country Code </th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {`${order.Customer.firstName} \
              ${order.Customer.lastName}`}
            </td>
            <td>{order.Customer.Address.detail}</td>
            <td>{order.Customer.Address.ZipCode}</td>
            {/* <td>{orderDetails.Address.country_code}</td> */}
          </tr>
        </tbody>
      </table>

      <table style={{ margin: "30px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity </th>
            <th>Price</th>
            <th>toppings count</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={
                    item.Files.length > 0
                      ? `http://localhost:8888/files/${item.Files[0].fileName}`
                      : ""
                  }
                  alt=""
                />
              </td>
              <td>{item.title}</td>
              <td>{item.OrderItem.qty}</td>
              <td>${item.OrderItem.outPrice * item.OrderItem.qty}</td>
              <td>
                {item.toppings.map((tp) => (
                  <p>
                    {tp.title}={tp.price}
                  </p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>{loading ? <Loading /> : !order ? errorMarkup() : successMarkup()}</>
  );
}

export default OrderDetail;
