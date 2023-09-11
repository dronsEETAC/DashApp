import { createApp } from 'vue'
import App from './App.vue'
import { ref } from "vue";
import { createRouter, createWebHashHistory } from 'vue-router'; // npm install vue-router@4
import mqtt, { MqttClient } from 'mqtt'; // npm install mqtt --save
import mitt from 'mitt'; // npm install mitt
import BootstrapVue3 from 'bootstrap-vue-3'
import BootstrapVueIcons from 'bootstrap-vue-3'
import { IonicVue } from '@ionic/vue';
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import Dashboard from './components/Dashboard.vue';
import EntrancePage from './components/EntrancePage.vue';
import ConnectPage from './components/ConnectPage.vue';
import "leaflet/dist/leaflet.css"


let client: mqtt.MqttClient;
let mqttConnect = false;

const emitter = mitt();

async function connect() {
  try {
    client = mqtt.connect('mqtt://localhost:8000')
    //client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt')
    //client = mqtt.connect('ws://classpip.upc.edu:8000/mqtt', {username: "dronsEETAC", password: "mimara1456."});

    await new Promise((resolve, reject) => {
      client.on('connect', () => {
        mqttConnect = true;
        console.log('Connection Succeed in MAIN.TS!');
        //client.publish("dashboard/autopilotService/connect","");

        console.log('Connected value inside client.on in main.ts file', mqttConnect)
        app.provide('mqttConnected', mqttConnect)
        app.provide('mqttClient', client);
        app.provide('emitter', emitter);
        resolve(null);
      })

      client.on('offline', () => {
        app.provide('mqttConnected', mqttConnect)
        reject();
      });
    })

    if (!mqttConnect) {
      app.provide('mqttConnected', mqttConnect)
      throw new Error('');
    }
  }
  catch (error) {
    console.log('mqtt.connect error', error);
  }
}

const app = createApp(App);
(async () => {
  await connect();
  app.use(createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        name: 'ConnectPage',
        component: ConnectPage
      },
      {
        path: '/EntrancePage',
        name: 'EntrancePage',
        component: EntrancePage
      },
      {
        path: '/EntrancePage/Dashboard',
        name: 'Dashboard',
        component: Dashboard
      }

    ]
  }));
  //app.use(VueSweetalert2);
  app.use(IonicVue);
  app.use(BootstrapVue3);
  app.mount('#app');
})();

