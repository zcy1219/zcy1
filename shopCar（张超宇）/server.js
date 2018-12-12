const express = require("express");
const http = express();
const dbModel = require("./public/js/MongoDB");
const db = new dbModel("jd1");
http.listen(8081,()=>{
    console.log("server is running")
})
http.use(express.static("./public"));
// 渲染页面
http.get("/showSy",(req,res)=>{
    db.find("list",{},(err,data)=>{
        if (err) throw err;
        res.send(data);
    })
})
// 添加商品
http.get("/add",(req,res)=>{
    let id = req.query.id;
    db.find("list",{},(err,data)=>{
        if (err) throw err;
        data = data[0].list; // 三种商品列表
        data.forEach((item,index)=>{
            let data1 = data[index].products; // 所有商品
            data1.forEach((item,index)=>{
                if (id == item.id){
                    db.count("shopCar",{id:id*1},(err,count)=>{
                        // console.log("这是",count)
                        if (count == 0) {
                            item.num = 1;
                            item.total = item.price*1;
                            // console.log(item.total)
                            db.insertOne("shopCar",item,(err,data2)=>{
                                res.send(data2)
                            })
                        }else{
                            db.find("shopCar",{query:{id:id*1}},(err,data3)=>{
                                console.log(data3)
                                data3 = data3[0]; // 获取重复添加的数据
                                data3.num += 1;   // 重复则数量加一
                                data3.total = data3.num*data3.price*1;
                                db.updateOne("shopCar",{id:id*1},{num:data3.num,total:data3.total},(err,data4)=>{
                                    res.send("ok")
                                })
                            })
                        }
                    })
                }
            })
        })
    })
})
// 渲染购物车
http.get("/shopcar",(req,res)=>{
    db.find("shopCar",{},(err,data)=>{
        data.num += 1;
        res.send(data)
    })
})
// 增加商品数量
http.get("/up",(req,res)=>{
    let id = req.query.id;
    db.find("shopCar",{query:{id:id*1}},(err,data)=>{
        if (err) throw err;
        data = data[0]; // 获取发生改变的数据
        data.num = data.num*1 + 1;
        data.total = data.num*data.price*1
        db.updateOne("shopCar",{id:id*1},{num:data.num,total:data.total},(err,data1)=>{
            res.send(data1);
        })
    })
})
// 减
http.get("/down",(req,res)=>{
    let id = req.query.id;
    db.find("shopCar",{query:{id:id*1}},(err,data)=>{
        if (err) throw err;
        data = data[0]; // 获取发生改变的数据
        data.num = data.num*1-1;
        data.total = data.num*data.price*1
        // 数量少于1 删除商品
        if (data.num <= 0) {
            db.deleteOne("shopCar",{id:id*1},(err,data)=>{
                res.send("删除成功")
            })
        }else{
            db.updateOne("shopCar",{id:id*1},{num:data.num,total:data.total},(err,data1)=>{
                res.send(data1);
            })
        }
    })
})
// 总价
http.get("/total",(req,res)=>{
    let id = req.query.id;
})