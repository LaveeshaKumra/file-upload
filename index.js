const express = require("express");
const multer = require("multer");
const fs = require("fs");
var mysql=require('mysql');
var path=require('path');

var con = mysql.createConnection({host:'localhost',user:'root',password:'',database:'mmdmo'});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, (file.filename = file.originalname));
  }
});

const upload = multer({ storage: storage });

const app = express();


var bodyParser = require('body-parser');


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));




app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'uploads')));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  console.log(req.file.filename);
  console.log(req.body.username);
  console.log(req.body.password);
  
  var  sql="insert into data(username,password,image) values('"+req.body.username+"','"+req.body.password+"','"+req.file.filename+"')";
  
  con.query(sql,function(err,rows)
  {
	  
	  if(err) throw err;
	  if(rows)
	  {
		  
		  console.log("File added");
	  }
	  
	  
	  
  })
  
  
  //   fs.writeFile("./new", req.file);
  res.send("File Uploaded");
});


app.get("/displaydata",function(req,res)
{
	
	con.query("select * from data",function(err,result)
	{
		
		res.render("userdata",{data:result});
		
		
		
		
	});
	
});


app.listen(8080, () => console.log("Listening on port 8080.."));
