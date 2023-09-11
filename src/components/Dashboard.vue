<template>
    <div class="contenedor">
        <div class="navegacion">
            <ul>
                <li>
                    <a>
                        <span class="icon">
                            <ion-icon :icon="airplaneOutline" />
                        </span>
                        <span class="title">DASHBOARD WEBAPP</span>
                    </a>
                </li>

                <li class="active">
                    <a>
                        <span class="icon">
                            <ion-icon :icon="navigateOutline" />
                        </span>
                        <span class="title">Drone Free Guiding</span>
                    </a>
                </li>

                <li>
                    <a>
                        <span class="icon">
                            <ion-icon :icon="locationOutline" />
                        </span>
                        <span class="title">Geofence Creation</span>

                    </a>
                </li>

                <li>
                    <a>
                        <span class="icon">
                            <ion-icon :icon="analyticsOutline" />
                        </span>
                        <span class="title">Mission Planning </span>
                    </a>
                </li>

                <li>
                    <a>
                        <span class="icon">
                            <ion-icon :icon="settingsOutline" />
                        </span>
                        <span class="title">Settings</span>
                    </a>
                </li>

                <li>
                    <a>
                        <span class="icon">
                            <ion-icon :icon="helpCircleOutline" />
                        </span>
                        <span class="title">Help</span>
                    </a>
                </li>

                <li @click="setExit()">
                    <a>
                        <span class="icon">
                            <ion-icon :icon="logOutOutline" />
                        </span>
                        <span class="title">Exit</span>
                    </a>
                </li>
            </ul>
        </div>

        <!-- ======================= Main ======================= -->
        <div class="mainD">
            <div class="topbar">
                <div class="toggle" @click="toggleClicked()">
                    <ion-icon :icon="menuOutline" style="color:white" />
                </div>

                <div class="search">
                    <input type="checkbox" @click="toggleLayoutModes()" class="checkbox" id="checkbox">
                    <label for="checkbox" class="checkbox-label">
                        <i class="fas fa-moon"></i>
                        <i class="fas fa-sun"></i>
                        <span class="ball"></span>
                    </label>
                </div>

                <div class="user">
                    <img src="@/assets/logoEETAC.png" alt="">
                </div>
            </div>

            <div class="Dashboard active">
                <div class="Map" style="display:flex">
                    <FreeGuiding></FreeGuiding>
                </div>
            </div>

            <div class="Dashboard active">
                <Geofence></Geofence>
            </div>
            <div class="Dashboard active">
                <!-- <h> Dashboard núm: 2</h> -->
                <MissionPlanning></MissionPlanning>
            </div>
            <div class="Dashboard ">
                <!-- <h> Dashboard núm: 4</h> -->
                <Settings></Settings>
            </div>
            <div class="Dashboard">
                <h> Dashboard núm: 4</h>
            </div>
            <div class="Dashboard">
                <!-- <h> Dashboard núm: 5</h> -->
                <!-- router-link to="/EntrancePage"> Confirm Exit</router-link> -->
            </div>

        </div>

    </div>
</template>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<script>
import { ref, inject, onMounted } from "vue";
import { IonIcon } from '@ionic/vue';
import {
    airplaneOutline, homeOutline, peopleOutline, chatbubbleOutline, helpCircleOutline, settingsOutline, lockClosed, logOutOutline,
    menuOutline, searchOutline, analyticsOutline, navigateOutline, videocamOutline, locationOutline
} from 'ionicons/icons';
import "leaflet/dist/leaflet.css"
import FreeGuiding from './FreeGuiding.vue';
import Settings from './Settings.vue';
import MissionPlanning from './MissionPlanning.vue';
import Geofence from './Geofence.vue'


