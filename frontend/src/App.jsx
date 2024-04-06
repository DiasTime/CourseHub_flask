import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Course from './pages/Course';
import NotFound from './pages/NotFound';
import CourseDecription from './pages/CourseDecription';
import MainLayout from './layouts/MainLayout';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import CourseLayout from './layouts/CourseLayout';

import Register from './pages/Register';
import Docs from './pages/Docs';
import Profile from './pages/Profile';


function App() {

  
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contacts" element={<ContactUs />} />
          <Route path="avalible-courses" element={<Courses />} />
          <Route path="register" element={<Register />} />
          <Route path="documentos" element={<Docs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="courses/" element={<CourseLayout />}>
          <Route path="learn/:courseId" element={<CourseDecription />} />
          <Route path=":courseId" element={<Course />} />
        </Route>
      </Routes>
    </>
  );

  
}

export default App;
