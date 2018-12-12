const express = require("express");
const http = express();
const bodyParser = require("body-parser")
const Db = require("../js脚本文件/mongoDB")
const db = new Db("wishwall")
http.listen(8080,()=> {
	console.log("welcome wishes wall")
})
// 设置跨域
http.use((req,res,next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
})
// 请求头
http.use(bodyParser.urlencoded({extended: false}));
//提交愿望
http.post("/add", (req, res) => {
	let data = req.body;
	db.find("wishes", {
		query: {
			hope: data.hope
		}
	}, (err, data1) => {
		if(data1.length == 0) {
			data.timer = new Date().getTime();
			data.statics = "white";
			db.insertOne("wishes", data, (err, hopeData) => {
				if(err) throw err;
				res.send({
					status: "1",
					statusText: "许愿成功"
				})
			})
		} else {
			res.send({
				status: "-1",
				statusText: "你的愿望已经添加了"
			})
		}

	})
})
http.get("/msg", (req, res) => {
	db.find("wishes", {}, (err, data) => {
		if(data.length == 0) {
			res.send({
				status: "0",
				statusText: ""
			})
		} else {
			randSort(data)
			if(data.length > 8) {
				let newArr = data.slice(0, 8)
				res.send({
					status:"8",
					newArr
				})
			}else{
				res.send({
					status:"5",
					data
				})
			}
		}
	})
})
//随机排序
function randSort(arr) {
	var temp;
	for(var i = 0; i < arr.length; i++) {
		var index = parseInt(Math.random() * (arr.length));
		temp = arr[index];
		arr[index] = arr[i];
		arr[i] = temp
	}
	return arr;
}
http.get("/del", (req, res) => {
	let data = req.query;
	db.deleteById("wishes", data._id, (err, data1) => {
		if(err) throw err;
		res.send("删除成功")
	})
})
http.get("/ch", (req, res) => {
	let data = req.query;
	//	console.log(data)
	db.findById("wishes", data._id, (err, data1) => {
		if(data1.statics == "white") {
			db.updateById("wishes", data1._id, {
				statics: data.statics
			}, (err, data1) => {
				if(err) throw err;
				res.send({
					status: "2"
				})
			})
		} else {
			res.send({
				status: "-2"
			})
		}
	})
})