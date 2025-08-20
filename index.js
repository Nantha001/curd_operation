const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();

app.use(express.json());

// Database initialization
const db = new sqlite3.Database("./mydb.sqlite", (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Connected to sqlite database");
});


db.run(`CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    content TEXT
)`);


// POST method (Insert user)
app.post("/users", (req, res) => {
    const { name, content } = req.body;
    db.run(`INSERT INTO user(name, content) VALUES(?, ?)`,
        [name, content],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.send(this.lastID);
        }
    );
});

// GET method (Fetch all users)
app.get("/", (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching data" });
        }
        res.json(rows);
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
