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




        <Route path='*' element={<GuardedRoute />}>
          <Route path='*' caseSensitive={false} element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}




