const express = require('express');
const util = require( 'util' );
const cors = require('cors');
const mysql = require( 'mysql' );
const {v4:uuidv4} = require('uuid');

const app = express();

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