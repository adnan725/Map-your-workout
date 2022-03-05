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


class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10)
  constructor(coords, distance, duration) {
    this.coords = coords;   // array of coords i.e [lat, lng]
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running'
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace()
  }
  calcPace() {
    this.Pace = this.duration / this.distance
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed()
  }
  calcSpeed() {
    this.Speed = this.distance / (this.duration / 60)
  }
}



class App {
  #map;
  #mapEvent;
  #workouts = [];
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
    // 'every() methods returns a TRUE only when all values are true'
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every(inp => inp > 0)
    e.preventDefault()

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const {lat, lng} = this.#mapEvent.latlng;
    let workout;

    // If workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // check if data is valid
      if (
       // !Number.isFinite(distance) ||
       // !Number.isFinite(duration) ||
       // !Number.isFinite(cadence)
        !validInputs(distance,  duration, cadence) || !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!')

      workout = new Running([lat, lng], distance, duration, cadence);

    }

    // If workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // check if data is valid
      if (
        !validInputs(distance,  duration, elevation) || !allPositive(distance, duration) // elevation could be negative
      )
        return alert('Inputs have to be positive numbers!')

      workout = new Cycling([lat, lng], distance, duration, elevation);

    }

    // add new object to workout array
    this.#workouts.push(workout)
    console.log(workout);

    // render workout on map as marker
    this.renderWorkoutMarker(workout)

    // render workout on list

    // hide form + clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();




















