import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import './styles/scrollbar.css';
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

/* Redux store */
import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </Provider>
);
