"use strict";

// service worker registration - remove if you're not going to use it

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("serviceworker.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

// place your code below

const inputValue = document.querySelector(".form-field__input--js");
const repository = document.querySelector(".repository-wrapper--js");
const repositoryTitle = document.querySelector(".repository__title--js");
const repositoryData = document.querySelector(".repository__content--js");
const sortBy = document.querySelector(".form-field__select--sort-js");
const sortDirection = document.querySelector(".form-field__select--direction-js");
const submitButton = document.querySelector(".form__button--js");

submitButton.addEventListener("click", e => {
  e.preventDefault();
  submitButton.classList.add('form__button--blink');
  setTimeout(() => {
    submitButton.classList.remove('form__button--blink');
  }, 600)
  let username = inputValue.value;
  fetch(`https://api.github.com/users/${username}/repos?sort=${sortBy.value}&direction=${sortDirection.value}`)
    .then(resp => resp.json())
    .then(resp => {
      if (resp.message && resp.message.includes("Not Found")) {
        userNotFound(username);
      } else {
        console.log(resp)
        listRepozitories(resp, username);
      }
    })
    .catch((error) => {
      console.log(error)
    });
    
})

const userNotFound = (username) => {
  let resp = `
          <div class="shell">
            <div class="shell__top-bar">Error</div>
            <div class="shell__button shell__button--left"></div>
            <div class="shell__button shell__button--middle"></div>
            <div class="shell__button shell__button--right"></div>
            <ul class="shell__body">
              <li class="shell__body-element">User with username: ${username} doesn't exists</li>
            </ul>
          </div>
        `;
  repository.innerHTML = resp;
}

const listRepozitories = (data, username) => {
  console.log(sortBy.value)
  console.log(sortDirection.value)
  if (data.length) {
    let temp = `<div class="shell">
                  <div class="shell__top-bar">${username} repos</div>
                  <div class="shell__button shell__button--left"></div>
                  <div class="shell__button shell__button--middle"></div>
                  <div class="shell__button shell__button--right"></div>
                  <ul class="shell__body">
                    <li class="shell__body-element"><img class="shell__image" src="${data[0]['owner']['avatar_url']}" alt="Repository owner username image."></li>
                  </ul>
                </div>`;
    for (let i = 0; i < data.length; i++) {
      const name = data[i]["name"];
      const path = data[i]["url"];
      const creationTime = data[i]["created_at"].slice(0, 10);
      const lastUpdate = data[i]["updated_at"].slice(0, 10);
      const description = data[i]["description"];
      temp += `
          <div class="shell">
            <div class="shell__top-bar">${i + 1}. $${window.innerWidth < 640 ? name.slice(0, 15) : name}</div>
            <div class="shell__button shell__button--left"></div>
            <div class="shell__button shell__button--middle"></div>
            <div class="shell__button shell__button--right"></div>
            <ul class="shell__body">
              <li class="shell__body-element">name: ${name}</li>
              <li class="shell__body-element">path: <a href="${path}">${path}</a></li>
              <li class="shell__body-element">created:  ${creationTime}</li>
              <li class="shell__body-element">updated: ${lastUpdate}</li>
              <li class="shell__body-element">description: ${description ? description : 'No description for this project'}</li>
            </ul>
          </div>
    `;
    }
    repository.innerHTML = temp;
  } else {
    let resp = `
              <div class="shell">
                <div class="shell__top-bar">${username} repositories</div>
                <div class="shell__button shell__button--left"></div>
                <div class="shell__button shell__button--middle"></div>
                <div class="shell__button shell__button--right"></div>
                <ul class="shell__body">
                  <li class="shell__body-element">User with username: ${username} doesn't have public repositories</li>
                </ul>
              </div>
                    `;
    repository.innerHTML = resp;
  }
};
