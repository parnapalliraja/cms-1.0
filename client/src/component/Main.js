import React,{useContext} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { DataContext } from '../GlobalContext'
import ProtectedRoute from '../middleware/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import history from '../middleware/History'

import About from './Default/About'
import Contact from './Default/Contact'
import Home from './Default/Home'
import Menu from './Header/Menu'
import Register from './Auth/Register'
import Login from './Auth/Login'
import Pnf from './util/Pnf'
import AdminDashboard from './Admin/AdminDashboard'
import AdminProfile from './Admin/AdminProfile'
import StudentDashboard from './Student/StudentDashboard'
import StudentProfile from './Student/StudentProfile'
import TrainerDashboard from './Trainer/TrainerDashboard'
import TrainerProfile from './Trainer/TrainerProfile'

function Main() {

  const context = useContext(DataContext)
  const [isLogged] = context.data.authApi.isLogged
  const [isStudent] = context.data.authApi.isStudent
  const [isTrainer] = context.data.authApi.isTrainer
  const [isAdmin] = context.data.authApi.isAdmin


  return (
    <Router history={history}>
        <Menu/>
        <ToastContainer autoClose={5000} position={'top-right'} />
        <Routes>

            <Route path={`/`} element={
              isLogged ? 
              (<>
                  { isAdmin ? <Navigate to={`/admin/dashboard`} /> : null }
                  { isStudent ? <Navigate to={`/student/dashboard`} /> : null }
                  { isTrainer ? <Navigate to={`/trainer/dashboard`} /> : null }
              </>) : null
            } />

            <Route path={`/about`} element={ isLogged ? <Navigate to={`/*`}/> : <About/>}/>
            <Route path={`/contact`} element={ isLogged ? <Navigate to={`/*`}/> : <Contact/>} />
            <Route path={`/register`} element={ isLogged ? <Navigate to={`/*`}/> :<Register/>} />
            <Route path={`/login`} element={ isLogged ? <Navigate to={`/*`}/> : <Login/>} />

            {
              isLogged && isAdmin ? (
                <Route element={<ProtectedRoute/>}>
                    <Route path={`/admin/dashboard`} element={<AdminDashboard/>} />
                    <Route path={`/admin/profile`} element={<AdminProfile/>} />
                </Route>
              ) : null
            }
            {
              isLogged && isStudent ? (
                <Route element={<ProtectedRoute/>}>
                    <Route path={`/student/dashboard`} element={<StudentDashboard/>} />
                    <Route path={`/student/profile`} element={<StudentProfile/>} />
                </Route>
              ) : null
            }
            {
              isLogged && isTrainer ? (
                <Route element={<ProtectedRoute/>}>
                    <Route path={`/trainer/dashboard`} element={<TrainerDashboard/>} />
                    <Route path={`/trainer/profile`} element={<TrainerProfile/>} />
                </Route>
              ) : null
            }
            <Route path={`/*`} element={<Pnf/>} />
        </Routes>
    </Router>
  )
}

export default Main