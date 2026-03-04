import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

export default function EditProject({ project, onSave, onCancel }) {
  const [projectTitle, setTitle] = React.useState("");
  const [patternName, setPatternName] = React.useState("");
  const [yarn, setYarn] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [craft, setCraft] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [titleError, setTitleError] = React.useState("");
  const [patternError, setPatternError] = React.useState("");
  const [yarnError, setYarnError] = React.useState("");
  const [categoryError, setCategoryError] = React.useState("");
  const [craftError, setCraftError] = React.useState("");
  const [startDateError, setStartDateError] = React.useState("");
  const [endDateError, setEndDateError] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = projectTitle.trim();
    if (!trimmedTitle) {
      setTitleError("Project title is required.");
      return;
    } else if (trimmedTitle.length < 3) {
      setTitleError("Project title must be at least 3 characters.");
      return;
    } else if (trimmedTitle.length > 100) {
      setTitleError("Project title must not exceed 100 characters.");
      return;
    }
    setTitleError("");

    const trimmedPattern = patternName.trim();
    if (trimmedPattern) {
      if (trimmedPattern.length < 3) {
        setPatternError("Pattern name must be at least 3 characters.");
        return;
      } else if (trimmedPattern.length > 100) {
        setPatternError("Pattern name must not exceed 100 characters.");
        return;
      }
    }
    setPatternError("");

    const trimmedYarn = yarn.trim();
    if (trimmedYarn) {
      if (trimmedYarn.length < 3) {
        setYarnError("Pattern name must be at least 3 characters.");
        return;
      } else if (trimmedYarn.length > 100) {
        setYarnError("Pattern name must not exceed 100 characters.");
        return;
      }
    }
    setYarnError("");

    if (category === "") {
      setCategoryError("Category is required.");
      return;
    }
    setCategoryError("");

    if (craft === "") {
      setCraftError("Craft type is required.");
      return;
    }
    setCraftError("");

    const start = startDate ? startDate : "";
    const end = endDate ? endDate : "";

    if (
      startDate !== "( no date set )" &&
      endDate !== "( no date set )" &&
      new Date(startDate) > new Date(endDate)
    ) {
      setStartDateError("Start date cannot be later than end date.");
      return;
    }

    setStartDateError("");
    setEndDateError("");

    const completedInt = endDate ? 1 : 0;
    const progressInt = startDate && !endDate ? 1 : 0;

    const projectData = {
      id: project.id,
      title: trimmedTitle,
      category,
      craft,
      pattern: trimmedPattern,
      yarn: trimmedYarn,
      startDate: start,
      endDate: end,
      completed: completedInt,
      progress: progressInt,
    };

    onSave(projectData);

    setTitle("");
    setCategory("");
    setCraft("");
    setPatternName("");
    setYarn("");
    setStartDate("");
    setEndDate("");
  }

  function setFields(p) {
    setTitle(p.title || "");
    setCategory(p.category || "");
    setCraft(p.craft || "");
    setPatternName(p.pattern || "");
    setYarn(p.yarn || "");
    setStartDate(p.startDate || "");
    setEndDate(p.endDate || "");
  }

  useEffect(() => {
    if (project) {
      setFields(project);
    }
  }, [project]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="projectTitle">
          Project Title
        </label>
        <input
          id="projectTitle"
          className={`form-control ${titleError ? "is-invalid" : ""}`}
          type="text"
          value={projectTitle}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My Stripey Sweater"
          required
        />
        {titleError && <div className="invalid-feedback">{titleError}</div>}
      </div>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="category">
          Category
        </label>
        <select
          className={`form-control ${
            categoryError ? "is-invalid" : ""
          } form-select`}
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessory">Accessory</option>
          <option value="Home">Home</option>
          <option value="Other">Other</option>
        </select>
        {categoryError && (
          <div className="invalid-feedback">{categoryError}</div>
        )}
      </div>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="craft">
          Craft Type
        </label>
        <select
          className={`form-control ${
            craftError ? "is-invalid" : ""
          } form-select`}
          id="craft"
          value={craft}
          onChange={(e) => setCraft(e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="Knit">Knit</option>
          <option value="Crochet">Crochet</option>
        </select>
        {craftError && <div className="invalid-feedback">{craftError}</div>}
      </div>

      <Accordion className="mb-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Additional Options</Accordion.Header>
          <Accordion.Body>
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="patternName">
                Pattern Name
              </label>
              <input
                id="patternName"
                className={`form-control ${
                  patternError ? "is-invalid" : ""
                }`}
                type="text"
                value={patternName}
                onChange={(e) => setPatternName(e.target.value)}
                placeholder="e.g., Olga Jacket"
              />
              {patternError && (
                <div className="invalid-feedback">{patternError}</div>
              )}
            </div>

            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="yarn">
                Yarn Name
              </label>
              <input
                id="yarn"
                className={`form-control ${yarnError ? "is-invalid" : ""}`}
                type="text"
                value={yarn}
                onChange={(e) => setYarn(e.target.value)}
                placeholder="e.g., De Rerum Natura Gilliatt"
              />
              {yarnError && (
                <div className="invalid-feedback">{yarnError}</div>
              )}
            </div>

            <div className="input-group mb-3">
              <label className="input-group-text">Start Date</label>
              <input
                type="date"
                className={`form-control ${
                  startDateError ? "is-invalid" : ""
                }`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {startDateError && (
                <div className="invalid-feedback">{startDateError}</div>
              )}
            </div>

            <div className="input-group mb-1">
              <label className="input-group-text">End Date</label>
              <input
                type="date"
                className={`form-control ${endDateError ? "is-invalid" : ""}`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {endDateError && (
                <div className="invalid-feedback">{endDateError}</div>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <button type="submit" className="btn btn-custom-primary w-100">
        Save Changes
      </button>
      <button
        type="button"
        className="btn btn-secondary w-100 mt-2"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}

