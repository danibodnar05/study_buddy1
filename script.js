
const helpers = [
{ name: "Bence", subject: "Matek" },
{ name: "Anna", subject: "Angol" },
{ name: "Levi", subject: "Informatika" }
];

function initApp(){

if(localStorage.getItem("credit")==null){
localStorage.setItem("credit","10")
}

if(localStorage.getItem("requests")==null){
localStorage.setItem("requests",JSON.stringify([]))
}

applyStoredTheme()

renderCredit()
renderHelpers()
renderRequests()

checkName()

}

function checkName(){

let name=localStorage.getItem("userName")

if(!name){

document.getElementById("nameModal").classList.remove("hidden")
return
}

updateNameUI(name)

}

function saveName(){

let name=document.getElementById("nameInput").value.trim()

if(!name){
showToast("Írd be a neved")
return
}

localStorage.setItem("userName",name)

document.getElementById("nameModal").classList.add("hidden")

updateNameUI(name)

}

function updateNameUI(name){

document.getElementById("welcomeText").textContent="Szia "+name+"!"

document.getElementById("profileName").textContent=name

document.getElementById("avatarLetter").textContent=name.charAt(0).toUpperCase()

}

function renderCredit(){

let credit=localStorage.getItem("credit")

document.getElementById("credit").textContent=credit
document.getElementById("homeCredit").textContent=credit
document.getElementById("profileCredit").textContent=credit

}

function updateCredit(amount){

let credit=parseInt(localStorage.getItem("credit"))

credit+=amount

localStorage.setItem("credit",credit)

renderCredit()

}

function renderHelpers(){

let list=document.getElementById("helperList")

list.innerHTML=""

helpers.forEach(helper=>{

let div=document.createElement("div")

div.className="helper-item"

div.innerHTML=`

<h3>${helper.name}</h3>
<p>${helper.subject}</p>

<button onclick="completeHelp('${helper.name}')">
Segítettem
</button>

`

list.appendChild(div)

})

}

function completeHelp(name){

updateCredit(2)

showToast(name+" után +2 kredit")

}

function renderRequests(){

let list=document.getElementById("requestList")

let requests=JSON.parse(localStorage.getItem("requests"))

list.innerHTML=""

requests.forEach(r=>{

let div=document.createElement("div")

div.className="request-item"

div.innerHTML=`

<h4>${r.subject}</h4>
<p>${r.description}</p>

`

list.appendChild(div)

})

}

document.getElementById("requestForm")
.addEventListener("submit",function(e){

e.preventDefault()

let credit=parseInt(localStorage.getItem("credit"))

if(credit<2){
showToast("Nincs elég kredit")
return
}

let subject=document.getElementById("subject").value
let description=document.getElementById("description").value

let requests=JSON.parse(localStorage.getItem("requests"))

requests.push({
subject,
description
})

localStorage.setItem("requests",JSON.stringify(requests))

updateCredit(-2)

renderRequests()

showToast("Kérés elküldve")

})

function showSection(id,btn){

document.querySelectorAll(".section")
.forEach(s=>s.classList.remove("active"))

document.getElementById(id).classList.add("active")

document.querySelectorAll(".nav-btn")
.forEach(b=>b.classList.remove("active"))

if(btn)btn.classList.add("active")

}

function showToast(text){

let toast=document.getElementById("toast")

toast.textContent=text

toast.classList.add("show")

setTimeout(()=>{

toast.classList.remove("show")

},2000)

}

function toggleTheme(){

document.body.classList.toggle("light-mode")

let theme=document.body.classList.contains("light-mode")?"light":"dark"

localStorage.setItem("theme",theme)

updateThemeIcon()

}

function applyStoredTheme(){

let theme=localStorage.getItem("theme")

if(theme==="light"){
document.body.classList.add("light-mode")
}

updateThemeIcon()

}

function updateThemeIcon(){

let icon=document.getElementById("themeIcon")

if(!icon)return

if(document.body.classList.contains("light-mode")){
icon.textContent="☀"
}else{
icon.textContent="☾"
}

}

function resetApp(){

localStorage.clear()

location.reload()

}

initApp()
