"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { getProjects, addProject, deleteProject, updateProject } from "@/services/api";
import AddProject from "@/components/AddProject";
import ProjectList from "@/components/ProjectList";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [Projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status !== "authenticated") return;
    setLoading(true);
    getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load projects");
        setLoading(false);
      });
  }, [mounted, status]);

  async function handleAdd(projectData) {
    try {
      const newProject = await addProject(projectData);
      setProjects((prev) => [newProject, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add project");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete project");
    }
  }

  async function handleToggle(project, toggleType) {
    try {
      if (toggleType === "progress") {
        const updated = await updateProject(project.id, {
          progress: !project.progress,
        });
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? updated : p))
        );
        return;
      }
      if (toggleType === "completed") {
        const updated = await updateProject(project.id, {
          completed: !project.completed,
        });
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? updated : p))
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update project");
    }
  }

  async function handleEdit(updatedProjectData) {
    try {
      const updated = await updateProject(
        updatedProjectData.id,
        updatedProjectData
      );
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProjectData.id ? updated : p))
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to edit project");
    }
  }

  if (!mounted || status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="container mt-4">
        <p className="alert alert-info">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-4">
        <div className="text-center container-large">
          <a href="/">
            <img src="/logo.png" id="logo" alt="Knit Note Logo" className="mx-auto" />
          </a>
          <br />
          <span className="lead mb-4 text-center d-block">
            a fiber-arts project tracker
          </span>
        </div>
        <hr />
        <div className="text-center mt-4">
          <p className="text-muted mb-3">Sign in to view and manage your projects.</p>
          <button
            type="button"
            className="btn btn-custom-primary"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="alert alert-danger">{error}</p>
      </div>
    );
  }

  return (
    <>
    <div className="container py-4">
      
      <div className="text-center container-large position-relative">
        
        <a href="/">
          <img src="/logo.png" id="logo" alt="Knit Note Logo" className="mx-auto" />
        </a>
        <br />
        <span className="lead mb-4 text-center d-block">
          a fiber-arts project tracker
        </span>
        <button
          type="button"
          className="btn btn-custom-outline btn-sm"
          onClick={() => signOut()}
        >
          Sign out{session?.user?.email && (
            <span className="d-none d-sm-inline"> ({session.user.email})</span>
          )}
      </button>
      </div>
      
      <hr />
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <AddProject onAdd={handleAdd} />
        </div>
        <div className="col-12 col-md-8" id="projectList">
          <ProjectList
            id="innerProjectList"
            Projects={Projects}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onEdit={handleEdit}
          />
        </div>
        
      </div>

      

    </div>
      
  </>
  );
}

