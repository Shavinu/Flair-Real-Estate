import { Outlet } from "react-router-dom"
import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"

const Admin = () => {
  return <div id="body" className="vertical-layout vertical-menu-modern 2-column navbar-floating footer-static menu-expanded" data-menu="vertical-menu-modern">
    {/* <!-- fixed-top--> */}
    <Navbar />

    {/* <!-- BEGIN Navigation--> */}
    <Sidebar homeUrl="/" />
    {/* <!-- END Navigation--> */}

    {/* <!-- BEGIN Content--> */}
    <div className="app-content content">
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
    {/* <!-- END Content--> */}

    {/* <!-- START FOOTER LIGHT--> */}
    <footer className="footer footer-static footer-light">
    </footer>
    {/* <!-- END FOOTER LIGHT--> */}

  </div>
}

export default Admin
