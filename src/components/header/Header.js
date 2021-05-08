import { useState, useContext } from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/menu.svg";
import Close from "./icon/close.svg";
import Cart from "./icon/cart.svg";
import { Link, NavLink } from "react-router-dom";
import "./header.css";

import axios from "axios";
export default function Header() {
  const state = useContext(GlobalState);
  const [isAdmin, setIsAdmin] = state.authAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);

  const logoutUser = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      setIsAdmin(false)
    }
    await axios.delete(
      `http://localhost:8888/auth/logout?refreshToken=${refreshToken}`
    );

    localStorage.removeItem("refreshToken");

    window.location.href = "/";
  };

  const renderTabs = () => {
    return (
      <>
        <li>
          <NavLink exact={true} activeClassName="header__link--active" to="/">
            {" "}
            {isAdmin ? "Products" : "Shop"}{" "}
          </NavLink>
        </li>
        {isAdmin && (
          <>
            <li>
              <NavLink
                exact={true}
                activeClassName="header__link--active"
                to="/create_product">
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                exact={true}
                activeClassName="header__link--active"
                to="/category">
                Category
              </NavLink>
            </li>
            <li>
              <NavLink
                exact={true}
                activeClassName="header__link--active"
                to="/history">
                History
              </NavLink>
            </li>
            <li>
              <Link to="/" onClick={logoutUser}>
                Logout
              </Link>
            </li>
          </>
        )}
      </>
    );
  };

  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    <header>
      <div className="menu" onClick={() => setMenu(!menu)} id="top">
        <img src={Menu} alt="" width="30" />
      </div>
      <div className="logo">
        <h1>
          <Link to="/">{isAdmin ? "Admin" : "Sushi_Honey"}</Link>
        </h1>
      </div>
      <ul style={styleMenu}>
        {renderTabs()}
        <li onClick={() => setMenu(!menu)}>
          <img src={Close} alt="" width="30" className="menu" />
        </li>
      </ul>
      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
}
