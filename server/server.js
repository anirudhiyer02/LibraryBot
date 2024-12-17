const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route to trigger the bot
app.post('/run-bot', (req, res) => {
    const scriptPath = '/Users/anirudhiyer/LibraryBot/bot/bookingBot.py';
    exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Bot execution failed');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send('Bot execution error');
    }
    console.log(`Stdout: ${stdout}`);
    res.send('Bot executed successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
