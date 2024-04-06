import React from 'react';
import Form from './Form';
const Login = ({ handleOpen }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-window" style={{ zIndex: '9999' }}>
        <Form handleOpen={handleOpen} />
      </div>
    </div>
  );
};

export default Login;
