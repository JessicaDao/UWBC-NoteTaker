const express = require('express');
const fs = require('fs');
const path = require('path')

//express function & port
const app = express();
const PORT = process.env.PORT||3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

//index page
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
//notes page
app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})
//note from db.json
app.get("/api/notes", (req,res) => {
    fs.readFile(path.join(__dirname,"db","db.json"), "utf-8", (err,data)=>{
        if(err) throw err
        res.json(JSON.parse(data))
    })
})
//new note
app.post("/api/notes", (req,res) => {
    fs.readFile("db/db.json", "utf-8", (err, data) => {
        if (err) throw error
        let notes = JSON.parse(data)

        var newNote = req.body;
        notes.push(newNote);
        var idNumber = 0
        for (var i = 0; i < notes.length; i++) {
            notes[i].id = idNumber
            idNumber++
        }
        console.log(notes)

        fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
            if (err) return console.log(err);
            res.json(true)
        })
    })
});

//delete note
app.delete("/api/notes/:id", (req,res) => {
    fs.readFile("db/db.json", "utf-8", (err, data) => {
        if (err) throw error
        let notes = JSON.parse(data)
        var getId = req.params.id
        notes.forEach((note, i) => {
            if (note.id === parseInt(getId)) {
                notes.splice(i, 1);
            }
        });

        fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
            if (err) return console.log(err);
            res.json(true)
        })
    })
});
// listen function
app.listen(PORT, function() {
    console.log(`You're running on PORT ${PORT}`);
})