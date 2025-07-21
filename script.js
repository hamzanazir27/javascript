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
      console.log(data);

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

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/
// function getCounteyName(lat, lng) {
//   fetch(
//     `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//   )
//     .then(response => {
//       if (!response.ok)
//         throw new Error(`Problem with geocoding ${response.status}`);
//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       const { city, countryName } = data;
//       console.log(`You are in ${city}, ${countryName}`);
//       // retrun[(city, countryName)];
//     })
//     .catch(err => {
//       console.error(`${err} 💥💥💥`);
//       throw err;
//     });
// }

const getFetch = function (url, message = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok)
      throw new Error(`${message} Problem with fetch ${response.status}`);
    return response.json();
  });
};

function whereAmI(lat, lng) {
  getFetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`,
    'Problem with getting location data'
  )
    .then(data => {
      const { countryName } = data;
      return getFetch(
        `https://restcountries.com/v3.1/name/${countryName}`,
        'Problem with getting country data'
      );
    })

    .then(data => {
      [data] = data;
      renderCountry(data);
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      throw err;
    })
    .finally(() => {
      btn.classList.add('hidden');
    });
}

btn.addEventListener('click', function () {
  // getCounteyName(52.508, 13.381);
  whereAmI(52.508, 13.381);
  whereAmI(19.037, 72.873);
  whereAmI(-33.933, 18.474);
  // btn.classList.add('hidden');
  // getCountryAndNeighbour('england');
});
