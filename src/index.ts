import express from "express";
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from "mongoose";
import router from "./router";


//initiating express app
const app = express();



app.use(cors({
	credentials: true,
}));

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());


// creating server
const server = http.createServer(app);

// initiating the server call
const port = 10;
server.listen(port,()=>{
	console.log(`Server started on port http://localhost:${port}`)
});

const MONGODB_URL= 'mongodb+srv://Wadmin:john56amo@mongo.ykb6d1k.mongodb.net/?retryWrites=true&w=majority';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL);

//handling database connection errors
mongoose.connection.on('error', (error:Error)=>console.log(error));

app.use('/', router());
