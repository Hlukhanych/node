const express = require('express')
const app = express()
const port = 3000

const fs = require("fs")
const bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({  extended: true }));

app.get('/', function (req, res) {
    fs.readFile( __dirname + "/" + "orders.json", 'utf8', function (err, data) {
        var orders = JSON.parse( data );
        res.end( JSON.stringify(orders));
    });
})

app.get('/:id', function (req, res) {
    fs.readFile( __dirname + "/" + "orders.json", 'utf8', function (err, data) {
        var orders = JSON.parse( data );
        var order = orders[req.params.id]
        res.end( JSON.stringify(order));
    });
})

app.post('/', function (req, res) {
    fs.readFile( __dirname + "/" + "orders.json", 'utf8', function (err, data) {
        let orders = JSON.parse( data );
        const newOrder = {
            "surname": req.body.surname,
            "amount": req.body.amount,
            "product_name": req.body.product_name,
            "client_company": req.body.client_company,
            "customer_surname": req.body.customer_surname
        };
        orders.push(newOrder);
        fs.writeFile(__dirname + '/orders.json', JSON.stringify(orders,null,2),'utf8',(err)=>{
            if(err){
                res.status(500).send('Problem while write in file')
            }
            res.status(201).send('Created')
        })
    });
})

app.put('/:id', (req,res)=>{
    fs.readFile( __dirname + "/orders.json", 'utf8', (err, data) => {
        let orders = JSON.parse( data );
        orders[req.params.id - 1] = req.body;
        fs.writeFile(__dirname+'/orders.json', JSON.stringify(orders,null,2),'utf8',(err)=>{
            if(err){
                res.status(500).send('Problem while write in file')
            }
            res.status(200).send('Updated')
        })
    });
})

app.delete('/:id', (req,res)=>{
    fs.readFile( __dirname + "/orders.json", 'utf8', (err, data) => {
        let orders = JSON.parse( data )
        delete orders[req.params.id - 1]
        orders = orders.filter(Boolean)
        fs.writeFile(__dirname+'/orders.json', JSON.stringify(orders,null,2),'utf8',(err)=>{
            if(err){
                res.status(500).send('Problem while write in file')
            }
            res.status(200).send('Deleted')
        })
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})