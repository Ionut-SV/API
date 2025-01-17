import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Comments from '../components/Comments';  
import '../styles/ProjectDetailPage.css';

function ProjectDetailPage() {
    const { id } = useParams(); 
    const [project, setProject] = useState(null); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        async function fetchProject() {
            if (!id) {
                setError('No project ID provided');
                return;
            }

            try {
                // Obține metadata fișierului
                const metadataResponse = await fetch(`http://localhost:3000/api/files/files/${id}`);
                if (!metadataResponse.ok) {
                    throw new Error('Failed to fetch project metadata. Status: ' + metadataResponse.status);
                }
                const file = await metadataResponse.json();
                setProject(file);

            } catch (error) {
                setError(error.message); // Setează mesajul de eroare în stare
                console.error('Error fetching project:', error);
            }
        }

        fetchProject();
    }, [id]); // Include id în array-ul de dependențe pentru a refetch-ui dacă se schimbă

    if (error) {
        return <div>Error: {error}</div>; // Afișează mesajul de eroare
    }

    if (!project) {
        return <div>Loading...</div>; // Afișează un mesaj de încărcare în timp ce datele sunt obținute
    }

    // URL-ul pentru a accesa fișierul pentru previzualizare
    console.log('Project:', project); // Log project to verify the structure
    console.log('Filename:', project.filename);
    const fileUrl = `http://localhost:3000/api/files/${project.filename}`;

    const renderPreview = () => {
        switch (project.contentType) {
            case 'application/pdf':
                return (
                    <div className="preview-container">
                        <iframe src={fileUrl} title="PDF Preview" frameBorder="0" className="file-preview pdf-preview" />
                    </div>
                );
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                return (
                    <div className="preview-container">
                        <img src={fileUrl} alt={project.metadata?.title || 'No title available'} className="file-preview image-preview" />
                    </div>
                );
            case 'text/plain':
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="view-button">
                        View Document
                    </a>
                );
            default:
                return <div>Preview not available for this file type.</div>;
        }
    };

    return (
        
        <div className="project-detail-page">
           
            <div className="project-content">
                <div className="project-metadata">
                    <h2>{project.metadata?.title || 'No title available'}</h2>
                    <p>{project.metadata?.description || 'No description available'}</p>
                    <div>Autor: {project.metadata?.name || 'No author information'}</div>
                    <div>Tip: {project.metadata?.type || 'No type information'}</div>
                    <div>Dificultate: {project.metadata?.difficulty || 'No difficulty information'}</div>
                </div>
                <div className="project-file">
                    {renderPreview()}
                    
                </div>
            </div>
            <div className="comments-section">
            {project.filename ? (
                    <Comments filename={project.filename} />
                ) : (
                    <div>No filename available for comments.</div>
                )}
            </div>
        </div>
        
    );
}

export default ProjectDetailPage;