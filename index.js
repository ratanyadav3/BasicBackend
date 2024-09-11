const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Route to read a specific file
app.get('/file/:filename', function (req, res) {
    const filepath = path.join(__dirname, 'files', req.params.filename); // Ensure cross-platform compatibility with path.join
    fs.readFile(filepath, "utf-8", function (err, fileData) {
        if (err) {
            console.log("Error in reading files", err);
            return res.status(404).send('File Not Found'); // Return 404 if the file is not found
        } else {
            res.render('show', { filename: req.params.filename, fileData }); // Render the file content
        }
    });
});

app.get('/edit/:filename',function(req,res){
    res.render('edit',{filename:req.params.filename});
})
app.post('/edit',function(req,res){
    fs.rename(`./files/${req.body.old}`,`./files/${req.body.new}`,function(err){
        res.redirect('/');
    })
})

// Route to list all files in the 'files' directory
app.get('/', function (req, res) {
    const filesPath = path.join(__dirname, 'files');
    
    fs.readdir(filesPath, function (err, files) {
        if (err) {
            console.log("Error in reading directory", err);
            return res.status(500).send('Internal Server Error');
        } else {
            res.render('index', { files }); // Render the index with the list of files
        }
    });
});

// Route to create a new file
app.post('/create', function (req, res) {
    if (req.body.title && req.body.detail) {
        const fileName = req.body.title.split(' ').join('') + '.txt'; // Create file name
        const filePath = path.join(__dirname, 'files', fileName); // Ensure cross-platform path

        fs.writeFile(filePath, req.body.detail, function (err) {
            if (err) {
                console.log("Error in writing file", err);
                return res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/'); // Redirect back to the homepage after file creation
            }
        });
    } else {
        return res.status(400).send('Bad Request: Title or Detail missing'); // Handle missing input
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
