import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GlobalState from "../../../GlobalState";

function Login() {
  const state = useContext(GlobalState);
  // const [isAdmin, setIsAdmin] = state.authAPI.isAdmin;
  const [, setToken] = state.authAPI.token;
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, refreshToken } = (
        await axios.post("http://localhost:8888/auth/login", { ...user })
      ).data;

      localStorage.setItem("refreshToken", refreshToken);
      setToken(token)
      // localStorage.setItem("token", token);

      window.location.href = "/";
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={loginSubmit}>
        <h2>Login page</h2>
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email!"
          value={user.email}
          onChange={onChangeInput}
        />

        <input
          type="password"
          name="password"
          required
          autoComplete="on"
          placeholder="Enter your password!"
          value={user.password}
          onChange={onChangeInput}
        />

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
