import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/app.css";
import "semantic-ui-css/semantic.min.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  connectToDevTools: true,
  cache: new InMemoryCache(),

  headers: {
    authorization: localStorage.getItem("token"),
    "x-refresh-token": localStorage.getItem("refreshToken"),
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
