import React, { useState, useEffect } from 'react';
import '../styles/ProjectPage.css';
import ProjectCard from './ProjectCard'; // Adjust path as necessary

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [appliedTag, setAppliedTag] = useState('all');
  const [appliedDifficulty, setAppliedDifficulty] = useState('all');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://localhost:3000/api/files/files');
        if (response.ok) {
          const fileList = await response.json();
          const projectList = fileList.map(file => ({
            id: file._id,
            title: file.metadata.title,
            description: file.metadata.description,
            imageUrl: null, // Adjust if you have image URLs
            author: file.metadata.name,
            type: file.metadata.type,
            difficulty: file.metadata.difficulty // Adjust if you have difficulty information
          }));
          setProjects(projectList);
        } else {
          console.error('Failed to fetch projects. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, []);

  // Handle input change in search bar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle tag filter change
  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  // Handle the "Cauta" button click
  const handleSearchButtonClick = () => {
    setAppliedQuery(searchQuery);
    setAppliedTag(selectedTag);
    setAppliedDifficulty(selectedDifficulty);
  };

  // Filter projects based on applied tag, difficulty, and the applied search query
  const filteredProjects = projects.filter((project) => {
    const typeMatches = appliedTag === 'all' || project.type === appliedTag;
    const difficultyMatches = appliedDifficulty === 'all' || project.difficulty === appliedDifficulty;
    const searchMatches = project.title?.toLowerCase().includes(appliedQuery.toLowerCase()) ?? false;
    return typeMatches && difficultyMatches && searchMatches;
  });

  return (
    <div className="projects-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Cauta un proiect..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchButtonClick}>
          Cauta
        </button>
      </div>
      <div className="filters">
        <div className="filter">
          <label htmlFor="type-select">Tip:</label>
          <select id="type-select" value={selectedTag} onChange={handleTagChange}>
            <option value="all">Toate</option>
            <option value="Programare">Programare</option>
            <option value="Retelistica">Retelistica</option>
          </select>
        </div>
        <div className="filter">
          <label htmlFor="difficulty-select">Dificultate:</label>
          <select id="difficulty-select" value={selectedDifficulty} onChange={handleDifficultyChange}>
            <option value="all">Toate</option>
            <option value="Incepator">Incepator</option>
            <option value="Mediu">Mediu</option>
            <option value="Avansat">Avansat</option>
          </select>
        </div>
      </div>
      <div className="project-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
              author={project.author}
              difficulty={project.difficulty}
              type={project.type}
            />
          ))
        ) : (
          <p>No projects found for this search.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;