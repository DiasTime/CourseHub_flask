import React from 'react';
import { IoMdHeartEmpty } from 'react-icons/io';
import { Link } from 'react-router-dom';

const CourseBox = ({ ...rest }) => {

  const { title, course_name, author, date, course_slogan, courseId } = rest;

  const bgImages = [
    'https://i.postimg.cc/3JPpfQpY/Texture-01-safeimagekit.png',
    'https://i.postimg.cc/tJJPwX2C/Texture-02-safeimagekit.png',
    'https://i.postimg.cc/YSB60Bqb/Texture-03-safeimagekit.png',
    'https://i.postimg.cc/mgH3TgRP/Texture-04-safeimagekit.png',
    'https://i.postimg.cc/yxG9zwbh/Texture-05-safeimagekit.png',
    'https://i.postimg.cc/VsZXMCkS/Texture-06-safeimagekit.png',
    'https://i.postimg.cc/ZRT6PPNN/Texture-07-safeimagekit.png',
    'https://i.postimg.cc/j5ZPMW6F/Texture-08-safeimagekit.png',
    'https://i.postimg.cc/1z0pN78P/Texture-09-safeimagekit.png',
    'https://i.postimg.cc/hP3MSYd5/Texture-10-safeimagekit.png',

  ];

  // Randomly select a background image

  const selectedBg = bgImages[Math.floor(Math.random() * bgImages.length)];

  return (

    <Link to={`/courses/learn/${courseId}`}>
      <div className="courseBox">

        <div
          className="topContent"
          style={{ backgroundImage: `url(${selectedBg})`, backgroundSize: 'cover' }}>
          <div className="fav">
            <IoMdHeartEmpty />
          </div>
          <h3>{title}</h3>
        </div>
        <div className="bottomContent">
          <p className="courseName">{course_name}</p>
          <p className="courseDesc">{course_slogan}</p>
          <div className="courseDetails">
            <p>
              {author} / {date}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseBox;
