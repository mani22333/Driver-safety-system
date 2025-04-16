// server.js

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // ✅ Your fixed db.js
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// ✅ Connect to MongoDB
connectDB();

// ====== SCHEMAS ======

// Driver Schema
const driverSchema = new mongoose.Schema({
    name: String,
    license_no: String,
    phone: String,
    email: String
});
const Driver = mongoose.model('Driver', driverSchema);

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    driver_id: mongoose.Schema.Types.ObjectId,
    plate_number: String,
    model: String,
    year: Number
});
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Sensor Data Schema
const sensorDataSchema = new mongoose.Schema({
    driver_id: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    drowsiness_level: Number,
    alcohol_level: Number,
    distraction_flag: Boolean
});
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Alert Schema
const alertSchema = new mongoose.Schema({
    driver_id: mongoose.Schema.Types.ObjectId,
    alert_type: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    is_resolved: { type: Boolean, default: false }
});
const Alert = mongoose.model('Alert', alertSchema);

// ====== ROUTES ======

// Register driver
app.post('/api/register-driver', async (req, res) => {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.send('Driver registered successfully');
});

// Register vehicle
app.post('/api/register-vehicle', async (req, res) => {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.send('Vehicle registered successfully');
});

// Submit sensor data
app.post('/api/sensor-data', async (req, res) => {
    const newData = new SensorData(req.body);
    await newData.save();

    // Trigger alert
    if (newData.drowsiness_level > 80) {
        const newAlert = new Alert({
            driver_id: newData.driver_id,
            alert_type: 'Drowsiness',
            message: 'Driver appears to be drowsy!'
        });
        await newAlert.save();
    }

    res.send('Sensor data received');
});

// Get alerts by driver ID
app.get('/api/alerts/:driverId', async (req, res) => {
    const alerts = await Alert.find({ driver_id: req.params.driverId });
    res.json(alerts);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route for homepage.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});
app.get('/debug/drivers', async (req, res) => {
    const drivers = await Driver.find();
    res.json(drivers);
  });
  
