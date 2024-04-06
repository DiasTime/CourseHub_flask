import { useParams, Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { courseSelector, setCourses } from '../redux/slices/courseSlice';
import { db } from '../firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CourseDecription = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courses } = useSelector(courseSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const collectionRef = collection(db, 'courses');
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => doc.data());
      dispatch(setCourses(items));

      // Set the first chapter as the selected chapter
      //   const firstCourse = items[0];
      //   if (firstCourse && firstCourse.chapters.length > 0) {
      //     setSelectChapter(firstCourse.chapters[0].title);
      //   }
    });

    return unsubscribe;
  }, [dispatch]);

  const currentCourse = courses.find((item) => item.courseId == courseId);
  console.log(currentCourse);

  return (
    <section className="coursedescsection">
      <div style={{ backgroundColor: '#3F3F8F', color: '#FFF', padding: '70px 0 40px 0' }}>
        <div className="container">
          <h1 style={{ fontWeight: '500', fontSize: '40px', paddingBottom: '5px' }}>
            {currentCourse?.course_name}
          </h1>
          <div className="aboutCourse">
            {currentCourse?.course_descriptions.map((item) => (
              <p style={{ maxWidth: '600px', fontSize: '18px', padding: '5px 0' }} key={item}>
                {item}
              </p>
            ))}
          </div>
          <button onClick={() => navigate(`/courses/${courseId}`)}>Перейти курс</button>
        </div>
      </div>
    </section>
  );
};

export default CourseDecription;

// <div className="course_descriptions">

// </div>
