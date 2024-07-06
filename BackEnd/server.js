const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require("path");

const PORT = process.env.PORT || 8082;

const app = express();

// Path to a SQL file with a database schema
const sqlFilePath = path.join(__dirname, 'data.sql');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

const db = mysql.createConnection({
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

                        db.query(sqlScript, function (err, result) {
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

        const db = mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: '',
            database: 'out_of_office',
            multipleStatements: true // Enable multiple statements
        });

        db.connect(function(err) {
            if (err) throw err;
            console.log("Connected to MySQL!");

            // Start the server only after successful DB connection
            app.listen(PORT, () => console.log("SERVER WORK"));
        });

        // Query the database after confirming connection
        db.query('SELECT * FROM Employees', (err, results) => {
            if (err) {
                console.error("Error fetching records:", err);
                return;
            }
            console.log("Employees in database:");
            console.log(results);
        });

    } catch (e) {
        console.log(e);
    }
};

start().then(r => r);

