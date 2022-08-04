import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import Coach_Management from '../components/Coach_Management';
import User_Management from '../components/User_Management';
import Login from '../components/Login';
import Category_Management from '../components/Category_Management';
import Course_Management from '../components/Course_Management';
import SeeVideo from '../components/Helper/SeeVideo';
import { GuardedRoute, GuardedLogin } from '../services/authentication/authentication/GuardedRoute';
import Need_Help from '../components/Need_Help';
import Admin_Need_Help from '../components/Admin_Need_Help';
import Contact_Us from '../components/Contact_Us';


export default function AllRoutes() {

  return (
    <>
      <Routes>


        {/* Login Guard */}
        <Route exact path='/' element={<GuardedLogin />}>
          <Route exact path='/' caseSensitive={false} element={<Login />} />
        </Route>
        <Route exact path='*' element={<GuardedLogin />}>
          <Route exact path='*' caseSensitive={false} element={<Login />} />
        </Route>
        {/* Ends */}






        <Route exact path='/home' element={<GuardedRoute />}>
          <Route exact path='/home' caseSensitive={false} element={<Home />} />
        </Route>
        <Route exact path='/coach_management' element={<GuardedRoute />}>
          <Route exact path='/coach_management' caseSensitive={false} element={<Coach_Management />} />
        </Route>
        <Route exact path='/category_management' element={<GuardedRoute />}>
          <Route exact path='/category_management' caseSensitive={false} element={<Category_Management />} />
        </Route>
        <Route exact path='/user_management' element={<GuardedRoute />}>
          <Route exact path='/user_management' caseSensitive={false} element={<User_Management />} />
        </Route>
        <Route exact path='/course_management' element={<GuardedRoute />}>
          <Route exact path='/course_management' caseSensitive={false} element={<Course_Management />} />
        </Route>
        <Route exact path='/seevideo' element={<GuardedRoute />}>
          <Route exact path='/seevideo' caseSensitive={false} element={<SeeVideo />} />
        </Route>
        <Route exact path='/need_help' element={<GuardedRoute />}>
          <Route exact path='/need_help' caseSensitive={false} element={<Need_Help />} />
        </Route>
        <Route exact path='/admin_need_help' element={<GuardedRoute />}>
          <Route exact path='/admin_need_help' caseSensitive={false} element={<Admin_Need_Help />} />
        </Route>
        <Route exact path='/contact_us' element={<GuardedRoute />}>
          <Route exact path='/contact_us' caseSensitive={false} element={<Contact_Us />} />
        </Route>



        <Route  path='*' element={<GuardedRoute />}>
          <Route  path='*' caseSensitive={false} element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}




