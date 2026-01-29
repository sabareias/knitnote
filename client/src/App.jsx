// imports
import { useState, useEffect } from "react"; 
import { getProjects, addProject, deleteProject, updateProject } from "./services/api.js"; 
import logo from "./assets/logo.png";
import AddProject from "./components/AddProject.jsx"; 
import ProjectList from "./components/ProjectList.jsx"; 


export default function App() { 
  const [Projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  async function handleAdd(projectData) { 
    const newProject = await addProject(projectData); 
    setProjects((prev) => [newProject, ...prev]);
  } 

  async function handleDelete(id) { 
    await deleteProject(id); 
    setProjects((prev) => prev.filter((project) => project.id !== id));
  } 

  async function handleToggle(project, toggleType) {
    if (toggleType === "progress") {
      const updated = await updateProject(project.id, { progress: !project.progress});
      setProjects((prev) => prev.map(p => (p.id === project.id ? updated : p)));
      return;
    } else if (toggleType === "completed") {
      const updated = await updateProject(project.id, { completed: !project.completed});
      setProjects((prev) => prev.map(p => (p.id === project.id ? updated : p)));
    }
  }

  async function handleEdit(updatedProjectData) {
      const updated = await updateProject(updatedProjectData.id, updatedProjectData);
      setProjects((prev) => prev.map(p => (p.id === updatedProjectData.id ? updated : p)));
  }

  if (loading) { 
    return (
      <div className="container mt-4">
      <p className="alert alert-info">Loading...</p>
      </div>
    ); 
  }; 
  if (error) { 
    return (
      <div className="container mt-4">
      <p className="alert alert-danger">{error}</p>
      </div>
    ); 
  };  

  return ( 
    <div className="container py-4"> 
    <div className="text-center container-large">
      <a href="/"><img src={logo} id="logo" alt="Knit Note Logo" className="mx-auto"/></a>
      <br />
      <span className="lead mb-4 text-center">a fiber-arts project tracker</span>
      </div>
      <hr />
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <AddProject onAdd={handleAdd} /> 
        </div>

        <div className="col-12 col-md-8 " id="projectList">
          <ProjectList id="innerProjectList"
            Projects={Projects} 
            onDelete={handleDelete} 
            onToggle={handleToggle}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div> 
  ); 
}