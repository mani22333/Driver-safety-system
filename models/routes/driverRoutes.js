const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// POST route to add a new driver
router.post('/add', async (req, res) => {
    try {
        const { name, licenseNumber, contactNumber } = req.body;
        const newDriver = new Driver({ name, licenseNumber, contactNumber });
        await newDriver.save();
        res.status(201).json({ message: 'Driver added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

module.exports = router;
