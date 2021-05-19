import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react/cjs/react.development";
import GlobalState from "../../../../GlobalState";
import { isEqual } from "../../../../helpers/helpers";
import { calcItemPrice } from "../../../../helpers/product";
import ProductHero from "../../detailProduct/ProductHero/ProductHero";
import GlobalErr from "../../utils/Error/GlobalErr";

function CartItem({ productId, id, qty, itemToppings, calcItemTotal }) {
  const globalState = useContext(GlobalState);
  const { decreaseQty, increaseQty, deleteFromCart } = globalState.cartAPI;
  const [product, setProduct] = useState({
    id: "",
    title: "",
    outPrice: 0,
    discount: 0,
    productCategory: {},
    toppings: [],
    files: [],
  });
  const [chosenToppings, setChosenToppings] = useState([]);
  const [toppingErr, setToppingErr] = useState("");
  const [globalErr, setGlobalErr] = useState("");

  const productToppingsRef = useRef(product.toppings);
  const itemToppingsRef = useRef(itemToppings);

  if (!isEqual(productToppingsRef, product.toppings))
    productToppingsRef.current = product.toppings;

  if (!isEqual(itemToppingsRef, itemToppings))
    itemToppingsRef.current = itemToppings;

  useEffect(() => {
    console.log("cartitem run");
    if (!product.id) {
      async function fetchProductDetails() {
        try {
          // Route Config
          const routeConfig = {
            method: "get",
            url: "http://localhost:8888/products/" + productId,
            headers: {},
          };

          // Fetch Product details
          const { product } = (await axios(routeConfig)).data;

          // Refresh data
          setProduct(product);
        } catch (err) {
          // If product not found, say some details
          if (err.response) {
            const body = err.response.data;
            if (
              body.details &&
              body.details.includes("No product exist with given id")
            ) {
              setGlobalErr("This dish is not currently available.");
            }
          }
        }
      }

      fetchProductDetails();
    } else {
      const chosenToppingsInProductToppings = product.toppings.filter((tp) => {
        if (
          itemToppings[tp.id] &&
          (itemToppings[tp.id].title !== tp.title ||
            itemToppings[tp.id].price !== tp.price)
        )
          setToppingErr(
            `Toppings for ${product.title} has been changed, take an eye at the product detail.`
          );
        return itemToppings[tp.id] && itemToppings[tp.id].title === tp.title;
      });

      setChosenToppings(chosenToppingsInProductToppings);
    }
  }, [
    product.id,
    productId,
    product.title,
    productToppingsRef.current,
    itemToppingsRef.current,
  ]);

  function handleAcceptChange() {
    // TODO: save changes to localstorage
  }

  return (
    <div className="detail cart">
      {globalErr ? (
        <GlobalErr error={globalErr} />
      ) : (
        <>
          <ProductHero
            discount={product.discount}
            primaryPrice={calcItemPrice(product.outPrice, qty, chosenToppings)}
            priceIfDiscount={calcItemTotal(id, 
              product.outPrice,
              qty,
              chosenToppings,
              product.discount
            )}
            file={product.files.find((file) => file.mimeType !== "video/mp4")}
            name={product.title}
          />

          <div className="amount">
            <button onClick={() => decreaseQty(id)}> - </button>
            <span>{qty}</span>
            <button onClick={() => increaseQty(id)}> + </button>
          </div>
          <div className="delete" onClick={() => deleteFromCart(id)}>
            X
          </div>

          {toppingErr && (
            <>
              <small className="text-red-500">
                <strong>*</strong> {toppingErr}
              </small>
              <button
                className="text-sm text-green-500"
                onClick={handleAcceptChange}>
                Okay
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CartItem;
