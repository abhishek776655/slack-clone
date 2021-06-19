import React from "react";
import { Route, Redirect } from "react-router-dom";
import decode from "jwt-decode";

const isAuth = () => {
  const token = localStorage.getItem("token");
  try {
    decode(token);
  } catch (e) {
    return false;
  }
  return true;
};
function ProtectedRoute(props) {
  let auth = isAuth();
  console.log(auth);
  return auth ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
}

export default ProtectedRoute;
