import { Outlet } from "react-router-dom";
import './style.css';
import logo from '../../assets/imgs/logo.png'
function Layout() {
  return (
    <div className="wrp">
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <img src={logo}/>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  )
}

export default Layout