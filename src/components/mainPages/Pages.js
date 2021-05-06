import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import DetailProduct from "./detailProduct/DetailProduct";
import Cart from "./cart/Cart";
import Products from "./products/Products";
import OrderHistory from "./history/OrderHistory";
import OrderDetail from "./history/OrderDetail";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import { GlobalState } from "../../GlobalState";
import CreateProduct from "./createProduct/CreateProduct";
function Pages() {
  const state = useContext(GlobalState);
  const [isAdmin] = state.UserAPI.isAdmin;

  return (
    <Switch>
      <Route path="/admin" exact component={isAdmin ? Products : Login} />

      <Route path="/detail/:id" exact component={DetailProduct} />

      <Route
        path="/category"
        exact
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        path="/create_product"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        path="/edit_product/:id"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route path="/history" exact component={OrderHistory} />
      <Route path="/history/:id" exact component={OrderDetail} />

      <Route path="/cart" exact component={Cart} />
      <Route path="/" exact component={Products} />
      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}

export default Pages;
