import { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { getUserDetailById } from '../Services/UserService';
import * as AuthServices from '../Services/AuthService';
import { views } from "../paths"
import "./NavbarUser.css";


const NavbarUser = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [authenticated, setAuthenticated] = useState(false);

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
      setAuthenticated(true);
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
      <Link to="/" className='text-decoration-none'>
        <h1 className="navbar-logo">Real Estate</h1>
      </Link>
      <ul className="nav-menu">
        <li className="button">
          <Link className="nav-links" to={'/'}>
            <i className="fa-solid fa-house-user"></i>Home</Link>
        </li>
        {authenticated && <li className="button">
          <Link className="nav-links" to={'/users'}>
            <i className="fa-solid fa-table-columns"></i>Dashboard</Link>
        </li>}
        <div className="dropdown">
          <Link className="nav-links" to='/ListingPage'>
            <i className='fa-solid fa-list'></i>NSW Listings</Link>
          <div className="dropdown-options">
            <a className="nav-links2" href="#">Sydney North West</a>
            <a className="nav-links2" href="#">Sydney South West</a>
            <a className="nav-links2" href="#">Newcastle</a>
            <a className="nav-links2" href="#">Central Coast</a>
            <a className="nav-links2" href="#">Wollongong</a>
          </div>
        </div>
        <div className='dropdown'>
          <Link className='nav-links' to='/ResourcesPage'>
            <i className='fa-solid fa-address-book'></i>Resources</Link>
          <div className='dropdown-options'>
            <Link className="nav-links2" to='/MortCal'>Mortgage Calculator</Link>
            <Link className="nav-links2" to='/BuyProcess'>Articles</Link>
            <Link className="nav-links2" to='/PropNews'>Property News</Link>
          </div>
        </div>
        <li className="button">
          <Link className="nav-links" to={'/AboutUs'}>
            <i className='fa-solid fa-address-card'></i>About Us</Link>
        </li>
        <li className="button">
          <Link className="nav-links" to={'/Contact'}>
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
