import React from 'react';
import laptop from '../assets/img/laptop.png';

const Description = () => {
  return (
    <>
      <div className="wrapper">
        <div className="wrapperTwoCol">
          <div className="leftWrapper">
            <h2>Доступное обучение которое всегда под рукой!</h2>
            <p>
            Добро пожаловать в CourseHub - ваш источник знаний и навыков для успешного развития! 
            Мы предлагаем широкий спектр курсов, охватывающих самые востребованные области современного мира.
            </p>
            <button className="startButton">Начнем!</button>
          </div>
          <img src={laptop} />
        </div>
      </div>
    </>
  );
};

export default Description;
