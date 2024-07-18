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

app.get('/Lists/Employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Employees WHERE ID = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
        }
    });
});

app.put('/Lists/Employees/:id', (req, res) => {
    const { id } = req.params;
    const employee = req.body;
    db.query('UPDATE Employees SET ? WHERE ID = ?', [employee, id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ id, ...employee });
        }
    });
});


//DELETING EMPLOYEE

// Check if an employee is referenced in the tables
app.get('/Lists/Employees/:id/CheckReferences', (req, res) => {
    const { id } = req.params;
    db.query(
        'SELECT COUNT(*) AS projectCount FROM projects WHERE ProjectManager = ?; SELECT COUNT(*) AS partnerCount FROM employees WHERE PeoplePartner = ?;',
        [id, id],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                const projectCount = results[0][0].projectCount;
                const partnerCount = results[1][0].partnerCount;
                res.send({ referenced: projectCount > 0 || partnerCount > 0 });
            }
        }
    );
});

// Check if an employee has leave requests
app.get('/Lists/Employees/:id/LeaveRequests', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM LeaveRequests WHERE EmployeeID = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.delete('/Lists/Employees/:id', (req, res) => {
    const { id } = req.params;

    // Delete approval requests associated with leave requests for the employee
    db.query('DELETE FROM ApprovalRequests WHERE LeaveRequestID IN (SELECT ID FROM LeaveRequests WHERE EmployeeID = ?)', [id], (err, results) => {
        if (err) {
            return db.rollback(() => {
                console.error('Failed to delete approval requests:', err);
                res.status(500).send(err.message);
            });
        }

        // Delete leave requests for the employee
        db.query('DELETE FROM LeaveRequests WHERE EmployeeID = ?', [id], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Failed to delete leave requests:', err);
                    res.status(500).send(err.message);
                });
            }

            // Delete the employee
            db.query('DELETE FROM Employees WHERE ID = ?', [id], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Failed to delete employee:', err);
                        res.status(500).send(err.message);
                    });
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Failed to commit transaction:', err);
                            res.status(500).send(err.message);
                        });
                    }

                    res.send({ message: 'Employee and associated leave and approval requests deleted', id });
                });
            });
        });
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

app.get('/Lists/LeaveRequests/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM LeaveRequests WHERE ID = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
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

app.put('/Lists/LeaveRequests/:id', (req, res) => {
    const { id } = req.params;
    const request = req.body;
    db.query('UPDATE LeaveRequests SET ? WHERE ID = ?', [request, id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ id, ...request });
        }
    });
});

app.delete('/Lists/LeaveRequests/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM LeaveRequests WHERE ID = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ message: 'LeaveRequests deleted', id });
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

app.delete('/Lists/ApprovalRequests/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ApprovalRequests WHERE ID = ?', [id], (err, results) => {
        if (err) {
            console.error('Failed to delete approval request:', err);
            return res.status(500).send(err.message);
        }
        res.send({ message: 'Approval request deleted', id });
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

app.get('/Lists/Projects/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Projects WHERE ID = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
        }
    });
});

app.put('/Lists/Projects/:id', (req, res) => {
    const { id } = req.params;
    const project = req.body;
    db.query('UPDATE Projects SET ? WHERE ID = ?', [project, id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ id, ...project });
        }
    });
});

app.delete('/Lists/Projects/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Projects WHERE ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting project:', err);
            res.status(500).send(err);
        } else {
            res.send({ message: 'Project deleted', id });
        }
    });
});


module.exports = app;
