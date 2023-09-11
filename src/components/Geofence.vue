<template>
  <div style="display:flex; flex-direction:column; height:100vh;width:100%;">
    <div style="display:flex;  width:100%; height: 100vh;">
      <div class="geofenceMapStyle" id="maps">
      </div>
      <div class="geofenceSettings">
        <div class="container">

          <div style="margin-top:3%">
            <p class="pStyle"> FENCE PARAMETERS SETTINGS</p>
          </div>

          <div class="card">
            <h2 class="title">Fence Type</h2>
            <div class="radio-group">
              <input type="radio" id="polygon" name="fenceType" value="polygon" checked>
              <label for="polygon"> Polygon </label>

              <input type="radio" id="circular" name="fenceType" value="circular">
              <label for="circular"> Circular</label>

            </div>
          </div>

          <div class="card">
            <h2 class="title"> Circular fence radius (between 5 and 50):</h2>
            <input type="number" id="fenceRadius" name="fenceRadius" min="5" max="35">
            <button class="submitButton" @click="fenceRadiusSubmitted"> Submit </button>
          </div>

          <div class="card">
            <h2 class="title">On fence breaching...</h2>
            <div class="radio-group">
              <input type="radio" id="1" name="fenceAction" value="1" checked>
              <label for="1"> Report Only</label>

              <input type="radio" id="2" name="fenceAction" value="2">
              <label for="2"> ReturnToLaunch or Land</label>

              <input type="radio" id="3" name="fenceAction" value="3">
              <label for="3"> Always Land</label>

              <input type="radio" id="4" name="fenceAction" value="4">
              <label for="4"> Brake or Land</label>

            </div>
          </div>

          <div class="card">
            <h2 class="title"> Maximum fence altitude (between 5 and 15):</h2>
            <input type="number" id="fenceAltitude" name="fenceAltitude" min="5" max="15">
            <button class="submitButton" @click="fenceMaxAltSubmitted"> Submit </button>
          </div>

        </div>
      </div>
    </div>

    <div class="buttonsCard">
      <div class="fenceToggle">
        <div class="toggle-button-cover">
          <p style=" margin-top: 2%;" class="pStyle1"> FENCE ENABLED?</p>
          <div class="button-cover">
            <div class="button r" id="toggleFenceStyle">
              <input type="checkbox" class="checkbox" id="toggleFenceEnable" @click="fenceEnable()" />
              <div class="knobs"></div>
              <div class="layer"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="fenceButtons">
        <button class="game-button" @click="clear()"> Clear </button>
        <button class="game-button" @click="createGeofence()"> Create Geofence </button>
      </div>
    </div>
  </div>
</template>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<script>
import { ref, inject, onMounted } from "vue";
import leaflet from 'leaflet' // para instalar -> (npm install --save leaflet)
import markerImageRed from "@/assets/marker.png";
import markerImageGreen from "@/assets/greenMarker.png"
import "leaflet/dist/leaflet.css"
import Swal from 'sweetalert2';
import homeImage from "@/assets/home.png";


