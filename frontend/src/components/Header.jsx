import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import Login from './ModalWindow/Login';
import { userSelector } from '../redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserTie } from "react-icons/fa";
const Header = () => {
  const { isAuth, email } = useSelector(userSelector);
  console.log(email);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const setActive = ({ isActive }) => (isActive ? 'navlink__active' : '');

  return (
    <header>
      <nav>
        <NavLink to="/" className="logo">
          <h1>CourseHub</h1>
        </NavLink>
        <ul>
          <li>

            <NavLink to="/" className={`navlink ${setActive}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/aboutus" className={`navlink ${setActive}`}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/avalible-courses" className={`navlink ${setActive}`}>
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacts" className={`navlink ${setActive}`}>
              Contact Us
            </NavLink>

          </li>
        </ul>

        <div className="auth">

              </div>

        {!isAuth ? (
          <div className="auth">
            <button className="login" onClick={handleOpen}>
              <HiOutlineGlobeAlt className="login_icon" />
              Login
            </button>
            <Link to="/register">
              <button className="signup">Sign up</button>
            </Link>
          </div>
        ) : (



          <Link to="/profile">{email}</Link>

        )}
      {isAuth && <FaUserTie />}

      </nav>
      {open && <Login handleOpen={handleClose} />}
    </header>
  );
};

export default Header;
