<template>
  <Dashboard v-if="openDash"></Dashboard>

  <header>
    <a href="#" class="brand">Drone Engineering Ecosystem</a>
    <div class="menu-btn" @click="menuBTNClicked"></div>
    <div class="navigation">
      <div class="navigation-items">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Explore</a>
        <a href="#">Gallery</a>
        <a href="#">Contact</a>
      </div>
    </div>
  </header>

  <section class="home">
    <video class="video-slide active" src="@/assets/3_BCN.mp4" autoplay muted loop></video>
    <video class="video-slide" src="@/assets/2_BCN.mp4" autoplay muted loop></video>
    <video class="video-slide" src="@/assets/1_BCN.mp4" autoplay muted loop></video>
    <video class="video-slide" src="@/assets/3_BCN.mp4" autoplay muted loop></video>
    <video class="video-slide" src="@/assets/2_BCN.mp4" autoplay muted loop></video>
    <div class="content active">
      <h1> Option one.
        <br>
        <span>DASHBOARD</span>
      </h1>
      <ul>
        The Dashboard is a front-end desktop application which allows the user to do a bunch of things, including:
        <br>
        <br>
        <ul style="list-style-type: disc; margin-left: 20px;">
          <li>Showing the picture/video stream sent by the camera service</li>
          <li>Free guiding the drone</li>
          <li>Simple flight planning</li>
          <li>Showing telemetry data</li>
          <li>Starting/Stopping a LED sequence in the drone</li>
        </ul>
      </ul>
      <button @click="dashAccessPermission"> PLAY WITH IT </button>
    </div>
    <div class="content">
      <h1> slide two.<br><span>Drone Circus</span></h1>
      <p> Write description here.
      </p>
      <button> PLAY WITH IT</button>
    </div>
    <div class="content">
      <h1> Slide Three.<br><span>All time Record</span></h1>
      <p> Write description here.
      </p>
      <button> SHOW RECORDLIST</button>
    </div>
    <div class="content">
      <h1> Slide Four.<br><span>Gallery</span></h1>
      <p> Write description here.
      </p>
      <button> READ MORE</button>
    </div>
    <div class="content">
      <h1> Slide Five.<br><span>Contact</span></h1>
      <p> Write description here.
      </p>
      <button> READ MORE</button>
    </div>
    <div class="media-icons">
      <a href="https://github.com/dronsEETAC/DroneEngineeringEcosystemDEE" target="_blank"><i
          class="fab fa-github"></i></a>
      <a href="https://www.youtube.com/@dronseetac" target="_blank"><i class="fab fa-youtube"></i></a>
      <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
    </div>
    <div class="slider-navigation">
      <div class="nav-btn active" @click="navBTNClicked(0)"></div>
      <div class="nav-btn" @click="navBTNClicked(1)"></div>
      <div class="nav-btn" @click="navBTNClicked(2)"></div>
      <div class="nav-btn" @click="navBTNClicked(3)"></div>
      <div class="nav-btn" @click="navBTNClicked(4)"></div>
    </div>
  </section>
</template>
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
<script>
import { defineComponent, inject, ref } from 'vue';
import Dashboard from "./Dashboard.vue";

export default defineComponent({
  name: 'App',
  components: {
    Dashboard,
  },

  methods: {
    menuBTNClicked() {
      const menuBtn = document.querySelector(".menu-btn")
      const navigation = document.querySelector(".navigation")

      menuBtn.classList.toggle("active");
      navigation.classList.toggle("active");
    },
    navBTNClicked(i) {
      const btns = document.querySelectorAll(".nav-btn");
      const slides = document.querySelectorAll(".video-slide");
      const contents = document.querySelectorAll(".content");

      btns.forEach((btn) => {
        btn.classList.remove("active");
      });

      slides.forEach((slide) => {
        slide.classList.remove("active");
      });

      contents.forEach((content) => {
        content.classList.remove("active");
      });

      btns[i].classList.add("active");
      slides[i].classList.add("active");
      contents[i].classList.add("active");
    },
  },
  setup() {
    let dashAccess = ref(false);
    let openDash = ref(false);
    const client = inject('mqttClient');

    function dashAccessPermission() {
      client.publish("dashBoard/autopilotService/getHome", "");
      dashAccess.value = true;
      openDash.value = true;
      console.log("Set to true");
    }

    return {
      dashAccessPermission,
      dashAccess,
      openDash,
    }
  }
});
</script>
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
  <!--------------------------------------------------------------------------------------------------------------------------------------------------->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

