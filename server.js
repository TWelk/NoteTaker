const express = require("express");
const path = require("path");
const db = require(path.join(__dirname, "db", "db.json"));
let PORT = process.env.PORT || 3001;
let app = express();
const fs = require('fs');
const { dirname } = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"))
});

app.get('/api/notes', (req, res) => {
    let recordSet = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
    res.json(recordSet)
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/notes", (req, res) => {

    const newNote = req.body;

    let recordSet = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json")))
    if (recordSet.length > 0) {
        newNote.id = recordSet[recordSet.length - 1].id + 1;
    } else {
        newNote.id = 1
    };
    console.log(newNote.id)

    recordSet.push(newNote)

    fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(recordSet, null, 2), (err) => {
        if (err) {
            console.log(err)
        }
        res.send("Success")
    });
})

app.delete('/api/notes/:note', (req, res) => {
    let recordSet = [];
    let noteToDelete = req.params.note;
    fs.readFile(path.join(__dirname, "db", "db.json"), (err, data) => {
        if (err) {
            console.log(err);
        }
        recordSet = JSON.parse(data);
        for (const key in recordSet) {
            const element = recordSet[key];
            if (element.id == noteToDelete) {
                console.log(recordSet);
                console.log(noteToDelete);
                const sameId = (element) => element.id == noteToDelete
                console.log(recordSet.findIndex(sameId))
                recordSet.splice(recordSet.findIndex(sameId), 1);
                console.log(recordSet)
                fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(recordSet, null, 2))
                break;
            }
        }
    })

    res.send("Deleted")

})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});