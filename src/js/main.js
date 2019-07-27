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

inputValue.addEventListener("keydown", e => {
  var keyCode = e.which || e.keyCode;
  if (keyCode == 13) {
    // enter key code
    e.preventDefault();
    let username = inputValue.value;
    console.log(username)
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
      .then(resp => resp.json())
      .then(resp => {
        if (resp.message && resp.message.includes("Not Found")) {
          userNotFound(username);
        } else {
          console.log(resp)
          listRepozitories(resp);
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }
});

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

const listRepozitories = data => {
  let temp = '';
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
              <li class="shell__body-element">edited: ${lastUpdate}</li>
              <li class="shell__body-element">description: ${description ? description : 'No description for this project'}</li>
            </ul>
          </div>
    `;
  }
  repository.innerHTML = temp;
};
