import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login';
import { GuardedRoute, GuardedLogin } from '../services/authentication/authentication/GuardedRoute';
import Curriculum from '../components/curriculum';
import CurriculumUnits from '../components/curriculumUnits';
import CurriculumSubUnits from '../components/curriculumSubUnits';
import CurriculumoOptions from '../components/curriculumOptions';
import CurriculumoSubOptions from '../components/curriculumSubOptions';
import CurriculumoLessonPlans from '../components/curriculumLessons';
import CurriculumModules from '../components/curriculumModule';


export default function AllRoutes() {

  return (
    <>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />}></Route>
        {/* Login Guard */}
        <Route exact path='/login' element={<GuardedLogin />}>
          <Route exact path='/login' caseSensitive={false} element={<Login />} />
        </Route>
        <Route exact path='*' element={<GuardedLogin />}>
          <Route exact path='*' caseSensitive={false} element={<Login />} />
        </Route>
        {/* Ends */}






        <Route exact path='/home' element={<GuardedRoute />}>
          <Route exact path='/home' caseSensitive={false} element={<Home />} />
        </Route>

        <Route exact path='/curriculum' element={<GuardedRoute />}>
          <Route exact path='/curriculum' caseSensitive={false} element={<Curriculum />} />
        </Route>
        <Route exact path='/curriculum_units' element={<GuardedRoute />}>
          <Route exact path='/curriculum_units' caseSensitive={false} element={<CurriculumUnits />} />
        </Route>
        <Route exact path='/curriculum_sub_units' element={<GuardedRoute />}>
          <Route exact path='/curriculum_sub_units' caseSensitive={false} element={<CurriculumSubUnits />} />
        </Route>
        <Route exact path='/curriculum_options' element={<GuardedRoute />}>
          <Route exact path='/curriculum_options' caseSensitive={false} element={<CurriculumoOptions />} />
        </Route>
        <Route exact path='/curriculum_suboptions' element={<GuardedRoute />}>
          <Route exact path='/curriculum_suboptions' caseSensitive={false} element={<CurriculumoSubOptions />} />
        </Route>
        <Route exact path='/curriculum_lessons' element={<GuardedRoute />}>
          <Route exact path='/curriculum_lessons' caseSensitive={false} element={<CurriculumoLessonPlans />} />
        </Route>
        <Route exact path='/curriculum_module' element={<GuardedRoute />}>
          <Route exact path='/curriculum_module' caseSensitive={false} element={<CurriculumModules />} />
        </Route>




        <Route path='*' element={<GuardedRoute />}>
          <Route path='*' caseSensitive={false} element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}




