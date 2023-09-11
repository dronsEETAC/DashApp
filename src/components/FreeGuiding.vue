<template>
  <div style="display:flex; height:63%;width:100%;">
    <div class="videoStreamStyle">
      <VideoStream></VideoStream>
    </div>
    <div class="mapStyle" id="map">
    </div>
  </div>

  <div style="display:flex;height:30%; width:100%">
    <div style="width: 30%;" class="telemetryInfoStyle">
      <div style="width: 50%; margin: 5%;">
        <p class="pTitleStyle"> LATITUDE </p>
        <p class="pValueStyle"> {{ droneLatitude }} </p>
        <p class="pTitleStyle1" style="margin-top: 8%;"> ALTITUDE </p>
        <p class="pValueStyle"> {{ droneAltitude }} m </p>
        <p class="pTitleStyle2" style="margin-top: 8%;"> DRONE STATE </p>
        <p class="pValueStyle"> {{ droneState }} </p>
      </div>
      <div style="width: 50%; margin: 5%;">
        <p class="pTitleStyle3"> LONGITUDE </p>
        <p class="pValueStyle"> {{ droneLongitude }}</p>
        <p class="pTitleStyle4" style="margin-top: 8%;"> GROUND SPEED </p>
        <p class="pValueStyle"> {{ droneGroundSpeed }} m/s</p>
        <p class="pTitleStyle5" style="margin-top: 8%;"> BATTERY LEVEL</p>
        <p class="pValueStyle"> {{ droneBattery }}</p>
      </div>
    </div>

    <div style="width: 25%;" class="droneStateStyle">
      <div style="margin:1%">
        <p class="pDroneStateStyle"> DRONE STATE</p>
      </div>
      <div style="display: flex;">
        <div style="width: 50%; margin: 5%;">
          <button class="stateButton" id="armedDisarmed"> DISARMED </button>
          <button class="stateButton" id="flying"> FLYING </button>
          <button class="stateButton" id="landing"> LANDING </button>
        </div>
        <div style="width: 50%; margin: 5%;">
          <button class="stateButton" id="takingOff"> TAKING OFF </button>
          <button class="stateButton" id="returningHome"> RETURNING HOME </button>
          <button class="stateButton" id="onHearth"> ON EARTH </button>
        </div>
      </div>
    </div>

    <div style="width: 39.33%;" class="Controller">
      <DroneController></DroneController>
    </div>
  </div>
</template>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<script>
import { ref, inject, onMounted } from "vue";
import leaflet from 'leaflet' // para instalar -> (npm install --save leaflet)
import "leaflet/dist/leaflet.css";
import VideoStream from './VideoStream.vue';
import DroneController from './DroneController.vue';
import droneImage from "@/assets/Drone2.png"
import markerImageGreen from "@/assets/greenMarker.png"
import markerImageRed from "@/assets/marker.png";
import homeImage from "@/assets/home.png";


