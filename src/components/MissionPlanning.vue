<template>
  <div style="display:flex; flex-direction:column; height:100vh;width:100%;">
    <div style="display:flex;  width:100%;">
      <div class="planTelemetryStyle">
        <div style="width: 50%; margin: 5%;">
          <p class="pTitleStyle"> LATITUDE </p>
          <p class="pValueStyle"> {{ droneLatitude }} </p>
          <p class="pTitleStyle" style="margin-top: 8%;"> ALTITUDE </p>
          <p class="pValueStyle"> {{ droneAltitude }} m </p>
        </div>
        <div style="width: 50%; margin: 5%;">
          <p class="pTitleStyle"> LONGITUDE </p>
          <p class="pValueStyle"> {{ droneLongitude }}</p>
          <p class="pTitleStyle" style="margin-top: 8%;"> GROUND SPEED </p>
          <p class="pValueStyle"> {{ droneGroundSpeed }} m/s</p>
        </div>
      </div>
      <div class="planMapStyle" id="mapa">
      </div>
    </div>
    <div class="wpTable">
      <b-table :items="waypoints"></b-table>
    </div>
    <div class="flightPlanButtons">
      <button class="game-button" @click="clear()"> Clear </button>
      <button class="game-button" @click="executeFlightPlan()"> Execute Flight Plan </button>
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
import homeImage from "@/assets/home.png";
import Swal from 'sweetalert2';

