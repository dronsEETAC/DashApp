<template>
    <div style="display:flex; width:100%; height: 100%;">
        <div class="freeControllerStyle">
            <div style="display: flex;">
                <div>
                    <button style="margin-top:7%; width: 65%; margin-bottom:11%;" class="game-button orange"
                        @click="armDrone()"> Arm Drone</button>
                    <button style="width: 65%; margin-bottom: 11%;" class="game-button orange" @click="takeOff()"> Take
                        Off</button>
                    <button style="width: 65%; margin-bottom: 11%" class="game-button orange" @click="RTL()"> RTL </button>
                </div>
                <div style=" width: 33.33%; margin-top: 3%; display:flex; flex-direction: column;  align-items: center;">
                    <button style="margin-left: 20%; margin-bottom: 22%;" class="game-button" @click="goNorthWest()"> NW
                    </button>
                    <button style="margin-left: 20%; margin-bottom: 22%;" class="game-button" @click="goWest()"> W </button>
                    <button style="margin-left: 20%; margin-bottom: 22%;" class="game-button" @click="goSouthWest()"> SW
                    </button>
                </div>
                <div style=" width: 33.33%; margin-top: 3%; display:flex; flex-direction: column; align-items: center;">
                    <button style="margin-bottom: 22%;" class="game-button" @click="goNorth()"> N </button>
                    <button style="margin-bottom: 22%;" class="game-button red" @click="stop()"> STOP </button>
                    <button style="margin-bottom: 29%;" class="game-button" @click="goSouth()"> S </button>
                </div>
                <div style=" width: 33.33%; margin-top: 3%; display:flex; flex-direction: column;">
                    <button style="margin-bottom: 22%; margin-left: 20%;" class="game-button" @click="goNorthEast()"> NE
                    </button>
                    <button style="margin-bottom: 22%; margin-left: 20%;" class="game-button" @click="goEast()"> E </button>
                    <button style="margin-bottom: 22%; margin-left: 20%;" class="game-button" @click="goSouthEast()"> SE
                    </button>
                </div>
            </div>

        </div>
    </div>
    <!--     </div> -->
</template>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<script>
import { ref, inject, onMounted } from "vue";
import { IonIcon } from '@ionic/vue';
import Swal from 'sweetalert2';

