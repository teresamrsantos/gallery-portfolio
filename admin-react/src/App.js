import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home.js";
import IndexListVisitors from "./components/ListVisitors/IndexListVisitors.js";
import messages from "./translations";
import { useSelector } from "react-redux";
import NavBar from "./components/NavBar/NavBar";
import { IntlProvider } from "react-intl";
import IndexManageUsers from "./components/ManageUsers/IndexManageUsers.js";

const App = () => {
  const locale = useSelector((state) => state.language.language);
  console.log(locale, "LANGUAGE");
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>

      <NavBar />
      <Home />
      <Routes>

        <Route path="/listVisitors" element={<IndexListVisitors />} />
        <Route path="/manageUsers" element={<IndexManageUsers />} />
      </Routes>
    </IntlProvider>
  );
};
export default App;
      //<Route path="/" element={ } />