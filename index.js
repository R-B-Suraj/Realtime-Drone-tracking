const express = require('express');
const app = express();
const socket = require('socket.io');
const cors = require('cors');

const server = app.listen(8080,()=>{
    console.log("listen to request on 8080 ");
});

const io = socket(server);

// DUMMY DATABASE VALUES droneid -> userid
const DRONES = new Map([
    [1,2],[2,1],[3,3],[4,3],[5,1]
]);

const drones = new Map();
// online user -> socket id
const users = new Map();

app.use(cors())
app.use(express.static('public'));

// dummy drone activation
app.get('/drone1',(req,res)=>{
    res.sendFile(__dirname+'/drone1.html')
})
app.get('/drone2',(req,res)=>{
    res.sendFile(__dirname+'/drone2.html')
})
app.get('/drone3',(req,res)=>{
    res.sendFile(__dirname+'/drone3.html')
})
app.get('/drone4',(req,res)=>{
    res.sendFile(__dirname+'/drone4.html')
})
app.get('/drone5',(req,res)=>{
    res.sendFile(__dirname+'/drone5.html')
})


// dummy user login
app.get('/user1',(req,res)=>{
    res.sendFile(__dirname+'/user1.html')
})
app.get('/user2',(req,res)=>{
    res.sendFile(__dirname+'/user2.html')
})
app.get('/user3',(req,res)=>{
    res.sendFile(__dirname+'/user3.html')
})

//  admin page 
app.get('/admin',(req,res)=>{
    res.sendFile(__dirname+'/admin.html')
})


io.on('connection',(socket)=>{

    // console.log('made socket connection',socket.id);
    
    socket.on('group',(data)=>{
        if(data.grp == 'drone'){
            // fetch the userid corresponding to this drone from database
            drones.set(data.id, DRONES.get(data.id))
        }
        else if(data.grp == 'user'){
            // store userid -> socket id in a hashmap
            users.set(data.id, socket.id)
        }
    })

    
    socket.on('pos',(data)=>{
        let userid = drones.get(data.id);
        // send position of drone to admin. (drone id, position)
        
        // if user is active send position of drone 
        // to user (through the socket stored in users Map).  (drone id, position)
        if(users.get(userid)){
            io.to(users.get(userid)).emit('newpos',data)
        }
        // console.log(data,userid)
    });

});




















