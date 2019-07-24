"use strict";

// service worker registration - remove if you're not going to use it

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// place your code below

const inputValue = document.querySelector('.form-field__input--js')
const repository = document.querySelector('.repository-wrapper--js')
const repositoryTitle = document.querySelector('.repository__title--js')
const repositoryData = document.querySelector('.repository__content--js')

inputValue.addEventListener("keydown", e => {
  
  var keyCode = e.which || e.keyCode;
  if (keyCode == 13) // enter key code
  {
    e.preventDefault()
    fetch(`https://api.github.com/users/${inputValue.value}/repos`)
      .then(resp => resp.json())
      .then(resp => {
        data(resp)
      })
  }
})

const data = (data) => {
  console.log(data)
  for (let i=0; i < data.length; i++) {
    const name = data[i]['name']
    const path = data[i]['url']
    const creationTime = data[i]['created_at'].slice(0,10)
    const lastUpdate = data[i]['updated_at'].slice(0,10)
    const description = data[i]['description']
    // console.log(name)
    // console.log(path)
    // console.log(creationTime)
    // console.log(lastUpdate)
    // console.log(description)
    console.log(repository)

    repository.innerHTML += `
    <section class="repository repository--js">
        <h2 class="repository__number">${i+1}</h2>
        <h2 class="repository__title repository__title--js">${name}</h2>
        <article class="repository__content repository__content--js">
          <ul class="content content--fields">
            <li>patch:</li>
            <li>creation time:</li>
            <li>last update:</li>
            <li>description:</li>
          </ul>
          <ul class="content content--data">
            <li>${path}</li>
            <li>${creationTime}</li>
            <li>${lastUpdate}</li>
            <li>${description}</li>
          </ul>
        </article>
      </section>
    `
  }
}