import react, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Username from "./pages/Username";
import Chat from "./components/Chat/Chat";
import "./App.scss";
import socket from "./socket";

function App() {
  //any event received by client is printed in console
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/username" component={Username} />
          <ProtectedRoute exact path="/" component={Chat} />
          <ProtectedRoute path="/chat/:chatId" component={Chat} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
