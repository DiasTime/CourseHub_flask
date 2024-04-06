import React, { useEffect, useState } from 'react';
import CourseBox from '../components/CourseBox';
import { db } from '../firebase';
import { onSnapshot, collection } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';
import { courseSelector, setCourses } from '../redux/slices/courseSlice';
import { userSelector } from '../redux/slices/userSlice';

function Courses() {
  const { isAuth } = useSelector(userSelector);
  console.log(isAuth);
  const [search, setSearch] = useState('');
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();
  const { courses } = useSelector(courseSelector);


  useEffect(() => {
    const collectionRef = collection(db, 'courses');
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      dispatch(setCourses(items));
    });

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
      unsubscribe();
      getUsers();
    };
  }, [dispatch]);

  // console.log(users);

  // console.log(courses);

  const handleSearch = (e) => setSearch(e.target.value);
  const filtered = courses?.filter((item) => item.title.toLowerCase().includes(search));
  if (!isAuth) {
    return (
      <div className="wrapper">
        <h1>Cначала нужно войти</h1>
      </div>
    );
  } else
    return (
      <div className="purpleBG">
        <div className="wrapper courses">
          <div className="inputField">
            <input
              type="text"
              placeholder="Search course..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="courseList">
            {courses && filtered.map((item) => <CourseBox key={item.title} {...item} />)}
          </div>
        </div>
      </div>
    );
}

export default Courses;
