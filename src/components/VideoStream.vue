<template>
  <div style="width:100%;">
    <div class="monitorBackground">
      <canvas class="canvasStyle" id="output"></canvas>
    </div>
    <div style="display:flex; justify-content: center; margin: 5%; ">
      <button class="button-85" @click="startVideoStream()"> Start VideoStream</button>
      <button class="button-85" style="margin-left: 5%;" @click="stopVideoStream()"> Stop VideoStream</button>
    </div>
  </div>
</template>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<script>
import { ref, inject, onMounted } from "vue";
import * as cv from 'opencv.js' // para instalar -> (npm i opencv.js)

export default {
  setup() {

    const client = inject('mqttClient');

    onMounted(() => {
      client.on('message', (topic, message) => {
        //console.log("entra en client on")
        if (topic == 'cameraService/dashBoard/videoFrame') {
          console.log("Llega despues de if topic")
          const img = new Image();
          img.src = "data:image/jpg;base64," + message;
          img.onload = () => {
            let dst;
            dst = cv.imread(img);
            cv.imshow('output', dst);
          };
        }
      })
    })

    function startVideoStream() {
      client.publish("dashBoard/cameraService/startVideoStream");
      client.subscribe("cameraService/dashBoard/videoFrame");
      /* client.subscribe("+/dashBoard/+"); */
    }
    function stopVideoStream() {
      client.publish("dashBoard/cameraService/stopVideoStream");
    }

    return {
      startVideoStream,
      stopVideoStream,
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

.monitorBackground {
  background: url("D:/Escritorio/DashApp/dash-webapp/src/assets/Monitor.png");
  background-size: cover;
  background-position: center;
  width: 91%;
  height: 79%;
  margin-bottom: 2%;
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
}

.canvasStyle {
  margin-top: 3%;
  width: 93%;
  height: 73%;
  border-style: solid;
  border-color: blue;
}

.button-85 {
  padding: 0.6em 2em;
  border: none;
  outline: none;
  color: rgb(255, 255, 255);
  background: #111;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-85:before {
  content: "";
  background: linear-gradient(45deg,
      #ff0000,
      #ff7300,
      #fffb00,
      #48ff00,
      #00ffd5,
      #002bff,
      #7a00ff,
      #ff00c8,
      #ff0000);
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing-button-85 20s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes glowing-button-85 {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
  }
}

.button-85:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #222;
  left: 0;
  top: 0;
  border-radius: 10px;
}
</style>