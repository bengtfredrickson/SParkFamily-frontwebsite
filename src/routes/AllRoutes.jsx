import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login';
import { GuardedRoute, GuardedLogin } from '../services/authentication/authentication/GuardedRoute';
import Curriculum from '../components/curriculum';
import Module from '../components/modules';
import ModuleFiles from '../components/modules_files';
import AllModules from '../components/allModules';
import AllUnits from '../components/allUnits';
import AllSubUnits from '../components/allSubUnits';
import CurriculumUnits from '../components/curriculumUnits';
import CurriculumSubUnits from '../components/curriculumSubUnits';
import CurriculumoOptions from '../components/curriculumOptions';
import CurriculumoSubOptions from '../components/curriculumSubOptions';
import CurriculumoLessonPlans from '../components/curriculumLessons';


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
        <Route exact path='/module' element={<GuardedRoute />}>
          <Route exact path='/module' caseSensitive={false} element={<Module />} />
        </Route>
        <Route exact path='/module_files' element={<GuardedRoute />}>
          <Route exact path='/module_files' caseSensitive={false} element={<ModuleFiles />} />
        </Route>
        <Route exact path='/all_modules' element={<GuardedRoute />}>
          <Route exact path='/all_modules' caseSensitive={false} element={<AllModules />} />
        </Route>
        <Route exact path='/all_sub_units' element={<GuardedRoute />}>
          <Route exact path='/all_sub_units' caseSensitive={false} element={<AllSubUnits />} />
        </Route>
        <Route exact path='/all_units' element={<GuardedRoute />}>
          <Route exact path='/all_units' caseSensitive={false} element={<AllUnits />} />
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




        <Route path='*' element={<GuardedRoute />}>
          <Route path='*' caseSensitive={false} element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}




