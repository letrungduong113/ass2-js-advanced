import { Fragment } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import AdminFoods from "./views/admin";
import ClientFoods from "./views/client/foods";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="admin/foods" element={<AdminFoods />} />
          <Route path="/" element={<ClientFoods />} />
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </Fragment>
  );
}

export default App;
