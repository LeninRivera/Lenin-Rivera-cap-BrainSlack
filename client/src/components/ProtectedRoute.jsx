import React from "react";
import { Route, Redirect } from "react-router-dom";
import Userfront from "@userfront/react";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !Userfront.accessToken() ? (
          <Redirect to="/login" />
        ) : (
          <Component {...routeProps} />
        )
      }
    />
  );
};

export default ProtectedRoute;
