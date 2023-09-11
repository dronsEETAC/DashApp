<template>
  <div style="width:100%; height: 100vh; display: grid; place-items: center;">
    <div class="settingsStyle">

      <div style="margin:1%; color: ;">
        <p class="pStyle2"> DRONE'S PRE-CONFIGURATION PARAMETERS</p>
      </div>

      <div class="card">
        <h2 class="title"> Configure the Take-Off altitude (between 5 and 10):</h2>
        <input type="number" id="takeOffAltitude" name="takeOffAltitude" min="5" max="10">
        <button class="submitButton" @click="takeOffSubmitted"> Submit </button>
      </div>

      <div class="card">
        <h2 class="title"> Configure drone's Ground Speed in m/s (between 1 and 5):</h2>
        <input type="number" id="groundSpeed" name="groundSpeed" min="1" max="5">
        <button class="submitButton" @click="groundSpeedSubmitted"> Submit </button>
      </div>

      <div class="card">
        <h2 class="title"> Configure RTL maximum altitude (between 5 and 10):</h2>
        <input type="number" id="RTLAltitude" name="RTLAltitude" min="5" max="10">
        <button class="submitButton" @click="RTLAltitudeSubmitted"> Submit </button>
      </div>

      <div class="card">
        <h2 class="title"> Configure drone's RTL Ground Speed in m/s (between 1 and 5):</h2>
        <input type="number" id="RTLSpeed" name="RTLSpeed" min="1" max="5">
        <button class="submitButton" @click="RTLSpeedSubmitted"> Submit </button>
      </div>
    </div>
  </div>
</template>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<script>
import { ref, inject, onMounted } from "vue";
import Swal from 'sweetalert2';

export default {
  components: {

  },

  setup() {
    const emitter = inject('emitter');
    let takeOffMaxAltitude = ref(5);
    emitter.emit('setTakeOffAltitude', "5");
    let groundSpeed = ref(1);
    emitter.emit('setGroundSpeed', "1");
    let RTLALtitude = ref(1000);
    emitter.emit('setRTLAltitude', "1000");
    let RTLSpeed = ref(200);
    emitter.emit('setRTLSpeed', "200");


    function takeOffSubmitted() {
      const quantityInput = document.getElementById('takeOffAltitude');
      const quantityValue = parseInt(quantityInput.value, 10); // With 'parseInt' we ensure that we are working with an integer

      if (quantityValue >= 5 && quantityValue <= 10) {

        console.log('Value submitted with value = ', quantityValue);
        takeOffMaxAltitude.value = quantityValue;
        emitter.emit('setTakeOffAltitude', takeOffMaxAltitude.value);
        console.log('altitude value dentro de buttonclicked: ', takeOffMaxAltitude.value);
        Swal.fire(
          'Your altitude value have been configured correctly!',
          '',
          'success'
        )
      }
      else {
        console.log('Quantity should be between 1 and 5');
        Swal.fire(
          "Drone's altitude must be between 5 and 10!",
          'Please enter an altitude value that is within the margin established.',
          'error'
        )
      }
    }

    function groundSpeedSubmitted() {
      console.log("Entra en la función de GroundSpeed")
      const quantityInput = document.getElementById('groundSpeed');
      const quantityValue = parseInt(quantityInput.value, 10); // With 'parseInt' we ensure that we are working with an integer

      if (quantityValue >= 1 && quantityValue <= 5) {
        console.log('Value submitted with value = ', quantityValue);
        groundSpeed.value = quantityValue;
        emitter.emit('setGroundSpeed', groundSpeed.value);
        Swal.fire(
          "Drone's GroundSpeed has been configured correctly!",
          '',
          'success'
        )
      }
      else {
        console.log('Quantity should be between 1 and 5');
        Swal.fire(
          "Drone's GroundSpeed must be between 1 and 5!",
          'Please enter an altitude value that is within the margin established.',
          'error'
        )
      }
    }

    function RTLAltitudeSubmitted() {
      console.log("Entra en la función de RTLAlttiudeSubmitted")
      let quantityInput = document.getElementById('RTLAltitude');
      let quantityValue = parseInt(quantityInput.value, 10) * 100; // With 'parseInt' we ensure that we are working with an integer
      console.log("Quantity Input value", quantityValue);

      if (quantityValue >= 500 && quantityValue <= 1000) {
        console.log('Value submitted with value = ', quantityValue);
        RTLALtitude.value = quantityValue;
        emitter.emit('setRTLAltitude', RTLALtitude.value);
        Swal.fire(
          "RTL Altitude has been configured correctly!",
          '',
          'success'
        )
      }
      else {
        console.log('Quantity should be between 5 and 10');
        Swal.fire(
          "RTL Altitude must be between 5 and 10!",
          'Please enter an altitude value that is within the margin established.',
          'error'
        )
      }
    }

    function RTLSpeedSubmitted() {
      console.log("Entra en la función de RTLSpeedSubmitted")
      let quantityInput = document.getElementById('RTLSpeed');
      let quantityValue = parseInt(quantityInput.value, 10) * 100; // With 'parseInt' we ensure that we are working with an integer
      console.log("Quantity Input value", quantityValue);

      if (quantityValue >= 200 && quantityValue <= 1000) {
        console.log('Value submitted with value = ', quantityValue);
        RTLSpeed.value = quantityValue;
        emitter.emit('setRTLSpeed', RTLSpeed.value);
        Swal.fire(
          "RTL Ground Speed has been configured correctly!",
          '',
          'success'
        )
      }
      else {
        console.log('Quantity should be between 2 and 10');
        Swal.fire(
          "RTL Ground Speed must be between 2 and 10!",
          'Please enter an altitude value that is within the margin established.',
          'error'
        )
      }
    }
    return {
      takeOffSubmitted,
      groundSpeedSubmitted,
      RTLAltitudeSubmitted,
      RTLSpeedSubmitted,
    }
  }
}
</script>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<style scoped>
:root {
  /* --blue: #2a2185; */
  --blue: #1D7DE8;
  --white: #fff;
  --gray: #f5f5f5;
  --black1: #222;
  --black2: #999;
}

