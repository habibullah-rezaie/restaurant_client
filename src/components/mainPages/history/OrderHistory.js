import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import { Paginator } from "../utils/paginator/Paginator";
import "./history.css";
import { OrderFilter } from "./OrderFilter";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [isAdmin] = state.authAPI.isAdmin;
  const [orders] = state.userAPI.orders;
  const [page, setPage] = state.userAPI.ordersPage;
  const [limit, setLimit] = state.userAPI.ordersLimit;
  // const [sort, setSort] = state.userAPI.ordersSort;
  // TODO: handle sort later
  const [count] = state.userAPI.ordersCount;
  const { push } = useHistory();

  return (
    <div className="history-page">
      {/* FIXME: This page's style is crucial */}
      <h2>Orders</h2>
      {/* <h4>You hava {history.lenght} ordered</h4> */}
          {isAdmin && <OrderFilter />}
      <table>
        <thead>
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
            <tr key={order.id} onClick={() => push(`/history/${order.id}`)}>
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
