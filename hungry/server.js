const Db = require("./js/mongoDB");
const db = new Db("foods");
const express = require("express");
const http = express();
http.listen(8080,()=>{
    console.log("server is running")
})
http.use(express.static("./"));
// 渲染页面
http.get("/show",(req,res)=>{
    db.find("list",{},(err,data)=>{
        if (err) throw err;
        res.send(data)
    })
})
// 加
http.get("/add",(req,res)=>{
    let id = req.query.id;
    db.findById("list",id,(err,data)=>{
        if (err) throw err;
        data.num = data.num*1+1;
        db.updateById("list",id,{num:data.num,total:data.total},(err,data1)=>{
            res.send(data1)
        })
    })
})
// 减
http.get("/reduce",(req,res)=>{
    let id = req.query.id;
    db.findById("list",id,(err,data)=>{
        if (err) throw err;
        data.num = data.num*1-1;
        db.updateById("list",id,{num:data.num,total:data.total},(err,data1)=>{
             res.send(data1)
        })
    })
})
//输入框
http.get("/ipt",(req,res)=>{
    let data = req.query;
    db.updateById("list",data.id,data,(err,data1)=>{
        res.send(data1)
    })
})
// 总价
http.get("/total",(req,res)=>{
    db.find("list",{},(err,data)=>{
        let sum = 0;
        let total = 0;
        if (err) throw err;
        data.forEach((item,index)=>{
            sum+=item.num*1;
            total+=item.num*item.price*1;
        })
        let zong = {
            sum:sum,
            total:total
        }
        res.send(zong)
    })
})