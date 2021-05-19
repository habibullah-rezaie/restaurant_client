import { useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { isEqual } from "../helpers/helpers";

/**
 * @returns {{cart, cartErr, setCart, addToCart, increaseQty, decreaseQty, deleteFromCart}}
 */
function CartAPI() {
  const [cart, setCart] = useState([]); // Search for localStorage orders stored in the cart
  const [cartErr, setCartErr] = useState("");
  const [initialRender, setInitialRender] = useState(true);

  const cartRef = useRef(cart);

  if (!isEqual(cartRef.current, cart)) {
    cartRef.current = cart;
  }

  useEffect(() => {
    let cartFromStorage = localStorage.getItem("cart");

    if (initialRender && cartFromStorage) {
      try {
        cartFromStorage = JSON.parse(cartFromStorage);
      } catch (err) {
        setCartErr("Invalid JSON fromat.");
        localStorage.removeItem("cart");
      }

      if (
        !(cartFromStorage.items instanceof Array) ||
        !cartFromStorage.updatedAt instanceof Number
      ) {
        setCartErr("Invalid cart format stored in local storage.");
        localStorage.removeItem("cart");
      } else if (Date.now() - localStorage.updatedAt >= 86400) {
        setCartErr(
          "Previous items in cart are expired. Cart items are valid only within 24 hours."
        );
        localStorage.removeItem("cart");
      } else if (!validateCart(cartFromStorage.items)) {
        setCartErr("Invalid cart-items format.");
        localStorage.removeItem("cart");
      } else {
        setCart(cartFromStorage.items);
        setInitialRender(false);
      }
      // localStorage.setItem("cart", {
      //   createdAt: Date.now(),
      //   items: localStorage.items,
      // });
    } else if (cart.length >= 0) {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          createdAt: Date.now(),
          items: cart,
        })
      );
    }
  }, [cartRef.current]);

  /**
   * Validate if cart items have valid format
   * @param {Array} cart Array of cart items
   */
  function validateCart(cart) {
    if (!(cart instanceof Array)) return false;

    // TODO: Install validator and do validations
    return true;
  }

  function findCartItem(id, toppings, remark) {
    return cart.findIndex(
      (item) =>
        id === item.product.id &&
        item.remark === remark &&
        isEqual(item.toppings, toppings)
    );
  }

  /**
   * Add a new item to the cart
   */
  function addToCart(newItem) {
    console.log(newItem);
    const index = findCartItem(
      newItem.product.id,
      newItem.toppings,
      newItem.remark
    );

    if (index === -1) {
      setCart([...cart, { ...newItem, id: uuidV4() }]);
    } else {
      return -1;
    }
  }

  function replaceCartItem(id, item) {
    const index = cart.findIndex((cartItem) => cartItem.id === id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart[index] = item;

      setCart(newCart);
    } else return -1;
  }

  /**
   * Increase quantity of the item with the same id, and chosen toppings
   * @param {String} id Id of the item
   */
  function increaseQty(id) {
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      const newItem = { ...cart[index], qty: cart[index].qty + 1 };
      const newCart = [...cart];
      newCart[index] = newItem;
      setCart(newCart);
    } else {
      return -1;
    }
  }

  /**
   * Increase quantity of the item if exists
   *
   * @param {String} id Id of the item to decrease its quantity
   */
  function decreaseQty(id) {
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1 && cart[index].qty > 1) {
      const newItem = { ...cart[index], qty: cart[index].qty - 1 };
      const newCart = [...cart];
      newCart[index] = newItem;
      setCart(newCart);
    } else if (index !== -1 && cart[index].qty === 1) {
      const newCart = [...cart].splice(index, 1);
      setCart(newCart);
    } else return -1;
  }

  /**
   * Delete an item with same id and toppings if exists, else return -1
   * @param {String} id Id of the item that is a product with product id "id"
   */
  function deleteFromCart(id) {
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      setCart(cart.filter((cartItem) => cartItem.id !== id));
    } else return -1;
  }

  return {
    cart,
    cartErr,
    setCart,
    addToCart,
    increaseQty,
    decreaseQty,
    deleteFromCart,
    findCartItem,
    replaceCartItem,
  };
}

export default CartAPI;