export default {


  setup() {
    const client = inject('mqttClient');
    const emitter = inject('emitter');

    let maps;
    let count = 0;
    let contador = 1;
    let waypoints = ref([]);
    let popup = leaflet.popup();
    let tmpLine = undefined;
    let lineAppear = ref(true);

    let homeLatitude = ref(undefined);
    let homeLongitude = ref(undefined);
    let fEnable = ref('0');
    let fenceType = ref('5')
    let fenceAction = ref('0')
    let fenceTypeSA = ref('Polygon')
    let fenceActionSA = ref('Report Only')
    let fenceRadius = ref('10')
    let fenceAltMax = ref('15')
    let fenceData = ref([]);
    var fp
    var circle
    let circleCenterPoint = ref('undefined')
    var polygon

    emitter.on('homeLatitude', (hLatitude) => {
      homeLatitude.value = hLatitude;
    })
    emitter.on('homeLongitude', (hLongitude) => {
      homeLongitude.value = hLongitude;
    })

    var iconOptionsRed = {
      iconUrl: markerImageRed,
      iconSize: [25, 40]
    }
    var markerIconRed = leaflet.icon(iconOptionsRed);

    var iconOptionsGreen = {
      iconUrl: markerImageGreen,
      iconSize: [25, 40]
    }
    var markerIconGreen = leaflet.icon(iconOptionsGreen);

    var markerOptionsRed = {
      icon: markerIconRed,
      draggable: true,
    }

    var markerOptionsGreen = {
      icon: markerIconGreen,
      draggable: true,
    }
    //
    // Marker with Home Icon
    //
    var iconOptionsHome = {
      iconUrl: homeImage,
      iconSize: [25, 40]
    }
    var markerIconHome = leaflet.icon(iconOptionsHome);

    var markerOptionsHome = {
      icon: markerIconHome,
      draggable: false,
    }


    onMounted(() => {
      client.publish('dashBoard/autopilotService/fenceEnable', '1');
      let token = "pk.eyJ1IjoiamFza2llIiwiYSI6ImNsajlzZWZkMTFzZzkzZnFua2d6amU5d3IifQ.lk4FtMWmJs1Lk1gKtV292w"
      maps = leaflet.map('maps').setView([41.276486, 1.9886], 19);
      leaflet.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=' + token,
        {
          maxZoom: 23,
          attribution: 'Mapbox'
        }).addTo(maps);
      maps.on('click', onMapClick);
      maps.on('mousemove', onMapOver);
      maps.on('contextmenu', onRightClick);
    })

    function onMapClick(e) {
      getFenceType();
      console.log(e.latlng)

      // Clear any existing circles
      if (circle) {
        maps.removeLayer(circle);
      }
      if (fp) {
        maps.removeLayer(fp);
      }

      if (fenceType.value == '5') {
        lineAppear.value = true;
        count = count + 1;

        waypoints.value.push(e.latlng);
        console.log("Lista de waypoints:", waypoints.value)

        if (waypoints.value.length > 1)
          leaflet.polyline(waypoints.value, { color: 'red' }).addTo(maps);
        let wp = leaflet.marker(e.latlng, markerOptionsRed, { draggable: 'true' }).addTo(maps).bindTooltip(count.toString(), {
          permanent: true,
          //direction: 'center',
          className: "my_labels"
        });
      }
      if (fenceType.value == '7') {
        if (polygon) {
          clear();
        }

        circleCenterPoint.value = leaflet.latLng(homeLatitude.value, homeLongitude.value);
        console.log("Como se ven el e.latlng: ", e.latlng)
        // Create a circle with the clicked location as the center
        circle = leaflet.circle(circleCenterPoint.value, {
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.2,
          radius: fenceRadius.value
        }).addTo(maps);
      }
    }

    function onMapOver(e) {
      let homeMarker = leaflet.marker([homeLatitude.value, homeLongitude.value], markerOptionsHome).addTo(maps);
      if (fenceType.value == '5') {
        if (count > 0) {
          let last = waypoints.value[waypoints.value.length - 1];
          let distance = last.distanceTo(e.latlng).toFixed(0) / 1;

          if (lineAppear.value == true) {
            if (tmpLine != undefined) {
              tmpLine.remove(maps)
            }
            tmpLine = leaflet.polyline([last, e.latlng], { color: 'red' }).addTo(maps);
          }
        }
        if (lineAppear.value == false) {
          popup.closePopup();
        }
      }
    }
    function onRightClick(e) {
      if (fenceType.value == '5') {
        let last = waypoints.value[waypoints.value.length - 1];
        let first = waypoints.value[0];

        if (tmpLine != undefined) {
          tmpLine.remove(maps)
        }
        tmpLine = leaflet.polyline([last, first], { color: 'green' }).addTo(maps);
        leaflet.polyline(waypoints.value, { color: 'green' }).addTo(maps);
        lineAppear.value = false;

        polygon = leaflet.polygon(waypoints.value, { color: 'green', fillColor: 'green', fillOpacity: 0.2 }).addTo(maps);

        // Remove red markers
        waypoints.value.forEach(wp => {
          maps.removeLayer(wp);
        });

        contador = 1;
        waypoints.value.forEach(wp => {

          leaflet.marker(wp, markerOptionsGreen, { draggable: 'true' }).addTo(maps).bindTooltip(contador.toString(), {
            permanent: true,
            className: "my_labels"
          });
          contador++;
        });
      }
    }

    function clear() {
      count = 0;
      contador = 1;
      waypoints.value = [];
      maps.eachLayer((layer) => {
        if (layer['_latlng'] != undefined)
          layer.remove();
        if (layer['_path'] != undefined)
          layer.remove();
      });
    }

    function createGeofence() {
      getFenceType();
      getFenceAction();

      fenceData.value = [];
      fenceData.value.push(fenceType.value);
      fenceData.value.push(fenceAction.value);
      fenceData.value.push(fenceAltMax.value);
      fenceData.value.push(fenceRadius.value);


      if (fenceType.value == '5') {
        if (waypoints.value.length >= 2) {
          console.log("Geofence CIRCULAR creado correctamente");
          fenceData.value.push(waypoints.value);
          let data = JSON.stringify(fenceData.value);


          Swal.fire({
            title: 'Are you sure you want to create the Geofence with these parameters:',
            html: "Fence Type: " + fenceTypeSA.value +
              "<br> Fence Action: " + fenceActionSA.value +
              "<br> Fence Radius (in case of Circular fence)): " + fenceRadius.value +
              "<br> Fence Maximum Altitude: " + fenceAltMax.value,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0BDA51',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create it!'
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('JSON que enviamos en CREATE GEOFENCE:', data);
              client.publish('dashBoard/autopilotService/polygonalGeofence', data);
              emitter.emit('fenceType', fenceType.value);
              if (fenceType.value == '5') {
                emitter.emit('fencePoints', waypoints.value);       // To draw the Polygonal Fence in the other component.
              }
              if (fenceType.value == '7') {
                emitter.emit('fenceRadius', fenceRadius.value);     // To draw the Polygonal Fence in the other component.
                emitter.emit('circleCP', circleCenterPoint.value);  // To draw the Polygonal Fence in the other component.
              }
              Swal.fire(
                'Geofence created!',
                'Your geofence has been created successfully.',
                'success'
              )
            }
          })
        }
        else {
          console.log("No se ha podido crear el Geofence Poligonal.");
          Swal.fire({
            icon: 'error',
            title: 'You cannot create a POLYGONAL geofence with less than 3 waypoints!',
            text: 'Please check if the Fence Type that you selected and the Fence drawn in the map match each other!'
          })
        }

      }

      if (fenceType.value == '7') {
        if (waypoints.value.length == 0) {
          console.log("Geofence CIRCULAR creado correctamente");
          fenceData.value.push(circleCenterPoint.value);
          let data = JSON.stringify(fenceData.value);

          Swal.fire({
            title: 'Are you sure you want to create the Geofence with these parameters:',
            html: "Fence Type: " + fenceTypeSA.value +
              "<br> Fence Action: " + fenceActionSA.value +
              "<br> Fence Radius (in case of Circular fence)): " + fenceRadius.value +
              "<br> Fence Maximum Altitude: " + fenceAltMax.value,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0BDA51',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create it!'
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('JSON que enviamos en CREATE GEOFENCE:', data);
              client.publish('dashBoard/autopilotService/circularGeofence', data);
              emitter.emit('fenceType', fenceType.value);
              if (fenceType.value == '5') {
                emitter.emit('fencePoints', waypoints.value);       // To draw the Circular Fence in the other component.
              }
              if (fenceType.value == '7') {
                emitter.emit('fenceRadius', fenceRadius.value);     // To draw the Circular Fence in the other component.
                emitter.emit('circleCP', circleCenterPoint.value);  // To draw the Circular Fence in the other component.
              }

              Swal.fire(
                'Geofence created!',
                'Your geofence has been created successfully.',
                'success'
              )
            }
          })
        }
        else {
          console.log("No se ha podido crear el Geofence circular.");
          console.log("Waypoints value: ", waypoints.value)
          Swal.fire({
            icon: 'error',
            title: 'You cannot create a CIRCULAR geofence with polygonal shape!',
            text: 'Please check if the Fence Type that you selected and the Fence drawn in the map match each other!'
          })
        }
      }
    }

    function fenceEnable() {
      fEnable.value = !fEnable.value;
      console.log("Fence Enable Value: ", fEnable.value)

      if (fEnable.value == true) {
        client.publish('dashBoard/autopilotService/fenceEnable', '1');
      }
      else if (fEnable.value == false) {
        client.publish('dashBoard/autopilotService/fenceEnable', '0');
      }
    }

    function getFenceType() {
      const fenceTypeRB = document.querySelectorAll('.radio-group input[name="fenceType"]');

      fenceTypeRB.forEach((radioButton) => {
        if (radioButton.checked) {
          if (radioButton.value == 'polygon') {
            //clear();
            fenceType.value = '5';
            fenceTypeSA.value = 'Polygon';
          }
          if (radioButton.value == 'circular') {
            fenceType.value = '7';
            fenceTypeSA.value = 'Circular';
          }
        }
      });
      console.log("FenceType Value", fenceType.value)
    }

    function getFenceAction() {
      const fenceActionRB = document.querySelectorAll('.radio-group input[name="fenceAction"]');

      fenceActionRB.forEach((radioButton) => {
        if (radioButton.checked) {
          if (radioButton.value == '1') {
            fenceAction.value = '1';
            fenceActionSA.value = 'Report Only';
            console.log("FenceAction: Report Only");
          }
          if (radioButton.value == '2') {
            fenceAction.value = '2';
            fenceActionSA.value = 'ReturnToLaunch or Land';
            console.log("FenceAction: ReturnToLaunch or Land");
          }
          if (radioButton.value == '3') {
            fenceAction.value = '3';
            fenceActionSA.value = 'Always Land';
            console.log("FenceAction: Always Land");
          }
          if (radioButton.value == '4') {
            fenceAction.value = '4';
            fenceActionSA.value = 'Brake or Land';
            console.log("FenceAction: Brake or Land");
          }
        }
      });
      console.log("FenceAction Value", fenceAction.value)
    }

    function fenceRadiusSubmitted() {
      const fenceRadiusInput = document.getElementById('fenceRadius');
      const fenceRadiusValue = parseInt(fenceRadiusInput.value, 10); // With 'parseInt' we ensure that we are working with an integer

      if (fenceRadiusValue >= 5 && fenceRadiusValue <= 35) {

        console.log('Value submitted with value = ', fenceRadiusValue);
        fenceRadius.value = fenceRadiusValue;
        Swal.fire(
          'Your fence radius value has been configured successfully!',
          '',
          'success'
        )
      }
      else {
        Swal.fire(
          "Drone's altitude must be between 5 and 20!",
          'Please enter an altitude value that is within the margin established.',
          'error'
        )
      }
    }

    function fenceMaxAltSubmitted() {
      const fenceAltitudeInput = document.getElementById('fenceAltitude');
      const fenceAltitudeValue = parseInt(fenceAltitudeInput.value, 10); // With 'parseInt' we ensure that we are working with an integer

      if (fenceAltitudeValue >= 5 && fenceAltitudeValue <= 15) {

        console.log('Value submitted with value = ', fenceAltitudeValue);
        fenceAltMax.value = fenceAltitudeValue;
        Swal.fire(
          'Your fence maximum altitude value has been configured successfully!',
          '',
          'success'
        )
      }
      else {
        Swal.fire(
          "Drone's altitude must be between 5 and 15!",
          'Please enter an altitude value that is within the margin established.',
          'error'
        )
      }
    }

    return {
      maps,
      onMapClick,
      onMapOver,
      waypoints,
      clear,
      createGeofence,
      fenceRadiusSubmitted,
      fenceMaxAltSubmitted,
      fenceEnable,
      homeLatitude,
      homeLongitude,
    }
  }
}
</script>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<style scoped>
/* ============= Global ============= */
* {
  font-family: "Ubuntu", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* --blue: #2a2185; */
  --green: #2ECC71;
  --blue: #1D7DE8;
  --white: #fff;
  --gray: #f5f5f5;
  --black1: #222;
  --black2: #999;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

.pStyle {
  color: gray;
  font-weight: bold;
  font-size: 24px;
}

.pStyle.dark{
  color: white;
}

.pStyle1 {
  color: gray;
  font-weight: bold;
  font-size: 24px;
}

.pStyle1.dark{
  color: white;
}


.fenceToggle {
  width: 50%;
  height: 100%;
  border-color: transparent;
  border-radius: 48%;
  background-color: rgb(52, 52, 52);
  margin-right: 3%;
}

.fenceToggle.dark {
  background-color: var(--blue);
}

.fenceButtons {
  width: 50%;
  height: 100%;
  border-color: transparent;
  border-radius: 48%;
  background-color: rgb(52, 52, 52);
}

.fenceButtons.dark {
  background-color: var(--blue);
}

.geofenceMapStyle {
  width: 68%;
  height: 72%;
  position: relative;
  border-color: transparent;
  border-radius: 56px;
  margin: 2%;
  outline-style: none;
  
}

.geofenceSettings {
  width: 26%;
  height: 87%;
  border-style: solid;
  border-color: transparent;
  border-radius: 8%;
  background-color: #343434;
  margin-top: 2%;
}

.geofenceSettings.dark {
  background-color: var(--blue);
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

.buttonsCard {
  margin-top: -12%;
  align-items: center;
  justify-content: center;
  width: 68%;
  height: 10%;
  margin-left: 2%;
  display: flex;
}

body {
  background-color: #111;
  font-family: 'Poppins', sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 300px;
  background-color: transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
  margin: 5%;
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

input[type="number"] {
  text-align: center;
  font-weight: bold;
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

input[type="radio"]:checked+label:before {
  background-color: #fff;
}

input[type="radio"]:focus+label {
 /*  color: var(--blue); */
 color: var(--green);
}

input[type="radio"]:checked+label {
  /* color: var(--blue); */
  color: var(--green);
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

.toggle-button-cover {
  position: relative;

  height: 140px;
  box-sizing: border-box;
}

.button-cover {
  height: 100px;
}

.button-cover,
.knobs,
.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.button {
  position: relative;
  top: 50%;
  width: 74px;
  height: 36px;
  margin: -20px auto 0 auto;
  overflow: hidden;
}

.button.r,
.button.r .layer {
  border-radius: 100px;
}

.button.b2 {
  border-radius: 2px;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: 0.3s ease all;
  z-index: 1;
}

/* Button 1 */
#toggleFenceStyle .knobs:before {
  content: "YES";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  background-color: #0BDA51;
  border-radius: 50%;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15) all;
}

#toggleFenceStyle .checkbox:checked+.knobs:before {
  content: "NO";
  left: 42px;
  background-color: #f44336;
}

#toggleFenceStyle .checkbox:checked~.layer {
  background-color: #fcebeb;
}

#toggleFenceStyle .knobs,
#toggleFenceStyle .knobs:before,
#toggleFenceStyle .layer {
  transition: 0.3s ease all;
}

