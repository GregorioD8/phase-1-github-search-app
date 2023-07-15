let checkRepos = false
let userContainer = document.querySelector('#user-list')
let repoContainer = document.querySelector('#repos-list')
const inputForm =  document.querySelector('form')
let endPoint = ''
let emptyLi = document.createElement('li')
emptyLi.textContent = ''

btn1 = document.getElementsByTagName('input')[1]
btn1.setAttribute('value', 'Search Users')

btn2 = document.createElement('input')
btn2.setAttribute('type', 'submit')
btn2.setAttribute('name', 'submit')
btn2.setAttribute('value', 'Search Repo\'s')
inputForm.appendChild(btn2)
inputForm.addEventListener('submit', handleSubmit)

let userRepos = []
let matchesArray = []
// let userMatches = []
const emptyArray = [emptyLi]

function handleSubmit(e){
    e.preventDefault()

    intitialize()
    
    const input = document.querySelector("input#search")

    // input text
    console.log(input.value)
    ///submit button used
    console.log(e.submitter.value)


    if(e.submitter.value === 'Search Users'){
        // search for users matching a certain name.
        endPoint = `https://api.github.com/search/users?q=${input.value}` //object with array of objects in it
        getMatches()
       
       
    } else{
        
        endPoint = `https://api.github.com/search/repositories?q=${input.value}` //object with array of objects in it
        getMatches()
      
        
       
    }
    
    inputForm.reset()

}
//username, avatar and a link to their profile
function getMatches(){

    fetch(endPoint, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json"
        },
        body:JSON.stringify()
      })
     
      .then(res => res.json())
      .then(rObject => {
        console.log(Object.keys(rObject))
        console.log(rObject)
        if(Array.isArray(rObject)){
            
            console.log('its an array')
            userRepos = rObject
            renderRepo()
       
        }else{
            console.log('its an object')
            matchesArray = rObject.items
            checkObj = matchesArray[0]
            checkArr = Object.keys(checkObj)
            // console.log(matchesArray)
            if(!checkArr.includes('owner')){
                renderUser()
                debugger
            } else{
                renderRepositories()
            }
        }



    })
      
    }

   
    
        

//DOM render function
function renderUser() {
    
    let bArr = []
    matchesArray.forEach((user) => {
      
    //build toy
    let card = document.createElement('li')
        
    card.innerHTML = `
   
<h2>${user.login}</h2>
<img class="avatar" src="${user.avatar_url}"<img>
<a href="${user.html_url}">View Profile</a>
 
    `
   
    // find all the public repositories for a user
    card.querySelector(`img`).addEventListener('click', () => {
     endPoint = `https://api.github.com/users/${user.login}/repos` //array of objects
     console.log(`click ${user.login}`)
     getMatches()
      
    })
  
    bArr.push(card)
   
})
    userContainer.replaceChildren(...bArr)
  
   
  }


  
  function renderRepo() {

    let rArr = []
    userRepos.forEach((repo) => {
   language = repo.language
   if (repo.language === null){
    language= ''
   } 
   
   //build repo
    let card = document.createElement('li')
    card.className = 'card'
    
    card.innerHTML = `
    <a href="${repo.html_url}">${repo.name}</a>
    <a>${language}</a>
    <p>stars: ${repo.stargazers_count} forks: ${repo.forks_count} watchers: ${repo.watchers_count}</p>

    `

    rArr.push(card)
   
})
    repoContainer.replaceChildren(...rArr)


    //user repo info
    // card.querySelector(`img`).addEventListener('click', () => {
    //  endPoint = `https://api.github.com/users/${user.login}/repos`
    //  getMatches()
      
    // })
    
    // toyDiv = document.querySelector('#user-list').append(card)
    
   
  }


  function renderRepositories() {

    let rArr = []
    matchesArray.forEach((repo) => {
   language = repo.language
   if (repo.language === null){
    language= ''
   } 
   
   //build repo
    let card = document.createElement('li')
    card.className = 'card'
    
    card.innerHTML = `
    <h2><a href="${repo.html_url}">${repo.name}</a></h2>
    <a>by ${repo.owner.login}</a>
   
    `

    rArr.push(card)
   
})
    repoContainer.replaceChildren(...rArr)


    //user repo info
    // card.querySelector(`img`).addEventListener('click', () => {
    //  endPoint = `https://api.github.com/users/${user.login}/repos`
    //  getMatches()
      
    // })
    
    // toyDiv = document.querySelector('#user-list').append(card)
    
   
  }

  function intitialize() {
    userContainer.replaceChildren(...emptyArray)
    repoContainer.replaceChildren(...emptyArray)
    userRepos = []
    matchesArray = []
  }