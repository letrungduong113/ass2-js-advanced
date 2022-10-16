import { Fragment } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Admin from "./views/admin";
import ClientFoods from "./views/client/foods";
import AddFood from "./views/admin/foods/add-food";
import UpdateFood from "./views/admin/foods/update-food";
import Cart from "./views/client/cart";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/add-food" element={<AddFood />} />
          <Route path="/admin/update-food/:id" element={<UpdateFood />} />
          <Route path="/" element={<ClientFoods />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </Fragment>
  );
}

export default App;
