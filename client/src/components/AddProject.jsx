import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

export default function AddProject({ onAdd }) { 
    
    const [projectTitle, setTitle] = React.useState("");
    const [patternName, setPatternName] = React.useState("");
    const [yarn, setYarn] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [craft, setCraft] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    // validators
    const [titleError, setTitleError] = React.useState("");
    const [patternError, setPatternError] = React.useState("");
    const [yarnError, setYarnError] = React.useState("");
    const [categoryError, setCategoryError] = React.useState("");
    const [craftError, setCraftError] = React.useState("");
    const [startDateError, setStartDateError] = React.useState("");
    const [endDateError, setEndDateError] = React.useState("");

    function handleSubmit(e) { 
        e.preventDefault();
    
/* ---------------------------------- VALIDATIONS ----------------------------------------- */

        // title validation
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

        // the title is valid
        setTitleError("");

        // pattern name validation
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

        // yarn name error handling
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

        // the yarn is valid
        setYarnError("");

        // category validation
        if (category === "") {
            setCategoryError("Category is required.");
            return;
        }

        // the category is valid
        setCategoryError("");

        // craft validation
        if (craft === "") {
            setCraftError("Craft type is required.");
            return;
        }

        // the craft is valid
        setCraftError("");

        // date validation
        const start = startDate ? startDate : '';
        const end = endDate ? endDate : '';

        if (startDate !== "( no date set )" && endDate !== "( no date set )" && new Date(startDate) > new Date(endDate)) {
            setStartDateError("Start date cannot be later than end date.");
            return;
        }

        setStartDateError("");
        setEndDateError("");

/* ----------------------------------------------------------------------------------------- */

        // all validations passed = store in projectData
        const projectData = {
            title: trimmedTitle,
            category: category,
            craft: craft,
            pattern: trimmedPattern,
            yarn: trimmedYarn,
            startDate: start,
            endDate: end
        }

        console.log("Submitting project data:", projectData);

        // add project
        onAdd(projectData);

        // clear set fields
        setTitle("");
        setCategory("");
        setCraft("");
        setPatternName("");
        setYarn("");
        setStartDate("");
        setEndDate("");
    }

    
    return ( 
        <form onSubmit={handleSubmit} noValidate>

            {/* Project Title Selection */}
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="projectTitle">Project Title</label>
                <input
                    id="projectTitle"
                    className={`form-control ${titleError ? "is-invalid" : ""}`}
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., My Stripey Sweater"
                    required
                />
                {/* error message */}
                {titleError && (
                    <div className="invalid-feedback">{titleError}</div>
                )}
            </div>

            {/* Category Selection */}
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="category">Category</label>
                <select 
                    className={`form-control ${categoryError ? "is-invalid" : ""} form-select`} 
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
                {/* error message */}
                {categoryError && (
                    <div className="invalid-feedback">{categoryError}</div>
                )}
            </div>
            
            {/* Craft Type Selection */}
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="craft">Craft Type</label>
                <select 
                    className={`form-control ${craftError ? "is-invalid" : ""} form-select`} 
                    id="craft" 
                    value={craft}
                    onChange={(e) => setCraft(e.target.value)}
                >
                    <option value="">Choose...</option>
                    <option value="Knit">Knit</option>
                    <option value="Crochet">Crochet</option>
                </select>
                {/* error message */}
                {craftError && (
                    <div className="invalid-feedback">{craftError}</div>
                )}
            </div>

            {/* Accordion for additional (non-required) options */}
            <Accordion className="mb-2">
                <Accordion.Item eventKey="0">
                    <Accordion.Header >Additional Options</Accordion.Header>
                    <Accordion.Body>
                        {/* Pattern Name Selection */}
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor="patternName">Pattern Name</label>
                            <input
                                id="patternName"
                                className={`form-control ${patternError ? "is-invalid" : ""}`}
                                type="text"
                                value={patternName}
                                onChange={(e) => setPatternName(e.target.value)}
                                placeholder="e.g., Olga Jacket"
                            />
                            {/* error message */}
                            {patternError && (
                                <div className="invalid-feedback">{patternError}</div>
                            )}
                        </div>

                        {/* Yarn Name Selection */}
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor="yarn">Yarn Name</label>
                            <input
                                id="yarn"
                                className={`form-control ${yarnError ? "is-invalid" : ""}`}
                                type="text"
                                value={yarn}
                                onChange={(e) => setYarn(e.target.value)}
                                placeholder="e.g., De Rerum Natura Gilliatt"
                            />
                            {/* error message */}
                            {yarnError && (
                                <div className="invalid-feedback">{yarnError}</div>
                            )}
                        </div>

                        {/* Start Date Selection */}
                        <div className="input-group mb-3">
                            <label className="input-group-text">Start Date</label>
                            <input 
                                type="date"
                                className={`form-control ${startDateError ? "is-invalid" : ""}`}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            {/* error message */}
                            {startDateError && (
                                <div className="invalid-feedback">{startDateError}</div>
                            )}
                        </div>

                        {/* End Date Selection */}
                        <div className="input-group mb-1">
                            <label className="input-group-text">End Date</label>
                            <input 
                                type="date"
                                className={`form-control ${endDateError ? "is-invalid" : ""}`}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            {/* error message */}
                            {endDateError && (
                                <div className="invalid-feedback">{endDateError}</div>
                            )}
                        </div>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <button type="submit" className="btn btn-custom-primary w-100 mt-2">
                Add Project
            </button>
        </form>
    ); 
}