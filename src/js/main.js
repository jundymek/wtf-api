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
    fetch(`https://api.github.com/users/${inputValue.value}/repos`)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp.message)
        data(resp);
      })
      .catch((error) => {
        console.log(error)
        if (error.message.includes("Not Found")) {
          console.log('aaa')
        }
      });
  }
});

const data = data => {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const name = data[i]["name"];
    const path = data[i]["url"];
    const creationTime = data[i]["created_at"].slice(0, 10);
    const lastUpdate = data[i]["updated_at"].slice(0, 10);
    const description = data[i]["description"];
    repository.innerHTML += `
          <div class="shell">
            <div class="shell__top-bar">${i + 1}. $${name}</div>
            <div class="shell__button shell__button--left"></div>
            <div class="shell__button shell__button--middle"></div>
            <div class="shell__button shell__button--right"></div>
            <ul class="shell__body">
              <li class="shell__body-element">path: <a href="${path}">${path}</a></li>
              <li class="shell__body-element">created:  ${creationTime}</li>
              <li class="shell__body-element">edited: ${lastUpdate}</li>
              <li class="shell__body-element">description: ${description ? description : 'No description for this project'}</li>
            </ul>
          </div>
    `;
  }
};
