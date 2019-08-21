const users=[]

//add user
const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //valdit data
    if(!username||!room){
        return{
            error:"Username and room are requierd"
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
       return user.room===room&&user.username===username
    })

    //valdate user
    if(existingUser){
        return{
            error:"username is used"
        }
    }
    //store user
    const user={id,username,room}
    users.push(user)
    return {user}

}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const user=users.find((user)=>{
        return user.id===id
        
    })
    if(!user){
        return undefined
    }
    return user
}
const getUserInRoom=(room)=>{
    const user=users.filter((user)=> user.room===room)
    if(!room){
        return []
    }
    return user
}

addUser({
    id:4,
    username:"philly",
    room:"4"
})
addUser({
    id:5,
    username:"phill",
    room:"4"
})
const user=getUserInRoom('t')
console.log(user)

module.exports={
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}

