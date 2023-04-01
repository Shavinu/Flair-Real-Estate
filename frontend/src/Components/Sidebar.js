import { Link, useLocation } from "react-router-dom"
import { views } from "../paths"
import React, { useEffect, useState } from "react"
import utils from "../Utils"

const ChildrenMenu = ({ route, currentPath }) => {
  const isActive = (route) => {
    return route.action === currentPath
  }

  return <>
    <li key={utils.newGuid()} className={`nav-item has-sub ${isActive(route) ? 'sidebar-group-active open' : ''}`} >
      <Link to="#">
        <i className={route.icon}></i><span className="menu-title">{route.name}</span>
      </Link>
      <ul className="menu-content" key={utils.newGuid()}>
        {
          route.children.map((r) => {
            if (r.isRoute) {
              return <React.Fragment key={utils.newGuid()}></React.Fragment>
            }

            return <li key={utils.newGuid()} className={isActive(r) ? 'active' : ''}>
              <Link to={r.action}>
                <span className="menu-item">
                  {r.name}
                </span>
              </Link>
            </li>
          })
        }
      </ul>
    </li >
  </>
}

const Sidebar = (props) => {
  const {
    homeUrl = '/',
  } = props
  const location = useLocation();
  const currentPath = utils.url.currentPath(location);

  const isActive = (route) => {
    return route.action === currentPath
  }

  return <>

    {/* <!-- BEGIN: Main Menu--> */}
    <div className="main-menu menu-fixed menu-light menu-accordion menu-shadow" data-scroll-to-active="true">
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item mr-auto">
            <Link className="navbar-brand" to={homeUrl}>
              <img src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/logo/logo.png`} alt="icon" width={45} />
              <h2 className="brand-text mb-0">Vuexy</h2>
            </Link></li>
          <li className="nav-item nav-toggle">
            <Link className="nav-link modern-nav-toggle pr-0" data-toggle="collapse">
              <i className="feather icon-x d-block d-xl-none font-medium-4 primary toggle-icon"></i><i className="toggle-icon feather icon-disc font-medium-4 d-none d-xl-block primary" data-ticon="icon-disc"></i></Link>
          </li>
        </ul>
      </div>
      <div className="shadow-bottom"></div>
      <div className="main-menu-content">
        <ul className="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
          {views.map(route => {
            if (route.isRoute) {
              return <React.Fragment key={utils.newGuid()}></React.Fragment>;
            }

            if (route.children?.length > 0) {
              return <ChildrenMenu route={route} currentPath={currentPath} key={utils.newGuid()} />
            }

            return <li className={`nav-item ${isActive(route) ? 'active' : ''}`} key={utils.newGuid()} >
              <Link to={route.action}>
                <i className={route.icon}></i><span className="menu-title">{route.name}</span>
              </Link>
            </li>
          })}
        </ul>
      </div>
    </div>
    {/* <!-- END: Main Menu--> */}
  </>
}

export default Sidebar
