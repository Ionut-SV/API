import React, { useState, useEffect } from 'react';
import '../styles/ProjectPage.css';

function ProjectCard({ title, description, imageUrl, author }) {
  return (
    <div className="project-card">
      <div className="card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="placeholder">No Image Available</div>
        )}
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="card-author">
        <p>by {author}</p>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://localhost:3000/api/files/files');
        if (response.ok) {
          const projectList = await response.json();
          console.log(projectList); // Debugging line
          setProjects(projectList);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
  
    fetchProjects();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const filteredProjects = projects.filter((project) =>
    selectedTag === 'all' || project.tags.includes(selectedTag)
  );

  return (
    <div className="projects-page">
      <h2>Proiectele mele</h2>
      <div className="tag-buttons">
        <button onClick={() => handleTagClick('tag1')}>Tag 1</button>
        <button onClick={() => handleTagClick('tag2')}>Tag 2</button>
        <button onClick={() => handleTagClick('all')}>Toate</button>
      </div>
      <div className="project-list">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imageUrl={project.imageUrl} // Ensure imageUrl is correctly set
            author={project.author}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
