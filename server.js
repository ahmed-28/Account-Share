const express = require('express');
const util = require( 'util' );
const cors = require('cors');
const mysql = require( 'mysql' );
const webSocketServer = require("ws").Server;
const WebSocket  = require('ws');
const {v4:uuidv4} = require('uuid');

const app = express();

let socket_connections = {};

function to(user,data){
    if(socket_connections[user] && socket_connections[user].readyState === WebSocket.OPEN)
        socket_connections[user].send(data);
}

app.use(cors());
app.use(express.json());

const port = 3000;  

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'accountshare'
});

const query = util.promisify(db.query).bind(db);


app.get('/', async (req, res) => {
    const test_con = await query("show tables");
    console.log(test_con[0].Tables_in_accountshare);
    res.send('Hello World!');
});

app.post('/createUser', async (req,res) => {
    const id = uuidv4();
    console.log(req.body);
    const username = req.body.username;
    await query("insert into users values (?,?)",[id,username]);
    const user = await query("select * from users where username = ?",[username]);
    console.log("from server "+user);
    res.json({
        data:user,
        message: "created",
        status:200
    });
});

app.get('/getUser' ,async (req,res) => {
    const id = req.query.id;
    //console.log(req.query);
    console.log(id);
    const user = await query("select * from users where id = ?",[id]);
    res.json({
        username:user[0].username,
        message:"success",
        status:200
    });
});

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
});

wss = new webSocketServer({port:8000});
wss.on('connection',(ws)=>{
    ws.on('message',(message) => {
        message = JSON.parse(message);
        console.log("from client",message);
    });
});