export default {
    components: {

    },

    setup() {
        const client = inject('mqttClient');
        const emitter = inject('emitter');

        let dronePosition = ref(undefined);
        let takeOffMaxAltitude = ref("5");
        let groundSpeed = ref("1");
        let RTLALtitude = ref("10000");
        let RTLSpeed = ref("5000")
        let armed = ref(false);
        let flying = ref(false);

        emitter.on('setTakeOffAltitude', (takeOffMaxAlt) => {
            takeOffMaxAlt = takeOffMaxAlt.toString();
            takeOffMaxAltitude.value = takeOffMaxAlt;
        })
        emitter.on('setGroundSpeed', (gSpeed) => {
            gSpeed = gSpeed.toString();
            groundSpeed.value = gSpeed;
        })
        emitter.on('setRTLAltitude', (rtlAltitude) => {
            rtlAltitude = rtlAltitude.toString();
            RTLALtitude.value = rtlAltitude;
        })
        emitter.on('setRTLSpeed', (rtlSpeed) => {
            rtlSpeed = rtlSpeed.toString();
            RTLSpeed.value = rtlSpeed;
        })
        emitter.on('armedBool', (armedBool) => {
            armed.value = armedBool;
        });
        emitter.on('flyingBool', (flyingBool) => {
            flying.value = flyingBool;
        });

        function getActualPosition() {
            client.publish("dashBoard/autopilotService/getDronePosition");
            client.subscribe("autopilotService/dashBoard/telemetryInfo");
            let telemetryInfoString = ref(undefined);
            //console.log("TelemetryInfo sin decodificar: ", dronePosition);
            telemetryInfoString.value = new TextDecoder("utf-8").decode(dronePosition.value);
            //let dronePositionSplitted = bytesToString.value.split("*")
            console.log("TelemetryInfo decodificado: ", telemetryInfoString.value);

            var telemetryInfoJSON = JSON.parse(telemetryInfoString.value);
            console.log("Latitude: ", telemetryInfoJSON["lat"]);
        }

        function armDrone() {
            console.log("Entra en la función de armDrone del Dashboard.vue");
            client.publish("dashBoard/autopilotService/armDrone", "");
            client.publish("dashBoard/autopilotService/setGroundSpeed", groundSpeed.value);
            client.publish("dashBoard/autopilotService/setRTLAltitude", RTLALtitude.value);
            client.publish("dashBoard/autopilotService/setRTLSpeed", RTLSpeed.value);
            console.log("armDrone Published desde la función armDrone del Dashboard.vue ");

        }

        function takeOff() {
            if (armed.value == true) {
                console.log("hago takeoff con maxAltitude = ", takeOffMaxAltitude.value);
                client.publish("dashBoard/autopilotService/takeOff", takeOffMaxAltitude.value);
            }
            else
                Swal.fire('Please ARM the drone first!')
        }
        function RTL() {
            if (armed.value == true) {
                client.publish("dashBoard/autopilotService/returnToLaunch", "")
            }
            else
                Swal.fire('Please ARM the drone first!')
        }

        function goNorth() {
            if (flying.value == true) {
                client.publish('dashBoard/autopilotService/go', 'North');
            }
            else
                flyingErrorAlert();
        }
        function goSouth() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'South');
            }
            else
                flyingErrorAlert();
        }
        function goEast() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'East');
            }
            else
                flyingErrorAlert();
        }
        function goWest() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'West');
            }
            else
                flyingErrorAlert();
        }
        function goNorthEast() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'NorthEst');
            }
            else
                flyingErrorAlert();
        }
        function goNorthWest() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'NorthWest');
            }
            else
                flyingErrorAlert();
        }
        function goSouthEast() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'SouthEst');
            }
            else
                flyingErrorAlert();
        }
        function goSouthWest() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'SouthWest');
            }
            else
                flyingErrorAlert();
        }
        function stop() {
            if (armed.value == true) {
                client.publish('dashBoard/autopilotService/go', 'Stop');
            }
            else
                flyingErrorAlert();
        }
        function flyingErrorAlert() {
            Swal.fire({
                icon: "error",
                title: "The Drone is NOT FLYING yet.",
                text: "Please ARM the Drone, TAKE OFF and then you'll be able to control it.",
            });
        }

        function fences() {
            client.publish('dashBoard/autopilotService/fences', "");
        }

        return {
            getActualPosition,
            armDrone,
            takeOff,
            RTL,
            goNorth,
            goSouth,
            goEast,
            goWest,
            goNorthEast,
            goNorthWest,
            goSouthEast,
            goSouthWest,
            stop,
            fences,
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

p {
    color: gray;
    font-weight: bold;
    font-size: 20px;
}

.freeControllerStyle {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 86%;
    margin-right: 9%;
    border-color: transparent;
    border-radius: 14%;
    background-color: #343434;
}

.freeControllerStyle.dark {
    background-color: var(--blue);
}

.commandsStyle {
    width: 51%;
    border-color: aqua;
    display: flex;
    height: 80%;
    margin: 2%;
    margin-left: 3%;
    border-color: transparent;
    border-radius: 14%;
    background-color: #343434;
}

.commandsStyle.dark {
    background: var(--blue);
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
    padding: 17px 48px;
    color: #fff;
    background-color: red;
    height: 48px;
}

.game-button {
    width: 40%;
    height: 22%;
    position: relative;
    top: 0;
    cursor: pointer;
    text-decoration: none !important;
    outline: none !important;
    font-family: 'Carter One', sans-serif;
    font-size: 15px;
    line-height: 1.5em;
    letter-spacing: .1em;
    text-shadow: 2px 2px 1px #0066a2, -2px 2px 1px #0066a2, 2px -2px 1px #0066a2, -2px -2px 1px #0066a2, 0px 2px 1px #0066a2, 0px -2px 1px #0066a2, 0px 4px 1px #004a87, 2px 4px 1px #004a87, -2px 4px 1px #004a87;
    border: none;
    background: repeating-linear-gradient(45deg, #3ebbf7, #3ebbf7 5px, #45b1f4 5px, #45b1f4 10px);
    border-bottom: 3px solid rgba(16, 91, 146, 0.5);
    border-top: 3px solid rgba(255, 255, 255, .3);
    color: #fff !important;
    border-radius: 8px;
    padding: 3px 11px 6px;
    box-shadow: 0 6px 0 #266b91, 0 8px 1px 1px rgba(0, 0, 0, .3), 0 10px 0 5px #12517d, 0 12px 0 5px #1a6b9a, 0 15px 0 5px #0c405e, 0 15px 1px 6px rgba(0, 0, 0, .3);
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

.game-button.red {
    height: 54px;
    width: 95px;
    background: repeating-linear-gradient(45deg, #ff4f4c, #ff4f4c 5px, #ff4643 5px, #ff4643 10px);
    box-shadow: 0 6px 0 #ae2725, 0 8px 1px 1px rgba(0, 0, 0, .3), 0 10px 0 5px #831614, 0 12px 0 5px #a33634, 0 15px 0 5px #631716, 0 15px 1px 6px rgba(0, 0, 0, .3);
    border-bottom: 3px solid rgba(160, 25, 23, 0.5);
    text-shadow: 2px 2px 1px #d72d21, -2px 2px 1px #d72d21, 2px -2px 1px #d72d21, -2px -2px 1px #d72d21, 0px 2px 1px #d72d21, 0px -2px 1px #d72d21, 0px 4px 1px #930704, 2px 4px 1px #930704, -2px 4px 1px #930704;
}

.game-button.red:hover {
    top: 2px;
    box-shadow: 0 4px 0 #ae2725, 0 6px 1px 1px rgba(0, 0, 0, .3), 0 8px 0 5px #831614, 0 10px 0 5px #a33634, 0 13px 0 5px #631716, 0 13px 1px 6px rgba(0, 0, 0, .3);
}

.game-button.green {
    background: repeating-linear-gradient(45deg, #54d440, #54d440 5px, #52cc3f 5px, #52cc3f 10px);
    box-shadow: 0 6px 0 #348628, 0 8px 1px 1px rgba(0, 0, 0, .3), 0 10px 0 5px #2a6d20, 0 12px 0 5px #39822e, 0 15px 0 5px #1d4c16, 0 15px 1px 6px rgba(0, 0, 0, .3);
    border-bottom: 3px solid rgba(40, 117, 29, 0.5);
    text-shadow: 2px 2px 1px #348628, -2px 2px 1px #348628, 2px -2px 1px #348628, -2px -2px 1px #348628, 0px 2px 1px #348628, 0px -2px 1px #348628, 0px 4px 1px #1d4c16, 2px 4px 1px #1d4c16, -2px 4px 1px #1d4c16;
}

.game-button.green:hover {
    top: 2px;
    box-shadow: 0 4px 0 #348628, 0 6px 1px 1px rgba(0, 0, 0, .3), 0 8px 0 5px #2a6d20, 0 10px 0 5px #39822e, 0 13px 0 5px #1d4c16, 0 13px 1px 6px rgba(0, 0, 0, .3);
}</style>