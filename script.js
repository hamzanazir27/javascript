'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, neighbour = '') {
  const languages = Object.values(data.languages);
  const currencies = Object.values(data.currencies);
  const html = ` <article class="country ${neighbour}">
        <img class="country__img" src=${data.flags.svg} />
        <div class="country__data">
          <h3 class="country__name">${data.name.official}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            data.population / 10_00000
          ).toFixed(1)} million</p>
          <p class="country__row"><span>🗣️</span>${languages[0]}</p>
          <p class="country__row"><span>💰</span>${currencies[0].name}</p>
        </div>
      </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
  console.log(data);
};
// function getCountriesData(country) {
//   let request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);
//     const neighbours = data?.borders;
//     if (!neighbours) return;
//     request = new XMLHttpRequest();
//     request.open(
//       'GET',
//       `https://restcountries.com/v3.1/alpha/${neighbours[0]}`
//     );
//     request.send();

//     request.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       renderCountry(data2, 'neighbour');
//       // console.log(data2);
//     });
//   });
// }

const getCountryAndNeighbour = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(Response => Response.json())
    .then(data => {
      [data] = data;
      renderCountry(data);
      const neighbours = data?.borders;
      if (!neighbours) return;

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbours[0]}`);
    })
    .then(Response => Response.json())
    .then(data => {
      const [data2] = data;
      renderCountry(data2, 'neighbour');
    });
};

getCountryAndNeighbour('england');
