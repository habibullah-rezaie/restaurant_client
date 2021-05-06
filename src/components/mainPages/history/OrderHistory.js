import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Paginator } from "../utils/paginator/Paginator";
import "./history.css";
import { OrderFilter } from "./OrderFilter";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [isAdmin] = state.UserAPI.isAdmin;
  const [orders] = state.UserAPI.orders;
  const [page, setPage] = state.UserAPI.ordersPage;
  const [limit, setLimit] = state.UserAPI.ordersLimit;
  const [sort, setSort] = state.UserAPI.ordersSort;
  const [count] = state.UserAPI.ordersCount;

  return (
    <div className="history-page">
      {/* FIXME: This page's style is crucial */}
      <h2>Orders</h2>
      {/* <h4>You hava {history.lenght} ordered</h4> */}
      <table>
        <thead>
          {isAdmin && <OrderFilter />}
          <tr>
            <th>Name</th>
            <th>Date of Purchased</th>
            <th>Phone No.</th>
            <th>amount</th>
            {isAdmin && <th>Delivered</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                {order.Customer.firstName} {order.Customer.lastName}
              </td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.Customer.phoneNumber}</td>
              <td>${order.total}</td>
              {isAdmin && (
                <td>
                  {order.isDone ? (
                    <span className="alert alert--ok">Deliverd</span>
                  ) : (
                    <span className="alert alert--error">Pending</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Paginator
        limit={[limit, setLimit]}
        page={[page, setPage]}
        count={count}
      />
    </div>
  );
}

export default OrderHistory;
