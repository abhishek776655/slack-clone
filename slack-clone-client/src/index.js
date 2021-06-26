import "./wdyr";
import React, { createContext } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import App from "./App";
import "./styles/app.css";
import { getMainDefinition } from "@apollo/client/utilities";
import "semantic-ui-css/semantic.min.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";

// Set the configuration for your app
// TODO: Replace with your app's config object
const FireBaseContext = createContext();
var firebaseConfig = {
  apiKey: "AIzaSyBGqoh1VVUjT16PPZXKOsadITHPS-PzpdU",
  authDomain: "slack-cdn-4dcba.firebaseapp.com",
  projectId: "slack-cdn-4dcba",
  storageBucket: "slack-cdn-4dcba.appspot.com",
  messagingSenderId: "554503134620",
  appId: "1:554503134620:web:1912756dc69a74b93ffc59",
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

const httpLink = new createUploadLink({
  uri: "http://localhost:4000/",
  headers: {
    authorization: localStorage.getItem("token"),
    "client-name": "WidgetX Ecom [web]",
    "client-version": "1.0.0",
  },
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/subscriptions",
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("token"),
    },
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  connectToDevTools: true,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <FireBaseContext.Provider value={storage}>
      <App />
    </FireBaseContext.Provider>
  </ApolloProvider>,

  document.getElementById("root")
);

export { FireBaseContext };