export default {
  components: {
    VideoStream,
    DroneController
  },
  setup() {

    const client = inject('mqttClient');
    const emitter = inject('emitter');

    let map;
    let telemetryInfo = ref(undefined);
    let droneLatitude = ref(41.276486);
    let droneLongitude = ref(1.9886);
    let droneGroundSpeed = ref(undefined);
    let droneAltitude = ref(undefined);
    let droneBattery = ref(undefined);
    let droneState = ref(undefined);
    let homeLatitude = ref(undefined);
    let homeLongitude = ref(undefined);
    let homePosReceived = ref(false);
    let armedDisarmedButton = undefined;
    let flyingButton = undefined;
    let takingOffButton = undefined;
    let returningHomeButton = undefined;
    let landingButton = undefined;
    let onEarthButton = undefined;
    let armed = ref(false);
    let flying = ref(false);
    let fencePoints = ref([]);
    let circleCP = ref(undefined);
    let fenceType = ref(undefined);
    let fenceRadius = ref(undefined);
    let missionWaypoints = ref([]);
    let clearThis = undefined;


    emitter.on('armedBool', (armedBool) => {
      armed.value = armedBool;
    });
    emitter.on('fencePoints', (fPoints) => {
      fencePoints.value = fPoints;
      drawGeofence();
    });
    emitter.on('circleCP', (circleCenterPoint) => {
      circleCP.value = circleCenterPoint;
      drawGeofence();
    });
    emitter.on('fenceType', (fType) => {
      fenceType.value = fType;
    });
    emitter.on('fenceRadius', (fRadius) => {
      fenceRadius.value = fRadius;
    });
    emitter.on('missionWaypoints', (mWaypoints) => {
      missionWaypoints.value = mWaypoints;
      drawMission();
    });


    var iconOptions = {
      iconUrl: droneImage,
      iconSize: [30, 50]
    }
    var droneIcon = leaflet.icon(iconOptions);
    var markerOptions = {
      icon: droneIcon,
      draggable: true,
    }

    var iconOptionsRed = {
      iconUrl: markerImageRed,
      iconSize: [25, 40]
    }
    var markerIconRed = leaflet.icon(iconOptionsRed);

    var markerOptionsRed = {
      icon: markerIconRed,
      draggable: true,
    }

    var iconOptionsGreen = {
      iconUrl: markerImageGreen,
      iconSize: [25, 40]
    }
    var markerIconGreen = leaflet.icon(iconOptionsGreen);

    var markerOptionsGreen = {
      icon: markerIconGreen,
      draggable: true,
    }

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

      armedDisarmedButton = document.getElementById('armedDisarmed');
      flyingButton = document.getElementById('flying');
      takingOffButton = document.getElementById('takingOff');
      returningHomeButton = document.getElementById('returningHome');
      landingButton = document.getElementById('landing');
      onEarthButton = document.getElementById('onHearth');

      client.subscribe("autopilotService/dashBoard/telemetryInfo")
      client.on("message", function (topic, message) {
        if (topic == "autopilotService/dashBoard/telemetryInfo") {
          telemetryInfo.value = message;
          //console.log("Drone Position:", telemetryInfo.value); 

          let telemetryInfoString = ref(undefined);
          //console.log("TelemetryInfo sin decodificar: ", dronePosition);
          telemetryInfoString.value = new TextDecoder("utf-8").decode(telemetryInfo.value);
          /* console.log("TelemetryInfo decodificado: ", telemetryInfoString.value); */

          var telemetryInfoJSON = JSON.parse(telemetryInfoString.value);

          droneLatitude.value = telemetryInfoJSON["lat"];
          emitter.emit('droneLatitude', droneLatitude.value);

          droneLongitude.value = telemetryInfoJSON["lon"];
          emitter.emit('droneLongitude', droneLongitude.value);

          if (homePosReceived.value == false) {
            homeLatitude.value = droneLatitude.value;
            emitter.emit('homeLatitude', homeLatitude.value);
            homeLongitude.value = droneLongitude.value;
            emitter.emit('homeLongitude', homeLongitude.value);
            homePosReceived.value = true;
          }

          /* droneGroundSpeed.value = telemetryInfoJSON["groundSpeed"]; */
          let cut = telemetryInfoJSON["groundSpeed"].toString();
          droneGroundSpeed.value = cut.slice(0, 5);
          emitter.emit('droneGroundSpeed', droneGroundSpeed.value);

          droneAltitude.value = telemetryInfoJSON["altitude"];
          emitter.emit('droneAltitude', droneAltitude.value);

          droneBattery.value = telemetryInfoJSON["battery"];
          droneState.value = telemetryInfoJSON["state"];

          changeState(droneState.value);

          /* console.log("Latitude: ", droneLatitude.value);
          console.log("Longitude: ", droneLongitude.value); */
          markerPosUpdate();
        }
      })
      let token = "pk.eyJ1IjoiamFza2llIiwiYSI6ImNsZmdueGMyMzA1YnozdnJzY2pneHR5ODUifQ.6TxzGOureYxRZITNJPVQFw"

      map = leaflet.map('map').setView([41.276486, 1.9886], 18);
      leaflet.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=' + token, {
        maxZoom: 23,
        attribution: 'Mapbox'
      }).addTo(map);


      let marker = null;
      let markerPosUpdate = () => {
        if (marker) {
          marker.remove(); // para eliminar el marcador existente y que así no solapen todos en el mapa
        }
        marker = leaflet.marker([droneLatitude.value, droneLongitude.value], markerOptions).addTo(map);
        let homeMarker = leaflet.marker([homeLatitude.value, homeLongitude.value], markerOptionsHome).addTo(map);
      };

    })

    function changeState(state) {
      if (state == "armed") {
        armed.value = true;
        emitter.emit('armedBool', armed.value);

        armedDisarmedButton.innerHTML = 'ARMED';
        armedDisarmedButton.classList.remove('disarmed', 'arming');
        armedDisarmedButton.classList.add('armed');
      }
      if (state == "arming") {
        armedDisarmedButton.innerHTML = 'ARMING';
        armedDisarmedButton.classList.remove('disarmed', 'armed');
        armedDisarmedButton.classList.add('arming');
      }
      /*      if(state != "armed"){
             armedDisarmedButton.innerHTML = 'DISARMED';
             armedDisarmedButton.classList.remove('armed','arming');
             armedDisarmedButton.classList.add('disarmed');
           } */
      if (state == "disarmed") {
        armedDisarmedButton.innerHTML = 'DISARMED';
        armedDisarmedButton.classList.remove('armed', 'arming');
        armedDisarmedButton.classList.add('disarmed');
      }
      if (state == 'takingOff') {
        onEarthButton.classList.remove('Green');
        landingButton.classList.remove('Green');
        takingOffButton.classList.add('Green');
      }
      if (state == 'flying') {
        flying.value = true;
        emitter.emit('flyingBool', flying.value);

        onEarthButton.classList.remove('Green');
        takingOffButton.classList.remove('Green');
        flyingButton.classList.add('Green');
      }
      if (state == 'landing') {
        flying.value = false;
        emitter.emit('flyingBool', flying.value);

        onEarthButton.classList.remove('Green');
        landingButton.classList.add('Green');
      }
      if (state == 'returningHome') {
        flying.value = false;
        emitter.emit('flyingBool', flying.value);

        onEarthButton.classList.remove('Green');
        returningHomeButton.classList.add('Green');
      }
      if (state == 'onHearth') {
        armed.value = false;
        flying.value = false;
        emitter.emit('armedBool', armed.value);
        emitter.emit('flyingBool', flying.value);

        onEarthButton.classList.add('Green');
        returningHomeButton.classList.remove('Green');
        landingButton.classList.remove('Green');
        flyingButton.classList.remove('Green');
        takingOffButton.classList.remove('Green');
        armedDisarmedButton.classList.remove('armed');
        armedDisarmedButton.classList.add('disarmed');
      }
    }

    function drawGeofence() {
      console.log("ENTRA DRAW GEOFENCE")
      map.eachLayer((layer) => {
        if (layer['_latlng'] != undefined)
          layer.remove();
        if (layer['_path'] != undefined)
          layer.remove();
      });

      if (fenceType.value == '5') {
        for (let i = 0; i < fencePoints.value.length; i++) {
          console.log("Entra dentro el FOR de DrawGeofence");
          console.log("Fence point: ", fencePoints.value[i]);
          leaflet.marker(fencePoints.value[i], markerOptionsGreen).addTo(map);
        }

        let last = fencePoints.value[fencePoints.value.length - 1];
        let first = fencePoints.value[0];
        leaflet.polyline([last, first], { color: 'green' }).addTo(map);
        leaflet.polyline(fencePoints.value, { color: 'green' }).addTo(map);

        let polygon = leaflet.polygon(fencePoints.value, { color: 'green', fillColor: 'green', fillOpacity: 0.2 }).addTo(map);
      }
      if (fenceType.value == '7') {
        console.log("Entraaa")
        console.log(circleCP.value)
        //let fp = leaflet.marker(circleCP.value, markerOptionsGreen, { draggable: 'true' }).addTo(map);

        // Create a circle with the clicked location as the center
        let circle = leaflet.circle(circleCP.value, {
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.2,
          radius: fenceRadius.value
        }).addTo(map);
      }
    }

    function drawMission() {
      console.log("ENTRA DRAW MISSION WAYPOINTS")
      map.eachLayer((layer) => {
        if (layer['_latlng'] != undefined)
          layer.remove();
        if (layer['_path'] != undefined)
          layer.remove();
      });

      for (let i = 0; i < missionWaypoints.value.length; i++) {
        //console.log("Mission Waypoint: ", fencePoints.value[i]);
        //leaflet.marker(missionWaypoints.value[i], markerOptionsGreen).addTo(map);
        leaflet.marker(missionWaypoints.value[i], markerOptionsGreen, { draggable: 'false' }).addTo(map).bindTooltip(i.toString(), {
          permanent: true,
          className: "my_labels"
        });
      }

      let last = missionWaypoints.value[missionWaypoints.value.length - 1];
      let first = missionWaypoints.value[0];
      leaflet.polyline(missionWaypoints.value, { color: 'green' }).addTo(map);
    }


    return {
      map,
      droneAltitude,
      droneBattery,
      droneGroundSpeed,
      droneLatitude,
      droneLongitude,
      droneState,
      homeLatitude,
      homeLongitude,
      homePosReceived,
      changeState,
      drawGeofence,
      drawMission,
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

.my-labels {
  background-color: yellow;
}

.videoStreamStyle {
  width: 38%;
  border-style: solid;
  border-color: transparent;
  border-radius: 10%;
  background-color: #343434;
  margin: 2%;
  margin-right: 1%;
  display: flex;
}

.videoStreamStyle.dark {
  background: var(--blue);
}

.Controller {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

.telemetryInfoStyle {
  display: flex;
  width: 28%;
  height: 86%;
  margin-left: 2%;
  margin-bottom: 2%;
  margin-right: 2%;
  border-color: transparent;
  border-radius: 14%;
  background-color: #343434;
}

.telemetryInfoStyle.dark {
  background: var(--blue);
}


.mapStyle {
  width: 54%;
  position: relative;
  border-color: transparent;
  border-radius: 56px;
  margin: 2%;
  outline-style: none;
}

.droneStateStyle {
  display: flex;
  flex-direction: column;
  width: 28%;
  height: 86%;
  margin-bottom: 2%;
  margin-right: 2%;
  border-color: transparent;
  border-radius: 14%;
  background-color: #343434;
}

.droneStateStyle.dark {
  background: var(--blue);
}

.pTitleStyle {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pTitleStyle.dark {
  color: white;
}

.pTitleStyle1 {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pTitleStyle1.dark {
  color: white;
}

.pTitleStyle2 {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pTitleStyle2.dark {
  color: white;
}

.pTitleStyle3 {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pTitleStyle3.dark {
  color: white;
}

.pTitleStyle4 {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pTitleStyle4.dark {
  color: white;
}

.pTitleStyle5 {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pTitleStyle5.dark {
  color: white;
}

.pDroneStateStyle {
  color: gray;
  font-weight: bold;
  font-size: 20px;
}

.pDroneStateStyle.dark {
  color: white;
}

.pValueStyle {
  color: white;
  font-weight: bold;
  font-size: 33px;
  margin-top: 2%;
}

.stateButton.armed {
  background-color: green;
  color: white;
}

.stateButton.arming {
  background-color: orange;
  color: white;
}

.stateButton.disarmed {
  background-color: red;
  color: white;
}

.stateButton.Red {
  background-color: red;
  color: white;
}

.stateButton.Green {
  background-color: green;
  color: white;
}

.stateButton {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: .3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 160px;
  text-transform: uppercase;
  white-space: normal;
  font-weight: 700;
  text-align: center;
  padding: 11px 3px;
  color: #fff;
  background-color: red;
  height: 48px;
  margin: 3%;
}</style>