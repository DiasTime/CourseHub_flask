import React from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../redux/slices/userSlice';

const Profile = () => {
  const { name, email } = useSelector(userSelector);

  return (
    <div className="container">
      <h1>{name}</h1>
      <h1>{email}</h1>
    </div>
  );
};

export default Profile;
