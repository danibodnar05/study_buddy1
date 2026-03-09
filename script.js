const helpers = [
{ name: "Bence", subject: "Matek" },
{ name: "Anna", subject: "Angol" },
{ name: "Levi", subject: "Informatika" }
];


function initApp(){

if(!localStorage.getItem("credit")){
localStorage.setItem("credit",10)
}

if(!localStorage.getItem("name")){
document.getElementById("loginModal").classList.remove("hidden")
}

updateUI()

renderHelpers()

}


function updateUI(){

let credit = localStorage.getItem("credit")

document.getElementById("credit").textContent = credit

document.getElementById("profileCredit").textContent = credit


let name = localStorage.getItem("name")

if(name){

document.getElementById("profileName").textContent = name

document.getElementById("welcomeText").textContent =
`Szia ${name}!`

}

}


function saveName(){

let name = document.getElementById("nameInput").value

if(!name)return

localStorage.setItem("name",name)

document.getElementById("loginModal").classList.add("hidden")

updateUI()

showToast("Üdv " + name)

}


function updateCredit(amount){

let credit = parseInt(localStorage.getItem("credit"))

credit += amount

localStorage.setItem("credit",credit)

updateUI()

}


function renderHelpers(){

const list = document.getElementById("helperList")

list.innerHTML = ""

helpers.forEach(helper=>{

const el = document.createElement("div")

el.className="helper-item"

el.innerHTML=`

<h3>${helper.name}</h3>

<p>${helper.subject}</p>

<button onclick="helpUser('${helper.name}')">
Segítettem
</button>

`

list.appendChild(el)

})

}


function helpUser(name){

updateCredit(2)

showToast("Segítettél neki: "+name)

}


document.getElementById("requestForm")
.addEventListener("submit",function(e){

e.preventDefault()

let credit = parseInt(localStorage.getItem("credit"))

if(credit<2){

showToast("Nincs elég kredited")

return

}

updateCredit(-2)

showToast("Segítségkérés elküldve")

})


function showSection(sectionId,btn){

document.querySelectorAll(".section")
.forEach(s=>s.classList.remove("active"))

document.getElementById(sectionId)
.classList.add("active")


document.querySelectorAll(".nav-btn")
.forEach(b=>b.classList.remove("active"))

if(btn)btn.classList.add("active")

}


function showToast(text){

const toast=document.getElementById("toast")

toast.textContent=text

toast.classList.add("show")

setTimeout(()=>{

toast.classList.remove("show")

},2000)

}


function toggleTheme(){

document.body.classList.toggle("light-mode")

}


function resetApp(){

localStorage.clear()

location.reload()

}


initApp()
