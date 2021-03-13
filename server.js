const express = require('express');
const util = require( 'util' );
const mysql = require( 'mysql' );
const {v4:uuidv4} = require('uuid');

const app = express();
const port = 3000;
function connectDB( config ) {
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}

const db = connectDB({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'accountshare'
});


app.get('/', async (req, res) => {
    const test_con = await db.query("show tables");
    console.log(test_con);
    res.send('Hello World!');
});

app.post('/createUser', async (req,res) => {
    const id = uuidv4();
    const username = req.body.username;
    const user = await db.query("insert into users values (?,?)",[id,username]);
    res.json({
        data:user,
        message: "created",
        status:200
    });
});

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
})