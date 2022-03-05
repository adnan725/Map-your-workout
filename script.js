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


class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition()

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField)
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
        alert("Could not get your location")
      })
  }

  _loadMap(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude
      // google map link for current location
      console.log(`https://www.google.de/maps/dir///@${latitude},${longitude},14z`)
      // Now, this is what we want to happen after getting coordinates (create a map and add out Coordinates in it.
      this.#map = L.map('map').setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);


      // add event handler to map to get marker when we click on map
      this.#map.on('click', this._showForm.bind(this))
  }

  _showForm(mapE) {
    this.#mapEvent = mapE // we assigned mapE to mapEvent so that we can later access it out of its scope
    form.classList.remove('hidden')
    inputDistance.focus()
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  _newWorkout(e) {
    e.preventDefault()
    // Clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
    // marker for our clicked location
    const {lat, lng} = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }

}

const app = new App();




















