import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { db } from '../../firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { setUser } from '../../redux/slices/userSlice';
import { MdAccountCircle } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const Form = ({ handleOpen }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Получаем пользователей из Firestore
    const collectionUsers = collection(db, 'users');
    const getUsers = onSnapshot(collectionUsers, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setUsers(items);
    });

    return () => {
      // Очистка подписки при размонтировании компонента
      getUsers();
    };
  }, []);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь в локальном хранилище при загрузке компонента
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Проверка электронной почты
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Проверка пароля
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else {
      const findUser = users.find((item) => item.email === email);
      setCurrentUser(findUser);
      if (!findUser || findUser.password !== password) {
        errors.password = 'Incorrect password';
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const findUser = users.find((item) => item.email === email);
      dispatch(setUser({ isAuth: true, email, password, name: findUser.displayName }));
      // Сохраняем пользователя в локальное хранилище
      localStorage.setItem('currentUser', JSON.stringify(findUser));
    }
    handleOpen();
  };

  return (
    <form onSubmit={handleLogin}>
      <div className='form-group'>
      {/* <MdAccountCircle /> */}
        <label htmlFor="email" className='form-title'>Welcome!</label>
        <input
        
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='form-group input'
          placeholder='Email:'
          
        />
        
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div className='form-group'>
        {/* <label htmlFor="password" className='form-title'>Password:</label> */}
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='form-group input'
          required
          placeholder='Password'
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <div className='formbuttons'>
      <button type="submit" className='submit-button'>Login</button>
      <button type='close' onClick={handleOpen} className='close-button'>Close</button>
      </div>
    </form>
  );
};

export default Form;
