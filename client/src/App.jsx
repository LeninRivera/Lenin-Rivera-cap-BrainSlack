import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Username from "./pages/Username";
import Chat from "./components/Chat/Chat";
import "./App.scss";
import socket from "./socket";
import Userfront from "@userfront/react";

function App() {
  Userfront.init("8nwpw7bw");

  const SignupForm = Userfront.build({
    toolId: "oaddol",
  });

  const LoginForm = Userfront.build({
    toolId: "rmoodb",
  });

  //any event received by client is printed in console
  //todo remove when finished
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Redirect exact path="/" to="/login"></Redirect>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/signup" component={SignupForm} />
          <Route exact path="/username" component={Username} />
          <ProtectedRoute exact path="/dashboard" component={Chat} />
          <ProtectedRoute path="/chat/:username/:chatId" component={Chat} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
