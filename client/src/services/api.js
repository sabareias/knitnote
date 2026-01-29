const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getProjects() {
    const res = await fetch(`${API_BASE}/api/Projects`);
    if (!res.ok) {
    throw new Error("Failed to fetch projects");
    }
    return res.json();
}

export async function addProject(projectData) {
    const res = await fetch(`${API_BASE}/api/Projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
    throw new Error(data.error || `Failed to add project: ${res.status}`);
    }
    return data;
}

export async function deleteProject(id) {
    const res = await fetch(`${API_BASE}/api/Projects/${id}`, {
    method: "DELETE"
    });
    if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete project");
    }
}

export async function updateProject(id,fields) {
    const res = await fetch(`${API_BASE}/api/Projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields)
    });
    
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `Failed to update project: ${res.status}`);
    }
    return data;
}