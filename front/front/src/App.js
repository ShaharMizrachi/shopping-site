import React, { useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./components/HomePage";
import Admin from "./components/Admin";
import Stats from "./components/stats/Stats";
import LogIn from "./components/LogIn";
import { Provider } from "react-redux";
import Store from "./redux/store/store.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div style={{ padding: 0 }}>
          <SearchBar />
          {/* <LogIn /> */}
        </div>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route path="/admin" component={Admin} />
          <Route path="/stats" component={Stats} />
          <Redirect to="/home" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
