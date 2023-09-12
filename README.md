# DashApp

## What is it?
The DashApp is a front-end web app version of the Dashboard
The DashApp represents an exciting evolution of the classic Dashboard, now as a web app with a host of enhanced and additional functionalities. Developed using Vue.js, the DashApp builds upon the core features of the Dashboard with some enhanced and additional functionalities.

The DashApp includes:

  - **Enabling autonomous drone control**: The final user should possess the capability to issue fundamental instructions       to the drone, such as arming, initiating take-off, or commanding the directions to go.
    
  - **Streaming live video**: Users should have the capability to observe real-time video feed captured by the drone's   
     onboard camera, granting them a dynamic perspective of the drone's surroundings.

  - **Mission and route planning**: Users should have the ability to formulate flight paths for the drone to follow.

However, what truly sets the DashApp apart are its extra functionalities. In addition to the fundamental capabilities, the DashApp introduces powerful features such as: 

  - **Inclusion Geofence creation**: The user must be able to create an inclusion geofence, whether it is a circular or
    polygonal one, wherever in the map of the Drone Lab so that the drone only can fly in that area. Additionally the user      is able to set Geofence parameters like the maximum altitude, circular fence radius…
    
  - **Setting drone parameters**: The user must be able to configure the drone's basic parameters like take off altitude,   
    ground speed, RTL altitude, etc.
    
  - **User interface functionalities**: the web app made takes the user experience to the next level. The DashApp has a     
     modern makeover with a host of exciting new functionalities. This means that the web app has got a contemporary             interface, for  instance with the bright and dark mode functionality among others, with which the user can personalize      its viewing experience according to its preference.

## Installation
To contribute to the modules implemented in Vue within the Drone Engineering Ecosystem, you'll need to have the following prerequisites in place:

1. **Visual Studio:** Ensure that you have Visual Studio installed on your PC. It's an essential tool for Vue.js development.
   
2. **@vue/cli (Version 3 or higher):** Make sure you have Vue CLI version 3 or a later version installed.

Once you have these prerequisites ready, follow the contribution protocol outlined in the main repository of the Drone Engineering Ecosystem. Additionally, if you wish to run the DashApp on your local PC, navigate to the project directory and execute the following commands:
```
npm install     # Install project dependencies
npm run serve   # Start the development server
```

Please note that the DashApp while in simulation works in global mode, so the **execution parameters to give to the Autopilot and Camera service will be** :
```
global simulation broker.hivemq.com
```

These commands will set up the necessary environment for running the DashApp on your PC, allowing you to contribute effectively to the Vue modules and explore the ecosystem's offerings.

## DEMO

You can experience a demonstration of the DashApp by simply clicking on the following link: [DashApp Demo](https://youtu.be/AclaarrXzu4). This demo will give you a firsthand look at the DashApp's features and functionalities in action. This is the summary of the demo:

In the demonstration video, we follow a series of steps to showcase the functionality of the system. Here's a breakdown of the steps and what each of them entails:

1. **Connect to MQTT Broker and on-module services:**
Initially, we establish a connection to the MQTT broker and on-module services. This connection is essential for communication between the components of the system.
  
 ![image](https://github.com/JaskiratSingh377/DashApp/assets/80628754/39141a91-666b-466c-9579-8ca39bf172c5)
 

2. **Preliminary page with slides:**
Once successfully connected, the app shows up with a preliminary page that presents several slides. These slides serve as a menu, allowing us to choose different apps available on the page within **(As per today, only DashApp is available to use)**.

![image](https://github.com/JaskiratSingh377/DashApp/assets/80628754/c71b0383-2012-4c30-baa4-eb00e29ce1e1)


3. **Enter DashApp and Free Guide the Drone:**
Then we finally enter the DashApp, where the main drone control and monitoring interface is located. Inside the DashApp, we initiate the demonstration by guiding the drone manually, ensuring it's responsive to our commands.
  
![image](https://github.com/JaskiratSingh377/DashApp/assets/80628754/45a98837-9cc6-4c67-af02-390924344009)

4. **Adjust drone Flight Parameters:**
Within the DashApp, we access settings to modify the drone's flight parameters. This includes changing attributes such as take-off altitude and ground speed. After making these adjustments, we perform another drone flight to verify that the changes have been implemented correctly and that no unwanted issues arise.

5. **Create and test Polygonal Fence:**
Moving on, we demonstrate the capability to create a polygonal fence. This fence is a virtual boundary that defines the area within which the drone can operate. We create the fence and then test its functionality to ensure that it restricts the drone's movement appropriately.

6. **Wait for Drone to be ON EARTH state:**
In order to try all the functionalities, we wait for the drone to reach the "ON EARTH" state to progress with the Mission Planning execution. This state indicates that the drone is safely landed and ready for further actions. It's an important prerequisite for mission planning and ensures the drone is grounded before proceeding.

7. **Mission Planning:**
Once the drone is in the "ON EARTH" state, we demonstrate the process of Mission Planning. This involves creating a predefined route or set of waypoints that the drone will follow autonomously. We set up the mission plan and ensure it's ready for execution.

8. **Live Video Streaming:**
Finally, we utilize the live video streaming feature to conclude the demonstration. This feature allows us to view real-time video feeds from the drone's onboard camera, providing a visual perspective of the drone's surroundings.

## Code
Have a look to the code here: [DashApp Code](https://youtu.be/hpJKANCcS9Y)
