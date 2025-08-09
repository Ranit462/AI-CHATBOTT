let prompt=document.querySelector("#prompt")
let chatContainer=document.querySelector(".chatcontainer")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")


const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAWL2ZoN6Upg7wjL21oVKN7YhSLxnryOh0" 



let user={
    message:null,
    file:{
        mime_type: null,
        data: null

    }
}

async function generateResponse(aiChatBox) {
    let text=aiChatBox.querySelector(".aiChatarea")
   let RequestOption={
    method:"POST",
    headers:{'Content-Type':' application/json'},
    body : JSON.stringify({
        
            "contents": [
              {
                "parts": [
                  {
                    "text": user.message
                  },(user.file.data?[{"inline_data":user.file}]:[])
                ]
              }
            ]
           
    })
   } 
try{
    let response= await fetch(Api_Url,RequestOption)
    let data= await response.json()
    let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    text.innerHTML=apiResponse

}
catch(error){
console.log(error);
}
finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
     image.src=`white image icon png.png`
        image.classList.remove("choose")
        user.file={}

}



}






function createChatbox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}



function handleresponse(message){
    user.message=message
   
    let html=` <img src="working.png" alt="userimage" id="userimg" width="50"> 
          <div class="userChatarea">
          ${user.message} 
          ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
          </div> `
          prompt.value=""
          let userChatBox=createChatbox(html,"userChatbox")
         chatContainer.appendChild(userChatBox)
         chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})


         setTimeout(()=>{
            let html=` <img src="robot.png" alt="aiimage" id="aiimg" width="50">
            <div class="aiChatarea">
            <img src="loading.gif" alt="" class="load" width="50px">
          </div>`
          let aiChatBox=createChatbox(html,"aiChatbox")
          chatContainer.appendChild(aiChatBox)
          generateResponse(aiChatBox)
 
         },600)
}








prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
 handleresponse(prompt.value);
    }
})

imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data:base64string
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
   
    reader.readAsDataURL(file)

    
})


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})





9