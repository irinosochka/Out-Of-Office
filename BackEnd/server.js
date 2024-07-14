const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require("path");

const PORT = process.env.PORT || 8082;

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Path to a SQL file with a database schema
const sqlFilePath = path.join(__dirname, 'data.sql');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

let db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    multipleStatements: true // Enable multiple statements
});

const dbCheck = async () => {
    return new Promise((resolve, reject) => {
        db.connect(function(err) {
            if (err) return reject(err);

            // Check if the database exists
            db.query("SHOW DATABASES LIKE 'out_of_office';", function(err, result) {
                if (err) return reject(err);
                if (result.length === 0) {
                    // Database does not exist
                    fs.readFile(sqlFilePath, 'utf8', (err, sqlScript) => {
                        if (err) {
                            console.error("Error reading SQL file:", err);
                            return reject(err);
                        }

                        db.query(sqlScript, function (err) {
                            if (err) return reject(err);
                            console.log("Database and tables created");
                            resolve();
                        });
                    });
                } else {
                    // Database already exists
                    console.log("Database 'out_of_office' already exists");
                    resolve();
                }
            });
        });
    });
};

const start = async () => {
    try {
        await dbCheck();

        db = mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: '',
            database: 'out_of_office',
            multipleStatements: true // Enable multiple statements
        });

        db.connect(function(err) {
            if (err) throw err;
            console.log("Connected to MySQL!");
            app.listen(PORT, () => console.log("SERVER WORK"));
        });
    } catch (e) {
        console.log(e);
    }
};

start().then(r => r);


// EMPLOYEE TABLE

app.get('/Lists/Employees', (req, res) => {
    db.query('SELECT * FROM Employees', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post('/Lists/Employees', (req, res) => {
    const employee = req.body;
    db.query('INSERT INTO Employees SET ?', employee, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: results.insertId, ...employee });
        }
    });
});


//LEAVE REQUESTS TABLE

app.get('/Lists/LeaveRequests', (req, res) => {
    db.query('SELECT * FROM LeaveRequests', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post('/Lists/LeaveRequests', (req, res) => {
    const leaveRequest = req.body;
    db.query('INSERT INTO LeaveRequests SET ?', leaveRequest, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: results.insertId, ...leaveRequest });
        }
    });
});



//APPROVAL REQUESTS TABLE

app.get('/Lists/ApprovalRequests', (req, res) => {
    db.query('SELECT * FROM ApprovalRequests', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});


//PROJECT TABLE

app.get('/Lists/Projects', (req, res) => {
    db.query('SELECT * FROM Projects', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post('/Lists/Projects', (req, res) => {
    const project = req.body;
    db.query('INSERT INTO Projects SET ?', project, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: results.insertId, ...project });
        }
    });
});


module.exports = app;
