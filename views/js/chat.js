

const socket=io()

//elements
const formMessage=document.querySelector("#type")
const inputFormMessage=document.querySelector('input')
const buttonFormMessage=document.querySelector('button')
const locationbutton=document.querySelector("#sendlocation")
const $message=document.querySelector("#message")
//templaets
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
    const send$messages=$message.lastElementChild

    const newMessageStyels=getComputedStyle(send$messages)
    const newMessageMargin=parseInt(newMessageStyels.marginBottom)
    const newMessageHeight=send$messages.offsetHeight+newMessageMargin

    const visibleHeight=$message.offsetHeight



    const containerHeight=$message.scrollHeight
    const scrollOffset = Math.ceil($message.scrollTop + visibleHeight)

    if(containerHeight - newMessageHeight <= scrollOffset){
        $message.scrollTop=$message.scrollHeight
    }
}

socket.on("message",(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.creatAt).format('h:mm a')
        
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('sendLocation',(location)=>{
    console.log(location)
    const html=Mustache.render(locationTemplate,{
        username:location.username,
        location:location.text,
        createdAt:moment(location.creatAt).format('h:mm a')
    })
   $message.insertAdjacentHTML('beforeend',html)
   autoscroll()
})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})


formMessage.addEventListener("submit",(e)=>{
    e.preventDefault()
    buttonFormMessage.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value
    socket.emit("sendMessage",message,(error
    )=>{
        buttonFormMessage.removeAttribute('disabled')
        inputFormMessage.value=''
        inputFormMessage.focus()
        if(error){
            return console.log(error)
        }
        console.log('message deliverd')
    })
})
socket.on('new user',(message)=>{
    console.log(message)
})

locationbutton.addEventListener("click",()=>{
    locationbutton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('your browser dose not support this service')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        
    
    socket.emit('location',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
       
    },()=>{
        locationbutton.removeAttribute('disabled')
        
           
        console.log("location deliverd")
    })
})

})
socket.emit('join',{
    username,
    room
},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }

})