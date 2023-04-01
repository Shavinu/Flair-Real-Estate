import { Outlet } from "react-router-dom"

const Auth = () => {
  return <>
    <div id="#body" class="vertical-layout vertical-menu-modern 1-column  navbar-floating footer-static bg-full-screen-image blank-page blank-page" data-open="click" data-menu="vertical-menu-modern" data-col="1-column">
      <div class="app-content content">
        <div class="content-overlay"></div>
        <div class="header-navbar-shadow"></div>
        <div class="content-wrapper">
          <div class="content-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  </>
}

export default Auth
