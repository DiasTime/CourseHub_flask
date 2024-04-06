import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { nanoid } from '@reduxjs/toolkit';

const Reg = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Проверяем, существует ли уже пользователь с такой же электронной почтой
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('User with this email already exists');
      }

      // Регистрируем нового пользователя в Firebase Authentication
      // Ваш код регистрации пользователей здесь

      // Добавляем данные пользователя в коллекцию Firestore
      await addDoc(usersCollection, {
        email,
        displayName,
        password,
        id: nanoid(12),
        acc_type:"student"
      });

      // Очищаем поля ввода после успешной регистрации
      setEmail('');
      setPassword('');
      setDisplayName('');

      // Устанавливаем сообщение об успешной регистрации
      setSuccessMessage('Registration successful');

      // После успешной регистрации, вы можете выполнить дополнительные действия, например, перенаправление пользователя на другую страницу
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <div>


          <label htmlFor="displayName">Введите ваше ФИО:</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Введите пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Вперед!</button>
        {successMessage ? null : errorMessage && <p>{errorMessage}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default Reg;