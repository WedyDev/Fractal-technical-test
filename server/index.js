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


app.listen(3001,()=>{
    console.log("Connect Port 3001")
})