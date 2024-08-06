import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/NavBar.jsx';
import Proiecte from './pages/Proiecte.jsx'
import ProjectsPage from './pages/Projects.jsx'
import { useAuth } from "./contexts/AuthContext.jsx";

import ProjectDetailPage from './pages/ProjectDetailPage.jsx'; // Create this component

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
   
    <Router>
      <Navbar/>
      <Routes>
        {/* Redirect from root path to /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Define routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage/>}/>
        <Route path="/upload" element={<Proiecte/>}/>
        
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        
      </Routes>
    </Router>

   

  );
};

export default App;
