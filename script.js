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

// we are making them global variables because we have to use them out of the scopes of their functions
let map, mapEvent;

// let's get the current coordinates of user
const successCallBack = function(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude
  // google map link for current location
  console.log(`https://www.google.de/maps/dir///@${latitude},${longitude},14z`)
  // Now, this is what we want to happen after getting coordinates (create a map and add out Coordinates in it.
  map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


  // add event handler to map to get marker when we click on map
  map.on('click', function(mapE) {
    mapEvent = mapE // we assigned mapE to mapEvent so that we can later access it out of its scope
    form.classList.remove('hidden')
    inputDistance.focus()
  })
}
const errorCallBack = function() {
  alert("Could not get your location")
}
// let's call the input functions in "geolocation function"
navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack)

form.addEventListener('submit', function(e) {
  e.preventDefault()
  // Clear input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
  // marker for our clicked location
   const {lat, lng} = mapEvent.latlng;
   L.marker([lat, lng])
     .addTo(map)
     .bindPopup(
       L.popup({
       maxWidth: 250,
       minWidth: 100,
       autoClose: false,
       closeOnClick: false,
       className: 'running-popup'
     })
     )
     .setPopupContent('Workout')
     .openPopup();
})

inputType.addEventListener('change', function(){
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})


















