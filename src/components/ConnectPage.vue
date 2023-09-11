<template>
  <EntrancePage v-if="open"></EntrancePage>
  <div v-if="!open">
    <div class="hero">
      <video class="back-video" src="@/assets/2_BCN.mp4" autoplay muted loop></video>
      <nav>
        <img src="@/assets/logoEETAC.png" class="logo" />
      </nav>
      <div class="contenido">
        <h1>Drone Engineering Ecosystem</h1>
        <a v-if="!connected" @click="toggle"> Connect </a>
      </div>
    </div>
  </div>
</template>
  <!----------------------------------------------------------------------------------------- ---------------------------------------------------------->
  <!----------------------------------------------------------------------------------------- ---------------------------------------------------------->
  <!----------------------------------------------------------------------------------------- ---------------------------------------------------------->
<script>
import { defineComponent, ref, onMounted, provide, inject } from "vue";
import EntrancePage from "./EntrancePage.vue";
import Swal from "sweetalert2";  // npm i -S vue-sweetalert2


export default defineComponent({
  components: {
    EntrancePage,
  },

  setup() {
    let connected = ref(false);
    let open = ref(false);
    const client = inject('mqttClient');
    const mqttConnect = inject('mqttConnected');
    console.log("mqttConnect in ConnectPage.vue", mqttConnect);

    async function toggle() {
      try {
        Swal.fire({
          title: "Connecting.",
          didOpen: () => {
            Swal.showLoading();
          }
        },);

        await new Promise(resolve => setTimeout(resolve, 1000));                                         //  After showing the "Connecting" Swal message, the await new Promise line pauses the execution for 2 seconds using setTimeout and resolves the promise.

        if (mqttConnect == true) {
          Swal.hideLoading();
          Swal.close();
          client.publish("dashboard/autopilotService/connect", "");

          connected.value = !connected.value;
          open.value = true;
        }
        else {
          Swal.hideLoading();
          Swal.close();
          throw new Error("");
        }
      }
      catch (error) {
        connected.value = false;
        open.value = false;
        console.log("Error connecting to MQTT broker");
        Swal.fire({
          icon: "error",
          title: "There was an error while connecting to the MQTT Broker.",
          text: "Please check if the broker is running and try again REFRESHING this page.",
        });
      }
    }
    return {
      toggle,
      connected,
      open,
    };
  },
});
</script>
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
<style scoped>
.hero {
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(rgba(12, 3, 51, 0.3), rgba(12, 3, 51, 0.3));
  position: relative;
  padding: 0 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 377px;
}

.contenido {
  text-align: center;
}

.contenido h1 {
  font-size: 130px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 10%;
  transition: 0.5s;
}

.contenido h1:hover {
  -webkit-text-stroke: 5px #fff;
  color: transparent;
}

.contenido a {
  text-decoration: none;
  display: inline-block;
  color: #fff;
  font-size: 37px;
  border: 2px solid #fff;
  padding: 14px 70px;
  border-radius: 50px;
  margin-top: 50;
  cursor: pointer;
}

.contenido a:hover {
  -webkit-text-stroke: 1px #fff;
  background: rgb(12, 197, 12);
  color: #fff;
}

.back-video {
  position: absolute;
  width: 100%;
  right: 0;
  bottom: 0;
  z-index: -1;
}

@media (min-aspect-ratio: 16/9) {
  .back-video {
    width: 100%;
    height: auto;
  }
}

@media (max-aspect-ratio: 16/9) {
  .back-video {
    width: auto;
    height: 100%;
  }
}
</style>
  