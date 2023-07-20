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

  const onLogout = () => {
    AuthServices.logout();
    setTimeout(() => {
      navigate('/');
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

        {authenticated &&  <ul className='nav-links'>
              <li className='dropdown'>
                <a
                  className='nav-links2'
                  href='#'
                  data-toggle='dropdown'>     
                  <span>
                    <img
                      className='round'
                      src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/default/avatar.jpg`}
                      alt='avatar'
                      height='25'
                      width='25'
                    />
                  </span>           
                  <span className='nav-username'>
                    {name || user?.email}
                  </span>
                </a>
                <div className='dropdown-options'>
                  <a
                    className='nav-links2'
                    href={`/profile/${user?._id}`}>
                    <i className='feather icon-user'></i> Profile
                  </a>
                  <a
                    className='nav-links2'
                    href='#'>
                    <i className='feather icon-mail'></i> My Inbox
                  </a>
                  <a
                    className='nav-links2'
                    href='#'>
                    <i className='feather icon-check-square'></i> Task
                  </a>
                  <a
                    className='nav-links2'
                    href='#'>
                    <i className='feather icon-message-square'></i> Chats
                  </a>
                  <Link className="nav-links2" to={'/AboutContent'}>
                    <i className="fa-solid fa-table-columns"></i>Edit Content</Link>
                  <Link className="nav-links2" to={'/users'}>
                    <i className="fa-solid fa-table-columns"></i>Dashboard</Link>
                  <Link
                    className='nav-links2'
                    to='#'
                    onClick={onLogout}>
                    <i className='feather icon-power'></i> Logout
                  </Link>
                </div>
              </li>
            </ul>
        }
                  
                 


        {!authenticated && <li className="button">
        <Link
            className='nav-links'
            onClick={onLogin}>
            <i className='feather icon-power'></i> Log In
          </Link>
        </li>}
      </ul>



    </nav>
  </>
};

export default NavbarUser;