header {
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  transition: 0.5s ease;
}

header .brand {
  color: #fff;
  font-size: 1.5em;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
}

header .navigation {
  position: relative;
}

header .navigation .navigation-items a {
  position: relative;
  color: #fff;
  font-size: 1em;
  font-weight: 500;
  text-decoration: none;
  margin-left: 30px;
  transition: 0.3s ease;
}

header .navigation .navigation-items a:before {
  content: '';
  position: absolute;
  background: #fff;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 0;
}

header .navigation .navigation-items a:hover:before {
  content: '';
  position: absolute;
  background: #fff;
  width: 100%;
  height: 3px;
  bottom: 0;
  left: 0;
  transition: 0.3s ease;
}

section {
  padding: 150px 200px;
}

.home {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: columm;
  background: #2696E9;
}

.home .content {
  z-index: 888;
  color: #fff;
  width: 70%;
  margin-top: 50px;
  display: none;
  /* si un slide no está activo que no muestre nada (sino se solpan todos) */
}

.home .content.active {
  display: block;
  /* para que aparezca en pantalla el slide activo*/
}

.home .content h1 {
  font-size: 4em;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 5px;
  line-height: 75px;
  margin-bottom: 40px;
}

.home .content h1 span {
  font-size: 1.2em;
  font-weight: 600;
}

.home .content p {
  margin-bottom: 65px;
}

.home .content ul {
  margin-bottom: 85px;
}

.home .content button {
  background: #fff;
  padding: 15px 35px;
  color: #1680AC;
  font-size: 1.1em;
  font-weight: 500;
  text-decoration: none;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.home .media-icons {
  z-index: 888;
  position: absolute;
  right: 30px;
  top: 400px;
  display: flex;
  flex-direction: column;
  transition: 0.5s ease;
}

.home .media-icons a {
  color: #fff;
  font-size: 1.6em;
  transition: 0.3s ease;
}

.home .media-icons a:not(:last-child) {
  margin-bottom: 20px;
}

.home .media-icons a:hover {
  transform: scale(1.3);
}

.home video {
  z-index: 000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home:before {
  z-index: 777;
  content: '';
  position: absolute;
  background: rgba(3, 96, 251, 0.3);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.slider-navigation {
  z-index: 888;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(100px);
  margin-top: 30%;
}

.slider-navigation .nav-btn {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  transition: 0.3s ease;
}

.slider-navigation .nav-btn.active {
  background: #2696E9;
}


.slider-navigation .nav-btn:not(:last-child) {
  margin-right: 20px;
}

.slider-navigation .nav-btn:hover {
  transform: scale(1.4);
}

.video-slide {
  position: absolute;
  width: 100%;
  clip-path: circle(0% at 0 50%);
  /* para que cuando el video-slide no esté en active no aparezca nada*/
}

.video-slide.active {
  clip-path: circle(150% at 0 50%);
  /* para que aparezca el video correspondiente cunado está en active*/
  transition: 1s ease;
  transition-property: clip-path;
}

@media (max-width: 1460px) {

  header {
    padding: 12px 20px;
  }

  section {
    padding: 100px 20px;
  }

  .home .media-icons {
    right: 25px;
  }

  header .navigation {
    display: none;
  }

  header .navigation.active {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(1, 1, 1, 0.5);
  }

  header .navigation .navigation-items a {
    color: #222;
    font-size: 1.2em;
    margin: 20px;
  }

  header .navigation .navigation-items a:before {
    background: #222;
    height: 5px;
  }

  header .navigation.active .navigation-items {
    background: #fff;
    width: 600px;
    max-width: 600px;
    margin: 20px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0 5px 25px rgb(1 1 1 / 20%);
  }

  .menu-btn {
    background: url("D:/Escritorio/DashApp/dash-webapp/src/assets/menu.png")no-repeat;
    /* RUTA SEGÚN EL PC*/
    background-size: 30px;
    background-position: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .menu-btn.active {
    z-index: 999;
    background: url("D:/Escritorio/DashApp/dash-webapp/src/assets/close.png")no-repeat;
    /* RUTA SEGÚN EL PC*/
    background-size: 25px;
    background-position: center;
    transition: 0.3s ease;
  }
}</style>
  