export default {
    components: {
        IonIcon,
        FreeGuiding,
        Settings,
        MissionPlanning,
        Geofence,
    },
    mounted() {
        this.setHoverEvent(); // add hovered class to selected list item
    },
    methods: {
        // add hovered class to selected list item
        setHoverEvent() {
            const list = document.querySelectorAll(".navegacion li");
            const listArray = Array.from(list); // creamos una lista de arrays que existen en la variable "list"

            list.forEach((item) =>
                item.addEventListener("click", () => {
                    const index = listArray.indexOf(item); // para ver cuál es el índice del Dashboard clicado
                    this.activeLink(item, index);
                    //console.log("item index", index);
                })
            );
        },

        activeLink(item, index) {
            const list = document.querySelectorAll(".navegacion li");

            list.forEach((li) => {
                li.classList.remove("active");
            });

            item.classList.add("active");
            this.activateDashboard(index);
        },

        activateDashboard(activedashNum) {
            const listDashboards = document.querySelectorAll(".mainD .Dashboard")

            listDashboards.forEach((item) => {
                item.classList.remove("active")
            });

            listDashboards.forEach((item, index) => {
                if (index === (activedashNum - 1)) {
                    item.classList.add("active");
                }
            });
        },

        toggleClicked() {
            let toggle = document.querySelector(".toggle");
            let navegacion = document.querySelector(".navegacion");
            let mainD = document.querySelector(".mainD");

            navegacion.classList.toggle("active");
            mainD.classList.toggle("active");
        },

        toggleLayoutModes() {
            const mainDStyle = document.querySelector(".mainD");
            const topbarStyle = document.querySelector(".mainD .topbar");
            const navegacionStyle = document.querySelector(".navegacion");
            const freeControllerStyle = document.querySelector(".freeControllerStyle");
            const droneStateStyle = document.querySelector(".droneStateStyle");
            const telemetryInfoStyle = document.querySelector(".telemetryInfoStyle");
            const videoStreamStyle = document.querySelector(".videoStreamStyle");
            const geofenceSettings = document.querySelector(".geofenceSettings");
            const fenceToggle = document.querySelector(".fenceToggle");
            const fenceButtons = document.querySelector(".fenceButtons");
            const planTelemetryStyle = document.querySelector(".planTelemetryStyle");
            const flightPlanButtons = document.querySelector(".flightPlanButtons");
            const wpTable = document.querySelector(".wpTable");
            const settingsStyle = document.querySelector(".settingsStyle");
            const pStyle = document.querySelector(".pStyle");
            const pStyle1 = document.querySelector(".pStyle1");
            const pStyle2 = document.querySelector(".pStyle2");
            const pTitleStyle = document.querySelector(".pTitleStyle");
            const pTitleStyle1 = document.querySelector(".pTitleStyle1");
            const pTitleStyle2 = document.querySelector(".pTitleStyle2");
            const pTitleStyle3 = document.querySelector(".pTitleStyle3");
            const pTitleStyle4 = document.querySelector(".pTitleStyle4");
            const pTitleStyle5 = document.querySelector(".pTitleStyle5");
            const pDroneStateStyle = document.querySelector(".pDroneStateStyle");



            mainDStyle.classList.toggle("dark");
            topbarStyle.classList.toggle("dark");
            navegacionStyle.classList.toggle("dark");
            freeControllerStyle.classList.toggle("dark");
            droneStateStyle.classList.toggle("dark");
            telemetryInfoStyle.classList.toggle("dark");
            videoStreamStyle.classList.toggle("dark");
            geofenceSettings.classList.toggle("dark");
            fenceToggle.classList.toggle("dark");
            fenceButtons.classList.toggle("dark");
            planTelemetryStyle.classList.toggle("dark");
            flightPlanButtons.classList.toggle("dark");
            wpTable.classList.toggle("dark");
            settingsStyle.classList.toggle("dark");
            pStyle.classList.toggle("dark");
            pDroneStateStyle.classList.toggle("dark");
            pStyle1.classList.toggle("dark");
            pStyle2.classList.toggle("dark");
            pTitleStyle.classList.toggle("dark");
            pTitleStyle1.classList.toggle("dark");
            pTitleStyle2.classList.toggle("dark");
            pTitleStyle3.classList.toggle("dark");
            pTitleStyle4.classList.toggle("dark");
            pTitleStyle5.classList.toggle("dark");
        }

    },
    setup() {
        let exit = ref(false);
        const emitter = inject('emitter');

        function setExit() {
            exit.value = true;
            console.log('Entra en setExit y su valor es:', exit.value);
        }

        function openFlightPlanMap() {
            let open = true;
            emitter.emit('openPlanMap', open);
        }

        return {
            airplaneOutline,
            homeOutline,
            peopleOutline,
            chatbubbleOutline,
            helpCircleOutline,
            settingsOutline,
            lockClosed,
            logOutOutline,
            menuOutline,
            searchOutline,
            analyticsOutline,
            navigateOutline,
            locationOutline,
            exit,
            setExit,
            openFlightPlanMap,
        }
    }
}
</script>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<style>
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
    --blue: #3498DB;
    --white: #fff;
    --gray: #f5f5f5;
    --black1: #222;
    --black2: #999;
}

