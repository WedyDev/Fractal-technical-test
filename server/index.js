const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "34.45.57.129",
    user: process.env.DB_USER || "testfractal",
    password: process.env.DB_PASSWORD || "walter123",
    database: process.env.DB_NAME || "orders"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});

app.post("/create", (req, res) => {
    const { Order, Date, Products, FinalPrice, Status } = req.body;

    db.query('INSERT INTO orders (`Order`, `Date`, `Products`, `FinalPrice`, `Status`) values(?,?,?,?,?)', 
             [Order, Date, Products, FinalPrice, Status],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/orders", (req, res) => {
    db.query('SELECT * FROM orders', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/orders/:id", (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM orders WHERE `id` = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                res.send(result[0]);
            } else {
                res.status(404).send({ message: "Order not found" });
            }
        }
    });
});

app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { Order, Date, Products, FinalPrice, Status } = req.body;

    db.query(
        'UPDATE orders SET `Order`=?, `Date`=?, `Products`=?, `FinalPrice`=?, `Status`=? WHERE `id`=?',
        [Order, Date, Products, FinalPrice, Status, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM orders WHERE `id`=?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
