const express = require("express");
const app=express();
const mysql=require("mysql");
const cors = require("cors");


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "34.45.57.129",
    user: "testfractal",
    password: "walter123",
    database: "orders"
});


db.connect((err) => {
  if (err) {
      console.error("Error connecting to the database:", err);
      return;
  }
  console.log("Connected to the database!");
});

app.post("/create", (req,res)=>{
    const Order=req.body.Order;
    const Date=req.body.Date;
    const Products=req.body.Products;
    const FinalPrice=req.body.FinalPrice;
    const Status=req.body.Status;

    db.query('INSERT INTO orders (`Order`, `Date`, `Products`, `FinalPrice`, `Status`) values(?,?,?,?,?)',[Order,Date,Products,FinalPrice,Status],
        (err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                res.send(result);
            }
        }
    )

});


app.get("/orders", (req,res)=>{
    

    db.query('select * from orders ',
        (err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                res.send(result);
            }
        }
    )

});

app.get("/orders/:id", (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM orders WHERE `id` = ?', [id], (err, result) => {
      if (err) {
        console.log(err);
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
        } else {
          res.send(result);
        }
      }
    );
  });

app.delete("/delete/:id", (req,res)=>{

    const id=req.params.id;
  

    db.query('DELETE FROM orders  WHERE `id`=?',id,
        (err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                res.send(result);
            }
        }
    )

});


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});