body {
    min-height: 100vh;
    overflow-x: hidden;
    justify-content: center;
    text-align: center;
}

.contenedor {
    position: relative;
    width: 100%;
    height: 100vh;
    z-index: 1000;
}

/* ============== Navegacion =========== */
.navegacion {
    position: fixed;
    width: 300px;
    height: 100%;
    background: #343434;
    border-left: 10px solid #373737;
    transition: 0.5s;
    overflow: hidden;
}

.navegacion.dark {
    background: var(--blue);
    border-left: 10px solid var(--blue);
}

.navegacion.active {
    width: 80px;
}

.navegacion ul {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.navegacion ul li {
    position: relative;
    width: 100%;
    list-style: none;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}

.navegacion ul li:hover,
.navegacion ul li.active {
    background-color: var(--white);
}

.navegacion ul li:nth-child(1) {
    margin-bottom: 40px;
    pointer-events: none;
}

.navegacion ul li a {
    position: relative;
    display: block;
    width: 100%;
    display: flex;
    text-decoration: none;
    color: var(--white);
    cursor: pointer;
}

.navegacion ul li:hover a,
.navegacion ul li.active a {
    color: var(--blue);
}

.navegacion ul li a .icon {
    position: relative;
    display: block;
    min-width: 60px;
    height: 60px;
    line-height: 78px;
    text-align: center;
}

.navegacion ul li a .icon ion-icon {
    font-size: 1.75rem;
}

.navegacion ul li a .title {
    position: relative;
    display: block;
    padding: 0 10px;
    height: 60px;
    line-height: 60px;
    text-align: start;
    white-space: nowrap;
}

/* ============= Curve Outside ========= */
.navegacion ul li:hover a::before,
.navegacion ul li.active a::before {
    content: "";
    position: absolute;
    right: 0;
    top: -50px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: 35px 35px 0 10px var(--white);
    pointer-events: none;
}

.navegacion ul li:hover a::after,
.navegacion ul li.active a::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -50px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: 35px -35px 0 10px var(--white);
    pointer-events: none;
}

/* ============ Main ============ */
.mainD {
    position: absolute;
    width: calc(100% - 300px);
    left: 300px;
    min-height: 100vh;
    transition: 0.5s;
    background: black;
}

.mainD.active {
    width: calc(100% - 80px);
    left: 80px;
}

.mainD.dark {
    background: var(--white);
}

.topbar {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #343434;
}

.topbar.dark {
    background: var(--blue);
}

.toggle {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    cursor: pointer;
}

body.dark {
    background-color: #292c35;
}

/* #9b59b6 */

body.dark h1,
body.dark .support a {
    color: #fff;
}

.checkbox {
    opacity: 0;
    position: absolute;
}

.checkbox-label {
    background-color: #111;
    width: 50px;
    height: 26px;
    border-radius: 50px;
    position: relative;
    padding: 5px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fa-moon {
    color: #f1c40f;
}

.fa-sun {
    color: #f39c12;
}

.checkbox-label .ball {
    background-color: #fff;
    width: 22px;
    height: 22px;
    position: absolute;
    left: 2px;
    top: 2px;
    border-radius: 50%;
    transition: transform 0.2s linear;
}

.checkbox:checked+.checkbox-label .ball {
    transform: translateX(24px);
}

.user {
    position: relative;
    width: 100px;
    height: 20px;
    overflow: hidden;
    cursor: pointer;
}

.user img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    object-fit: cover;
}

.Dashboard {
    display: none;
}

.Dashboard.active {
    width: 100%;
    height: 100vh;
    display: block;
    justify-content: center;
}

.Dashboard {
    position: relative;
    text-align: center;
}

.Map {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100%;
}
</style>