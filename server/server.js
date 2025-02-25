const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const cron = require('node-cron');
const Agenda = require('agenda'); 

app.use(cors());
app.use(express.json());
const MONGO_URI = 'mongodb://localhost:27017/libraryBot';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Booking Schema and Model
const bookingSchema = new mongoose.Schema({
  email: String,
  date: String,
  timeSlot: String,
  duration: Number,
  room: String,
  category: String,
});

const Booking = mongoose.model('Booking', bookingSchema);

const agenda = new Agenda({ db: { address: MONGO_URI, collection: 'agendaJobs' } });

// Define the Agenda job
agenda.define('run booking bot', async (job) => {
  const { email, password, date, timeSlot, duration, room, category } = job.attrs.data;

  const scriptPath = '/Users/anirudhiyer/LibraryBot/bot/bookingBot.py';
  const command = `python3 "${scriptPath}" "${email}" "${password}" "${date}" "${timeSlot}" "${duration}" "${room}" "${category}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    } else if (stderr) {
      console.error(`Stderr: ${stderr}`);
    } else {

      console.log(`Stdout: ${stdout}`);
    }
  });
});

app.post('/schedule-bot', async (req, res) => {//schedules a booking on agenda
  const { email, password, date, timeSlot, duration, room, category } = req.body;

  try {
    const scheduleTime = new Date(`${date}T${timeSlot}`);//Change date and timeslot to 2 weeks before

    await agenda.schedule(scheduleTime, 'run booking bot', {
      email,
      password,
      date,
      timeSlot,
      duration,
      room,
      category,
    });

    res.send(`Bot scheduled for ${timeSlot} on ${date}`);
  } catch (error) {
    console.error('Error scheduling bot:', error);
    res.status(500).send('Failed to schedule bot');
  }
});

// Route to cancel a scheduled task
app.post('/cancel-schedule', async (req, res) => {
  const { email, date, timeSlot } = req.body;

  try {
    const result = await agenda.cancel({
      'data.email': email,
      'data.date': date,
      'data.timeSlot': timeSlot,
    });

    if (result > 0) {
      res.send('Scheduled task canceled.');
    } else {
      res.status(404).send('No matching job found.');
    }
  } catch (error) {
    console.error('Error canceling job:', error);
    res.status(500).send('Failed to cancel job.');
  }
});



app.post('/add-booking', async (req, res) => {//Save a booking to mongodb
  try {
    const { email, date, timeSlot, duration, room, category } = req.body;

    // Create and save the booking
    const booking = new Booking({ email, date, timeSlot,duration, room, category });
    await booking.save();

    res.status(201).send('Booking added to the queue');
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).send('Failed to add booking');
  }
});
app.post('/delete-all-bookings', async (req, res) => {
  const { email } = req.body;

  try {
    // Delete all bookings for the given email
    const result = await Booking.deleteMany({ email: email });

    res.send(`${result.deletedCount} bookings successfully deleted.`);
  } catch (error) {
    console.error('Error deleting bookings:', error);
    res.status(500).send('Failed to delete bookings.');
  }
});

app.get('/get-bookings/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Retrieve bookings for the specified email
    const bookings = await Booking.find({ email });
    res.json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).send('Failed to retrieve bookings');
  }
});
// Route to trigger the bot
// Route to Trigger the Bot with Booking Queue
app.post('/run-bot', async (req, res) => {//runs bot
  const { email, password } = req.body;

  try {
    const scriptPath = '/Users/anirudhiyer/LibraryBot/bot/bookingBot.py';
    const command = `python3 "${scriptPath}" "${email}" "${password}"`;
    exec(command);
    // Retrieve all bookings for the user
    // const bookingQueue = await Booking.find({ email });
    // const bookingQueueLen = bookingQueue.length;
    // if (!bookingQueue || bookingQueue.length === 0) {
    //   return res.status(400).send('No bookings in the queue');
    // }

    // // Process each booking
    // let bookingResults = [];
    // let completedCount = 0;
    // const formattedDate = new Date(booking.date).toISOString().split('T')[0];
    // bookingQueue.forEach((booking, index) => {
    //   const scriptPath = '/Users/anirudhiyer/LibraryBot/bot/bookingBot.py';
    //   const command = `python3 "${scriptPath}" "${email}" "${password}" "${booking.date}" "${booking.timeSlot}" "${booking.duration}" "${booking.room}" "${booking.category}"`;
    //   exec(command, (error, stdout, stderr) => {
    //     //completedCount++;

    //     if (error) {
    //       console.error(`Error for booking ${index + 1}: ${error.message}`);
    //       bookingResults.push({ booking, success: false, error: error.message });
    //     } else if (stderr) {
    //       console.error(`Stderr for booking ${index + 1}: ${stderr}`);
    //       bookingResults.push({ booking, success: false, error: stderr });
    //     } else {
    //       console.log(`Stdout for booking ${index + 1}: ${stdout}`);
    //       bookingResults.push({ booking, success: true, message: stdout });
    //       completedCount++;
    //       //Take job off queue
    //     }

    //     // When all bookings are processed, send the response
    //     if (completedCount === bookingQueueLen) {
    //       res.json({ results: bookingResults });
    //     }
    //   });
    // });
  } catch (error) {
    console.error('Error running bot:', error);
    res.status(500).send('Failed to run bot');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