/* Button 2 */
#button-2 .knobs:before,
#button-2 .knobs:after {
  content: "YES";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  background-color: #03a9f4;
  border-radius: 50%;
  transition: 0.3s ease all;
}

.game-button {
  width: 68px;
  height: 54px;
  position: relative;
  top: 0;
  cursor: pointer;
  text-decoration: none !important;
  outline: none !important;
  font-family: 'Carter One', sans-serif;
  font-size: 20px;
  line-height: 1.5em;
  letter-spacing: .1em;
  text-shadow: 2px 2px 1px #0066a2, -2px 2px 1px #0066a2, 2px -2px 1px #0066a2, -2px -2px 1px #0066a2, 0px 2px 1px #0066a2, 0px -2px 1px #0066a2, 0px 4px 1px #004a87, 2px 4px 1px #004a87, -2px 4px 1px #004a87;
  border: none;
  margin: 15px 15px 30px;
  background: repeating-linear-gradient(45deg, #3ebbf7, #3ebbf7 5px, #45b1f4 5px, #45b1f4 10px);
  border-bottom: 3px solid rgba(16, 91, 146, 0.5);
  border-top: 3px solid rgba(255, 255, 255, .3);
  color: #fff !important;
  border-radius: 8px;
  padding: 8px 15px 10px;
  box-shadow: 0 6px 0 #266b91, 0 8px 1px 1px rgba(0, 0, 0, .3), 0 10px 0 5px #12517d, 0 12px 0 5px #1a6b9a, 0 15px 0 5px #0c405e, 0 15px 1px 6px rgba(0, 0, 0, .3);
  width: auto;
}

.game-button:hover {
  top: 2px;
  box-shadow: 0 4px 0 #266b91, 0 6px 1px 1px rgba(0, 0, 0, .3), 0 8px 0 5px #12517d, 0 10px 0 5px #1a6b9a, 0 13px 0 5px #0c405e, 0 13px 1px 6px rgba(0, 0, 0, .3);
}

.game-button::before {
  content: '';
  height: 10%;
  position: absolute;
  width: 40%;
  background: #fff;
  right: 13%;
  top: -3%;
  border-radius: 99px;
}

.game-button::after {
  content: '';
  height: 10%;
  position: absolute;
  width: 5%;
  background: #fff;
  right: 5%;
  top: -3%;
  border-radius: 99px;
}

.game-button.orange {
  background: repeating-linear-gradient(45deg, #ffc800, #ffc800 5px, #ffc200 5px, #ffc200 10px);
  box-shadow: 0 6px 0 #b76113, 0 8px 1px 1px rgba(0, 0, 0, .3), 0 10px 0 5px #75421f, 0 12px 0 5px #8a542b, 0 15px 0 5px #593116, 0 15px 1px 6px rgba(0, 0, 0, .3);
  border-bottom: 3px solid rgba(205, 102, 0, 0.5);
  text-shadow: 2px 2px 1px #e78700, -2px 2px 1px #e78700, 2px -2px 1px #e78700, -2px -2px 1px #e78700, 0px 2px 1px #e78700, 0px -2px 1px #e78700, 0px 4px 1px #c96100, 2px 4px 1px #c96100, -2px 4px 1px #c96100;
  width: auto;
}

.game-button.orange:hover {
  top: 2px;
  box-shadow: 0 4px 0 #b76113, 0 6px 1px 1px rgba(0, 0, 0, .3), 0 8px 0 5px #75421f, 0 10px 0 5px #8a542b, 0 13px 0 5px #593116, 0 13px 1px 6px rgba(0, 0, 0, .3);
}
</style>