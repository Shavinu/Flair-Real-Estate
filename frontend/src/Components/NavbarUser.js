import { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { getUserDetailById } from '../Services/UserService';
import * as AuthServices from '../Services/AuthService';
import './Navbar.css';
import { views } from "../paths"

const NavbarUser = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [name, setName] = useState();

  const onLogin = () => {
    AuthServices.login();
    setTimeout(() => {
      navigate('/auth/login');
    }, 100);
  };

  useEffect(() => {
    let user = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      setUser(user.payload);
    }
    try {
      getUserDetailById(user.payload?._id).then((response) => {
        setName(response.firstName + ' ' + response.lastName);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return <>
    <nav className="header-navbar navbar-expand-lg navbar navbar-with-menu fixed-top navbar-light navbar-shadow">
      <div className="navbar-wrapper">
        <div className="navbar-container content">
          <div className="navbar-collapse" id="navbar-mobile">
            <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
              <ul className="nav navbar-nav">
                <li className="nav-item mobile-menu d-xl-none mr-auto"><a className="nav-link nav-menu-main menu-toggle hidden-xs" href="#"><i className="ficon feather icon-menu"></i></a></li>
              </ul>
              <ul className="nav navbar-nav bookmark-icons">
                <li className="nav-item d-none d-lg-block">
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link btn" to={'/'}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn" to='/listings' >Search</Link>
                </li>
                <div className="dropdown">
                  <Link className="nav-link btn" to='/listings'>NSW Listings</Link>
                  <div className="dropdown-options">
                    <a href="#">Sydney North West</a>
                    <a href="#">Sydney South West</a>
                    <a href="#">Newcastle</a>
                    <a href="#">Central Coast</a>
                    <a href="#">Wollongong</a>
                  </div>
                </div>
                <div className='dropdown'>
                  <Link className='nav-link btn'>Resources</Link>
                  <div className='dropdown-options'>
                    <Link to='/MortgageCal'>Mortgage Calculator</Link>
                    <Link to='/BuyersArticles'>Articles</Link>
                    <Link to='/News'>Property News</Link>
                  </div>
                </div>
                <li className="nav-item">
                  <Link className="nav-link btn" to={'/About'}>About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn" to={'/ContactForm'}>Contact Us</Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='dropdown-item'
                    to='#'
                    onClick={onLogin}>
                    <i className='feather icon-power'></i> Log In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </>
};

export default NavbarUser;
