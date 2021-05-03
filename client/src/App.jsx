import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./components/Chat/Chat";
import "./App.scss";
import Userfront from "@userfront/react";

function App() {
  Userfront.init("8nwpw7bw");

  const LoginForm = Userfront.build({
    toolId: "rmoodb",
  });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Redirect exact path="/" to="/login"></Redirect>
          <Route exact path="/login" component={LoginForm} />

          <ProtectedRoute exact path="/dashboard" component={Chat} />
          <ProtectedRoute path="/chat/:username" component={Chat} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
