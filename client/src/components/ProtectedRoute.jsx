import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const username = sessionStorage.getItem("username");
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !username ? <Redirect to="/username" /> : <Component {...routeProps} />
      }
    />
  );
};

export default ProtectedRoute;
