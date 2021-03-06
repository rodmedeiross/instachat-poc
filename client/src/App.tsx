import React from "react";
import MainView from "./components/main-view";
import AuthView from "./components/auth";

const App: React.FC = () => {
  const isAuth = sessionStorage.getItem("token");

  return Boolean(isAuth) ? <MainView /> : <AuthView />;
};

export default App;
