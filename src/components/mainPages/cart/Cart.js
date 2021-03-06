import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { calcItemPrice } from "../../../helpers/product";
import CartItem from "./Cartitem/CartItem";

function Cart() {
  const state = useContext(GlobalState);
  const { cart } = state.cartAPI;
  const [totals, setTotals] = useState({});

  function calcItemTotal(id, price, qty, toppings, discount) {
    const total = calcItemPrice(price, qty, toppings, discount);
    const newTotals = { ...totals, [id]: total };
    if (total !== totals[id]) setTotals(newTotals);
    return total;
  }

  function calcTotal() {
    return Object.keys(totals).reduce(
      (prevTotal, cartItemId) => prevTotal + totals[cartItemId],
      0
    );
  }

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart is empty</h2>
    );

  return (
    <div>
      {cart.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          discount={cartItem.product.discount}
          file={cartItem.product.files.find(
            (file) => file.mimeType !== "video/mp4"
          )}
          qty={cartItem.qty}
          id={cartItem.id}
          itemToppings={cartItem.toppings}
          productId={cartItem.product.id}
          calcItemTotal={calcItemTotal}
        />
      ))}

      <div className="total">
        <h3>Total :$ {calcTotal()}</h3>
        {/* <PaypalButton total={calcTotal()} tranSuccess={tranSuccess} /> */}
      </div>
    </div>
  );
}

export default Cart;
