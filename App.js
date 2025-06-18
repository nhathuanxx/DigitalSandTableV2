import React, { Component } from "react";
import { Provider } from "react-redux";
import configStore from "./app/storage";
// import ApplicationDriver from './app/application';
import Root from "./app/root";
import setupInterceptors from "@app/libs/setupInterceptors";

const store = configStore();
setupInterceptors(store);
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}