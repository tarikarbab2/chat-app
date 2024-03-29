const express=require("express")

const http=require("http")
const path= require("path")
const socketio=require("socket.io")
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const Filter=require('bad-words')
const {generateMessage}=require("./utils/messages")
const{getUser,getUserInRoom,addUser,removeUser}=require('./utils/user')

const port=process.env.PORT||3000


const pathview=path.join(__dirname,"../views")
app.use(express.static(pathview))

let count=0

io.on('connection',(socket)=>{
    console.log("new socket connection")
    
    

    socket.on('join',({username,room},callback)=>{
            const{error,user}  =addUser({id:socket.id,username,room})

            if(error){
             return callback(error)
            }

        socket.join(user.room)
        socket.emit('message',generateMessage(user.username,'welcome'))

        socket.broadcast.to(user.room).emit('message',generateMessage(user.username,`${user.username} joined the room!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('****')
        }
      io.to(user.room).emit('message',generateMessage(user.username,message))
      callback()
      
    })
    socket.on('disconnect',()=>{
      const user=  removeUser(socket.id)
      if(user){
        io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has left`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
      }

        
    })
    socket.on('location',(positon,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('sendLocation',generateMessage(user.username,`https://google.com/maps?q=${positon.latitude},${positon.longitude}`))
        callback()
    })  
})





server.listen(port,(req,res)=>{
    console.log("the server has start at port "+port)
})



