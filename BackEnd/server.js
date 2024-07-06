// Import required modules
const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require("path");

const PORT = process.env.PORT || 8082

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

// Database connection configuration
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    multipleStatements: true // Enable multiple statements in queriess
});

// Path to a SQL file with a database schema
const sqlFilePath = path.join(__dirname, 'data.sql');

// Connect to MySQL database

const dbCheck = async () => {
    db.connect(function(err) {
        if (err) throw err;
        console.log("Connected to MySQL!");

        // Check if the database exists
        db.query("SHOW DATABASES LIKE 'out_of_office';", function(err, result) {
            if (err) throw err;
            if (result.length === 0) {
                // Database does not exist
                fs.readFile(sqlFilePath, 'utf8', (err, sqlScript) => {
                    if (err) {
                        console.error("Error reading SQL file:", err);
                        return;
                    }

                    db.query(sqlScript, function (err, result) {
                        if (err) throw err;
                        console.log("Database and tables created");
                    });
                });
            } else {
                // Database already exist
                console.log("Database 'out_of_office' already exists");
            }
        });
    });
}

const start = async () => {
    try {
        await dbCheck();
        app.listen(PORT, () => console.log('Server is running on ${PORT}'))
    } catch (e) {
        console.log(e)
    }
}

start().then(r => r)

//TEST
app.get('/', (req, res) => {
    return res.json("Test");
});
