import { useState } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import EditProject from "@/components/EditProject";

export default function ProjectList({ Projects, onDelete, onToggle, onEdit }) {
  const [show, setShow] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleClose = () => {
    setShow(false);
    setEditingProject(null);
  };

  const handleShow = (project) => {
    setEditingProject(project);
    setShow(true);
  };

  const handleEdit = (updatedProject) => {
    onEdit(updatedProject);
    handleClose();
  };

  function formatDate(start, end) {
    if (!start && !end) return "( no date set )";
    if (start && !end) {
      const [year, month, day] = start.split("-");
      return `${month}/${day}/${year} - ( no date set )`;
    }
    if (!start && end) {
      const [year, month, day] = end.split("-");
      return `( no date set ) - ${month}/${day}/${year}`;
    }
    const [startYear, startMonth, startDay] = start.split("-");
    const [endYear, endMonth, endDay] = end.split("-");
    return `${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}`;
  }

  function calcDateDiff(start, end) {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const msDiff = Math.abs(endDate - startDate);
    const daysDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) return `${daysDiff} day`;
    return `${daysDiff} days`;
  }

  function displayPattern(pattern) {
    if (!pattern) return null;
    return (
      <span>
        Pattern&nbsp;&nbsp;&nbsp;&thinsp;
        <span className="text-body ms-4">{pattern} </span>
        <br />
      </span>
    );
  }

  function displayYarn(yarn) {
    if (!yarn) return null;
    return (
      <span>
        Yarn&nbsp;&nbsp;&nbsp;
        <span className="text-body ms-5">{yarn} </span>
      </span>
    );
  }

  if (Projects.length === 0) {
    return (
      <div className="container">
        <p className="text-muted lead text-center mt-3">
          You have no projects. Add your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row g-4">
        {Projects.map((project) => (
          <div key={project.id} className="col-12 col-xl-6">
            <Card>
              <Card.Header className="lead">
                <strong>{project.title}</strong>
                <button
                  onClick={() => onDelete(project.id)}
                  className="btn btn-sm float-end"
                  id="delButton"
                  title="Delete"
                >
                  &#x2715;{" "}
                </button>
              </Card.Header>
              <Card.Body>
                <Card.Text className="text-muted">
                  <span className="float-end">
                    <label
                      className="form-check-label float-end"
                      htmlFor={project.id + `Completed`}
                    >
                      Completed
                    </label>
                    <input
                      type="checkbox"
                      className="form-check-input me-2 ms-1 "
                      checked={project.completed}
                      onChange={() => onToggle(project, "completed")}
                      id={project.id + `Completed`}
                    />
                    <br />
                    <label
                      className="form-check-label float-end"
                      htmlFor={project.id + `Progress`}
                    >
                      In Progress
                    </label>
                    <input
                      type="checkbox"
                      className="form-check-input me-2 ms-1"
                      checked={project.progress}
                      onChange={() => onToggle(project, "progress")}
                      id={project.id + `Progress`}
                    />
                  </span>
                  Category&thinsp;
                  <span className="text-body ms-4">
                    {project.category || "N/A"}{" "}
                  </span>
                  <br />
                  Craft&nbsp;&nbsp;
                  <span className="text-body ms-5">
                    {project.craft || "N/A"}{" "}
                  </span>
                  <br />
                  {displayPattern(project.pattern)}
                  {displayYarn(project.yarn)}
                </Card.Text>

                <button
                  type="submit"
                  className="btn btn-custom-outline w-100"
                  onClick={() => handleShow(project)}
                >
                  Edit Project
                </button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Project</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditProject
                      project={editingProject}
                      onSave={handleEdit}
                      onCancel={handleClose}
                    />
                  </Modal.Body>
                </Modal>
              </Card.Body>
              <Card.Footer className="text-muted">
                <span className="float-start">
                  {formatDate(project.startDate, project.endDate)}
                </span>
                <span className="float-end">
                  {calcDateDiff(project.startDate, project.endDate)}
                </span>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

