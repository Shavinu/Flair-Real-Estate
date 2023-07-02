import { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { getUserDetailById } from '../Services/UserService';
import * as AuthServices from '../Services/AuthService';
import './Navbar.css';
import { views } from "../paths"
import "./NavbarUser.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <nav className="NavbarItems">
        <h1 className="navbar-logo">Real Estate</h1>
       
          
              <ul className="nav-menu">
                <li className="button">
                  <Link className="nav-links" to={'/'}>
                  <i className='fa-solid fa-house-chimney'></i>Home</Link>
                </li>
                <li className="button">
                  <Link className="nav-links" to='/listings'>
                  <i className='feather icon-power'></i>Search</Link>
                </li>
                <div className="dropdown">
                  <Link className="nav-links" to='/listings'>
                  <i className='fa-solid fa-list'></i>NSW Listings</Link>
                  <div className="dropdown-options">
                    <a href="#">Sydney North West</a>
                    <a href="#">Sydney South West</a>
                    <a href="#">Newcastle</a>
                    <a href="#">Central Coast</a>
                    <a href="#">Wollongong</a>
                  </div>
                </div>
                <div className='dropdown'>
                  <Link className='nav-links'>
                  <i className='fa-solid fa-address-book'></i>Resources</Link>
                  <div className='dropdown-options'>
                    <Link to='/MortgageCal'>Mortgage Calculator</Link>
                    <Link to='/BuyersArticles'>Articles</Link>
                    <Link to='/News'>Property News</Link>
                  </div>
                </div>
                <li className="button">
                  <Link className="nav-links" to={'/About'}>
                  <i className='fa-solid fa-house-chimney'></i>About Us</Link>
                </li>
                <li className="button">
                  <Link className="nav-links" to={'/ContactForm'}>
                  <i className='fa-solid fa-address-book'></i>Contact Us</Link>
                </li>
                <li className='button'>
                  <Link
                    className='nav-links'
                    onClick={onLogin}>
                    <i className='feather icon-power'></i> Log In
                  </Link>
                </li>
              </ul>


   
    </nav>
  </>
};

export default NavbarUser;
