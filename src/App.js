import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./containers/Login/Login";
import Layout from "./containers/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/admin" component={Layout} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
