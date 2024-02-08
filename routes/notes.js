const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

notes.get('/', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to submit note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting feedback');
    }
});

notes.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);

    const deleteID = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => {
            //reads json file, searches for the index of the json to delete using the id query parameter,
            //deletes the entry using splice and writes the new array to the same file.
            const notes = JSON.parse(data);
            const deleteIndex = notes.findIndex((note) => {
                return note.note_id === deleteID;
            })

            if (deleteIndex !== -1) {
                notes.splice(deleteIndex, 1);

                writeToFile('./db/db.json', notes);
                res.json('Note successfully deleted');
            } else {
                res.json('Note not found');
            }
        })
        .catch((err) => {
            console.error('Error reading from file:', err);
        });
})


module.exports = notes;