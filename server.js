const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
const { todo } = require('node:test');


const todos = ;

const requestListener = (req , res) =>{
  //json / cors 處理
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }

  let body = "";
  req.on('data' , chunk =>{
    body += chunk;
  } )

  
  if(req.url === "/todos" && req.method == "GET"){
    res.writeHead(200 , headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  }else if(req.url === "/todos" && req.method == "POST"){

    req.on('end' , () =>{
      try{
        const title  = JSON.parse(body).title;
        if(title != undefined){
          const todo = {
            "title": title,
            "id": uuidv4()
          }
          todos.push(todo);        
          res.writeHead(200 , headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();
        }else{
          errHandle(res);
        }
      }
      catch(e){
        errHandle(res);
      }
      
    })
  }
  else if( req.url ==="/todos" && req.method == "DELETE"){
    todos.length = 0;
    res.writeHead(200 , headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  }
  else if (req.url.startsWith("/todos/") && req.method =="DELETE"){
    const id = req.url.split('/').pop();
    const index = todos.findIndex(e => e.id == id)
    console.log(id , index);
    if(index !== -1){
      todos.splice(index , 1);
      res.writeHead(200 , headers);
      res.write(JSON.stringify({
        "status": "success",
        "data": todos,
      }));
      res.end();
    }else{
      errHandle(res);

    }
   
  }
  else if(req.url.startsWith("/todos/") && req.method =="PATCH"){
    req.on('end',()=>{
      try{
          const todo = JSON.parse(body).title;
          const id = req.url.split('/').pop();
          const index =todos.findIndex(e => e.id == id);
          console.log(todo , id);
          
          if(todo !== undefined || index !== -1){
            todos[index].title = todo;
            res.writeHead(200,headers);
            res.write(JSON.stringify({
              "status": "success",
              "data": todos
            }))
            res.end();
          }else{
            errHandle(res);
          }
      }
      catch(e){
        errHandle(res);
      }
    })
  }
  else if( req.method == "OPTIONS"){
      res.writeHead(200 , headers);
      res.end();
  }
  else{
    res.writeHead(404 , headers);
    res.write(JSON.stringify({
      "status": "false",
      "message": "無此網站路由",
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
// server.listen(3005);
server.listen( process.env.PORT|| 3005); // 設定 port 沒設定 3005