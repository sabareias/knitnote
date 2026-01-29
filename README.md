![Knit Note](KnitNote.png "Knit Note")
# KNIT NOTE
    a fiber arts project tracker
## Track Used
    React + Express + Database

## Technologies Used
- **Frontend:** React
- **Styling:** Bootstrap & React Bootstrap
- **Backend:** Express
- **Database:** SQLite

## How to Run Locally
1. Open terminal **(Server Terminal)**
    1. enter `cd [YOUR PATH HERE]\knit-note\server`
    2. enter `npm run dev`
2. Open second terminal **(Client Terminal)**
    1. enter `cd [YOUR PATH HERE]\knit-note\client`
    2. enter `npm run dev`
3. Open `Local` link from **Client Terminal**: http://localhost:5173/ 

## CRUD features
- **Create**: Create a project by filling out the form
- **Read**: Project data stored in the database are read and displayed as cards
- **Update**: 
    - **Update Project Data Form:** click the `Edit Project button` on project of choice
        - A form will pop up in a modal autofilled with project data. Any changes made will be reflected in the project's card after clicking 'Save Changes'
    - **Toggle `completed` status:** click the check box or create/edit & give the project an end date
    - **Toggle `progress` status:** click the check box or  create/edit & give the project a start date and no end date
- **Delete**: Delete a project by clicking the `X` button on the right-hand-side of the project card header

## Client-Side Validation
- Invalid inputs result in red error messages popping up below the form field where the error occurred
- **Required inputs**
    - Project Title
        - 3 char min, 100 char max
    - Category
    - Craft Type
- **Optional inputs**
    - Pattern name
        - 3 char min, 100 char max
    - Yarn name
        - 3 char min, 100 char max
    - Start date
        - Cannot be after end date (if entered)
    - End date
        - Cannot be before start date (if entered)

## Server-Side Validation
- `app.post`:
    - Repeats of server-side validations as backup
    - Completed
        - Set true if `end` supplied, false if not
    - In Progress
        - Set true only if `start` is given and no `end` supplied, false if not
- `app.patch`: Verify 'fields' length is nto zero to prevent patching something with 0 changes made

## References
- [React Bootstrap](https://react-bootstrap.netlify.app/)
    - [Accordion](https://react-bootstrap.netlify.app/docs/components/accordion)
    - [Card](https://react-bootstrap.netlify.app/docs/components/cards)
    - [Modal](https://react-bootstrap.netlify.app/docs/components/modal)
- [Markdown Guide for README doc](https://www.markdownguide.org/basic-syntax/#code)
- [Method used for adding transition to scrollbar](https://stackoverflow.com/a/74050413)
- [Canva for the logo using free resources](https://www.canva.com/)