import { Fragment } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Admin from "./views/admin";
import ClientFoods from "./views/client/foods";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<ClientFoods />} />
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </Fragment>
  );
}

export default App;