.settingsStyle {
  width: 40%;
  height: 81%;
  border-style: solid;
  border-color: transparent;
  border-radius: 8%;
  background-color: #343434;
}

.submitButton {
  background-color: var(--green);
  color: white;
  font-weight: bold;
  width: 25%;
  height: 21px;
  margin-left: 4%;
  border-radius: 20%;
}

.pStyle2 {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pStyle2.dark{
  color: white;
}

.settingsStyle.dark {
  background: var(--blue);
}

h {
  color: white;
}

label {
  color: white;
}

.card {
  width: 92%;
  background-color: transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
  margin: 4%;
}

.title {
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input[type="radio"] {
  display: none;
}

label {
  position: relative;
  padding-left: 30px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
}

label:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #fff;
  transition: background-color 0.3s;
}

input[type="number"] {
  text-align: center;
  font-weight: bold;
}

input[type="radio"]:checked+label:before {
  background-color: #fff;
}

input[type="radio"]:focus+label {
  color: var(--blue);
}

input[type="radio"]:checked+label {
  color: var(--blue);
}

/* Neon Style */
input[type="radio"]+label:before {
  /* box-shadow: 0 0 10px var(--blue); */
  box-shadow: 0 0 10px var(--green);
}

input[type="radio"]:checked+label:before {
  /* box-shadow: 0 0 10px var(--blue), 0 0 20px var(--blue), 0 0 30px var(--blue); */
  box-shadow: 0 0 10px var(--green), 0 0 20px var(--green), 0 0 30px var(--green);
}

input[type="radio"]:hover+label:before {
  /* background-color: var(--blue); */
  background-color: var(--green);
}

input[type="radio"]:focus+label:before {
  /* background-color: var(--blue); */
  background-color: var(--green);
}

@media (max-width: 480px) {
  .card {
    width: 90%;
  }
}
</style>