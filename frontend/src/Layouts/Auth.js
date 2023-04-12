import { Outlet } from "react-router-dom"

const Auth = () => {
  return <>
    <div id="#body" className="vertical-layout vertical-menu-modern 1-column  navbar-floating footer-static bg-full-screen-image blank-page blank-page" data-open="click" data-menu="vertical-menu-modern" data-col="1-column">
      <div className="app-content content">
        <div className="content-overlay"></div>
        <div className="header-navbar-shadow"></div>
        <div className="content-wrapper">
          <div className="content-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  </>
}

export default Auth