export default {


  setup() {
    const client = inject('mqttClient');
    const emitter = inject('emitter');

    let mapa;
    let count = 0;
    let contador = 1;
    let waypoints = ref([]);
    let popup = leaflet.popup();
    let tmpLine = undefined;
    let lineAppear = ref(true);

    let droneLatitude = ref(undefined);
    let droneLongitude = ref(undefined);
    let droneGroundSpeed = ref(undefined);
    let droneAltitude = ref(undefined);
    let homeLatitude = ref(undefined);
    let homeLongitude = ref(undefined);
    emitter.on('droneLatitude', (droneLat) => {
      //console.log("REcibo el emit", droneLat)
      droneLatitude.value = droneLat;
    });
    emitter.on('droneLongitude', (droneLon) => {
      droneLongitude.value = droneLon;
    });
    emitter.on('droneGroundSpeed', (droneGS) => {
      droneGroundSpeed.value = droneGS;
    });
    emitter.on('droneAltitude', (droneAlt) => {
      droneAltitude.value = droneAlt;
    });
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
      let token = "pk.eyJ1IjoiamFza2llIiwiYSI6ImNsajlzZWZkMTFzZzkzZnFua2d6amU5d3IifQ.lk4FtMWmJs1Lk1gKtV292w"
      mapa = leaflet.map('mapa').setView([41.276486, 1.9886], 19);
      leaflet.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=' + token,
        {
          maxZoom: 23,
          attribution: 'Mapbox'
        }).addTo(mapa);
      mapa.on('click', onMapClick);
      mapa.on('mousemove', onMapOver);
      mapa.on('contextmenu', onRightClick);

    })

    function onMapClick(e) {
      lineAppear.value = true;
      count = count + 1;
      console.log("WAYPOINT CLICADO: ", e.latlng)
      if (count > 1) {
        let last = waypoints.value[waypoints.value.length - 1];
        let distance = last.distanceTo(e.latlng).toFixed(0) / 1000;
        let midpoint = new leaflet.LatLng((last.lat + e.latlng.lat) / 2, (last.lng + e.latlng.lng) / 2);
        leaflet.marker(midpoint, { opacity: 0.01 }).addTo(mapa).bindTooltip(distance.toString(), {
          permanent: true,
          direction: 'center',
          className: "my_labels"
        });
      }

      waypoints.value.push(e.latlng);
      console.log("Lista de waypoints:", waypoints.value)

      if (waypoints.value.length > 1)
        leaflet.polyline(waypoints.value, { color: 'red' }).addTo(mapa);
      let wp = leaflet.marker(e.latlng, markerOptionsRed, { draggable: 'false' }).addTo(mapa).bindTooltip(count.toString(), {
        permanent: true,
        //direction: 'center',
        className: "my_labels"
      });
    }
    function onMapOver(e) {
      let homeMarker = leaflet.marker([homeLatitude.value, homeLongitude.value], markerOptionsHome).addTo(mapa);
      let homePosition = [homeLatitude.value, homeLongitude.value];
      console.log("HOME POSITION MIO: ", homePosition);
      waypoints.value[0] = homePosition;
      if (count > 0) {
        let last = waypoints.value[waypoints.value.length - 1];
        let distance = last.distanceTo(e.latlng).toFixed(0) / 1;
        let midpoint = new leaflet.LatLng((last.lat + e.latlng.lat) / 2, (last.lng + e.latlng.lng) / 2);

        if (lineAppear.value == true) {
          popup
            .setLatLng(midpoint)
            .setContent(distance.toString() + " m")
            .openOn(mapa);

          if (tmpLine != undefined) {
            tmpLine.remove(mapa)
          }
          tmpLine = leaflet.polyline([last, e.latlng], { color: 'red' }).addTo(mapa);
        }
      }
      if (lineAppear.value == false) {
        popup.closePopup();
      }
    }
    function onRightClick(e) {
      if (tmpLine != undefined) {
        tmpLine.remove(mapa)
      }
      leaflet.polyline(waypoints.value, { color: 'green' }).addTo(mapa);
      lineAppear.value = false;

      // Remove red markersa
      waypoints.value.forEach(wp => {
        mapa.removeLayer(wp);
      });

      contador = 1;
      waypoints.value.forEach(wp => {

        leaflet.marker(wp, markerOptionsGreen, { draggable: 'false' }).addTo(mapa).bindTooltip(contador.toString(), {
          permanent: true,
          //direction: 'center',
          className: "my_labels"
        });
        contador++;
      });
    }

    function clear() {
      count = 0;
      contador = 1;
      waypoints.value = [];
      mapa.eachLayer((layer) => {
        if (layer['_latlng'] != undefined)
          layer.remove();
        if (layer['_path'] != undefined)
          layer.remove();
      });
    }


    function executeFlightPlan() {
      // Remove the first waypoint from the array
      let waypointsToSend = waypoints.value.slice(1);
      // Convert the waypointsToSend array to JSON
      const data = JSON.stringify(waypointsToSend);
      //let data = JSON.stringify(waypoints.value);
      console.log('JSON que enviamos en ExcuteFlightPlan:', data);
      emitter.emit('missionWaypoints', waypoints.value);       // To draw the waypoints in the FreeGuiding component.
      client.publish("dashBoard/autopilotService/executeFlightPlan", data);
      Swal.fire(
          "Flight Plan sent successfully!",
          '',
          'success'
        )
    }

    return {
      mapa,
      onMapClick,
      onMapOver,
      waypoints,
      clear,
      executeFlightPlan,
      droneAltitude,
      droneGroundSpeed,
      droneLatitude,
      droneLongitude,
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

.flightPlanButtons {
  border-style: solid;
  border-color: transparent;
  border-radius: 50%;
  background-color: #343434;
  height: 12%;
  margin-top: 10%;
  margin-left: 7%;
  margin-right: 7%;
}

.flightPlanButtons.dark {
  background-color: var(--blue);
}

.planTelemetryStyle {
  width: 30%;
  height: 70%;
  border-style: solid;
  border-color: transparent;
  border-radius: 10%;
  background-color: #343434;
  margin: 2%;
  display: flex;
}

.planTelemetryStyle.dark {
  background: var(--blue);
}

.planMapStyle {
  width: 62%;
  height: 300%;
  position: relative;
  border-color: transparent;
  border-radius: 56px;
  margin: 2%;
  outline-style: none;
}

.my-labels {
  background-color: yellow;
}

.wpTable {
  width: 30%;
  height: 30%;
  border-style: solid;
  border-color: transparent;
  border-radius: 10%;
  background-color: #343434;
  margin: 2%;
}

.wpTable.dark {
  background: var(--blue);
}

.pTitleStyle {
  color: gray;
  font-weight: bold;
}

.pValueStyle {
  color: white;
  font-weight: bold;
  font-size: 33px;
  margin-top: 2%;
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