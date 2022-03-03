'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// let's get the current coordinates of user
const successCallBack = function(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude
  // google map link for current location
  console.log(`https://www.google.de/maps/dir///@${latitude},${longitude},14z`)
  // Now, this is what we want to happen after getting coordinates (create a map and add out Coordinates in it.
  const map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

  // marker for our current location
  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customisable')
    .openPopup();
}
const errorCallBack = function() {
  alert("Could not get your location")
}
// let's call the input functions in "geolocation function"
navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack)