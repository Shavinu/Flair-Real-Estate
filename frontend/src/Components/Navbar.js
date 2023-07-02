import { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { getUserDetailById } from '../Services/UserService';
import * as AuthServices from '../Services/AuthService';
import './Navbar.css';
import { views } from "../paths"

const Navbar = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [name, setName] = useState();

  const onLogout = () => {
    AuthServices.logout();
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
                <div className='dropdown'>
                  <button className='nav-link btn'>About Us</button>
                  <div className='dropdown-options'>
                    <Link to='/About'>
                      <a>About</a>
                    </Link>
                    <Link to='/ContactForm'>
                      <a>Contact</a>
                    </Link>
                    <Link to='/AboutContent'>
                      <a>edit</a>
                    </Link>
                  </div>
                </div>
                <li className='nav-item'>

                </li>
              </ul>
            </div>
            <ul className='nav navbar-nav float-right'>
              <li className='dropdown dropdown-user nav-item'>
                <a
                  className='dropdown-toggle nav-link dropdown-user-link'
                  href='#'
                  data-toggle='dropdown'>
                  <div className='user-nav d-sm-flex d-none'>
                    <span className='user-name text-bold-600'>
                      {name || user?.email}
                    </span>
                    <span className='user-status'>Available</span>
                  </div>
                  <span>
                    <img
                      className='round'
                      src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/default/avatar.jpg`}
                      alt='avatar'
                      height='40'
                      width='40'
                    />
                  </span>
                </a>
                <div className='dropdown-menu dropdown-menu-right'>
                  <a
                    className='dropdown-item'
                    href={`/profile/${user?._id}`}>
                    <i className='feather icon-user'></i> Profile
                  </a>
                  <a
                    className='dropdown-item'
                    href='#'>
                    <i className='feather icon-mail'></i> My Inbox
                  </a>
                  <a
                    className='dropdown-item'
                    href='#'>
                    <i className='feather icon-check-square'></i> Task
                  </a>
                  <a
                    className='dropdown-item'
                    href='#'>
                    <i className='feather icon-message-square'></i> Chats
                  </a>
                  <div className='dropdown-divider'></div>
                  <Link
                    className='dropdown-item'
                    to='#'
                    onClick={onLogout}>
                    <i className='feather icon-power'></i> Logout
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </>
};

export default Navbar;
