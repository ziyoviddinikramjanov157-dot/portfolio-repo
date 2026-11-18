import { MotionConfig } from 'motion/react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Courses from './pages/Courses.jsx'
import Faq from './pages/Faq.jsx'
import FreeContent from './pages/FreeContent.jsx'
import Home from './pages/Home.jsx'
import Ielts from './pages/Ielts.jsx'
import Marathon from './pages/Marathon.jsx'
import Method from './pages/Method.jsx'
import NotFound from './pages/NotFound.jsx'
import Results from './pages/Results.jsx'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="haqimda" element={<About />} />
          <Route path="metodika" element={<Method />} />
          <Route path="kurslar" element={<Courses />} />
          <Route path="ielts" element={<Ielts />} />
          <Route path="marafon" element={<Marathon />} />
          <Route path="bepul-darslar" element={<FreeContent />} />
          <Route path="natijalar" element={<Results />} />
          <Route path="savollar" element={<Faq />} />
          <Route path="aloqa" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
