# Implementing_IOT_Pipeline

### **Review of Sprint 1**


#### 1. **Form the Project Team**
- Project manager: Mukhtar
- Backend: Samir
- System administer: Abdulsalam
- Front end/Design: Krishna
- Front end/Tester: Rabin



---

#### 2. **Set Up the Project Repository and Send Collaboration Invitations**

- Branch: Frontend, Backend, IoT 
- `.gitignore` file to avoid committing unnecessary files (e.g., `node_modules`, `.env`).
- Enabling CI/CD pipelines (e.g., automatic linting, testing, or deployment on Git pushes).
- **Deliverable**: Repository link with collaborators added, README.md file for the project overview.

---

#### 3. **Project Scope and Goals**

- "Develop a reservation system integrated with IoT-enabled door systems."
- "Enable secure real-time door access for confirmed bookings."
- Goals for user experience (e.g., booking confirmation under 2 seconds).
- The IoT component involves smart locks or door sensors that interface with the backend reservation system via access control APIs. This enables the backend to recognize reservation changes in real time and provide or restrict access based on the guest's check-in status. Guests interact with the system through the site, and the backend ensures their access rights are updated dynamically.
- **Deliverable**: A project charter or a documented report.

---

#### 4. **Milestones and Deadlines**

1. System design completed.
2. Website reservation system prototype.
3. IoT door system integrated.
4. Testing and debugging phase.
- Gantt chart or roadmap tool for visual tracking.(Optional)
- **Deliverable**: A timeline (using monday.com).

---

#### 5. **Tools and Platforms for Communication**

-  (Slack/Discord) and/or (Teams/Zoom).
- Communication norms: weekly updates in a choosen channel or bi-weekly video calls. (Discord)
- **Deliverable**: Documented communication plan (e.g., where and how to report progress/issues). (sent to discord announcement section)

---

#### 6. **Ensure Development Tools are Installed and Configured**


- Create a checklist of tools (e.g., Node.js, VSCode, Docker, testing frameworks) and their versions.
- Set up a shared `.env.example` file to ensure consistent configuration.
- **Deliverable**: A completed checklist with everyone confirming they’re set up.


---

#### 7. **Define Testing Plan**

- **Recommendation**:
    - Specify the types of testing you’ll conduct (e.g., unit testing for APIs, end-to-end testing for the reservation flow, stress testing for IoT devices).
    - Assign a person to lead the testing phase.
- **Deliverable**: A testing plan document outlining scope, tools (e.g., Jest, Postman), and testing schedules.

---

### **Review of Sprint 2**

Objectives

Clearly outline the project requirements, including specific functionalities and features.

Research and identify suitable sensors for the IoT system.

Select sensors based on is available from Moore.

---

Design the system architecture, detailing data flow, communication protocols, and integration.

Plan security measures for data transmission, storage, and user authentication.

Document all aspects of the project design, including system architecture and security.


---

1. Project Requirements and Functionalities

The system integrates IoT-enabled door locks and sensors with a reservation system.

When a guest checks in, the backend will verify their access status and allow or deny entry.

---

The IoT devices will communicate with the backend via access control APIs.

The system ensures real-time updates on reservation status and door access.

The frontend is interactive, providing real-time updates to users.

---

2. Sensor Research and Selection

Potential Sensors for the System

Magnetic Door Sensors (Reed switch) – Detects door open/close status.

RFID/NFC Sensors – Allows authenticated access. (Possible)

Motion Sensors – Detects movement near doors.

Temperature and Humidity Sensors – Environmental monitoring.



---

3. System Architecture Design

Edge Layer:

Sensors connected to Raspberry Pi Pico for data collection.

MQTT Broker facilitates communication.


---

![Screenshot_2025-02-04_123749](https://hackmd.io/_uploads/rJe0CwkYJx.png)


---

Cloud Layer:

Azure IoT Hub for device management.

Azure Functions for processing events.

Data stored in Azure Cosmos DB.

---

Backend:

Node.js server for business logic.

Redis for caching.

Payment Gateway for transactions. (mock one)

Authentication using JWT/OAuth2.

Docker (maybe).

---

Frontend:

React-based UI for user interactions.

API communication with the backend.

Real-time updates for users.

//diagram here

---

Database design
![Screenshot_2025-02-04_124832](https://hackmd.io/_uploads/BkQfUKkFJg.png)


---

4. Security Measures

Data Transmission:

Enforce HTTPS for secure communication.

MQTT used with TLS for secure sensor data transmission.

---

Authentication & Authorization:

- JWT/OAuth2 authentication.

---

Infrastructure Security:

docker for container management (If we had resources in the cloud).

Role-Based Access Control (RBAC) for system resources.

Regular security audits.

---

5. Energy Efficiency Considerations

Use low-power sensors to reduce energy consumption.

Sleep modes on Raspberry Pi Pico when inactive.

Optimize data transmission intervals to minimize power usage.
 

---

6. Documentation of Project Design

Project Overview (Objectives, requirements, and functionalities).

Sensor Selection Justification (Why each sensor was chosen).

System Architecture (Diagrams and explanations).

Security Measures (Implemented protocols).

---

Selected Sensors & Order List

- Magnetic Door Sensor/Reed Switch ,We have our own

- RFID Reader & Tags – (name: RFID-RC522)  ,Price - 7.42 € ,Marketplace - Partco(https://www.partco.fi/fi/iot/iot-kehityskortit/nfc/24764-rfid-rc522-kit.html)

- Motion Sensor  – (name: SEEED 101020793),Price - 8.24 € ,Marketplace -Partco(https://www.partco.fi/fi/rakennussarjat/grove/24685-seeed-101020793.html)

- Temperature and humidity sensors - (name: SEEED 101021032),Price - 11.73 € ,Marketplace - Partco(https://www.partco.fi/fi/rakennussarjat/grove/24270-seeed-101021032.html)

### **Overview of project vedio**

https://youtube.com/shorts/hPApitXGMm8?feature=share

End 
