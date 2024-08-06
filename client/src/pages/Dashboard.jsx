import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Typography, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard'; 
import '../styles/Dashboard.css'
const Dashboard = () => {
  const { token, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (!userData) {
      navigate('/login'); // Redirect to login if no user data
    } else {
      fetchUserProjects();
    }
  }, [userData, navigate]);

  const fetchUserProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/user/files', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setUserProjects(data);
      } else {
        setUserProjects([]); // Ensure it's an array
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      setUserProjects([]); // Ensure it's an array in case of error
      console.error('Error fetching user projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate('/login'); // Redirect to login on logout
  };

  useEffect(() => {
    console.log('userData in Dashboard:', userData); // Debugging line
  }, [userData]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Card className="profile-card">
        <div className="profile-content">
          <Avatar size={150} icon={<UserOutlined />} className="avatar" />
          {userData ? (
            <>
              <Typography.Title level={2} strong className="username">
                {userData.name || 'Username not available'}
              </Typography.Title>
              <Typography.Text type="secondary" strong>
                Grad: {userData.rank || 'Rank not available'}
              </Typography.Text>
              <Typography.Text type="secondary" strong>
                Scor: {userData.score !== undefined ? userData.score : 'Score not available'}
              </Typography.Text>
              <Button 
                size="large" 
                type="primary" 
                className="profile-btn" 
                onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography.Text type="danger" strong>
              Datele utilizatorului nu au fost gasite.
            </Typography.Text>
          )}
        </div>
      </Card>

      <Card className="projects-card">
        <Typography.Title level={3} strong>
          Proiectele Tale
        </Typography.Title>
        <div className="project-profile-list">
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.metadata.title}
                description={project.metadata.description}
                author={project.metadata.name}
                type={project.metadata.type}
                difficulty={project.metadata.difficulty}
              />
            ))
          ) : (
            <p>Nu s-a gasit niciun proiect postat de acest utilizator.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
