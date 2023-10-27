// import express (after npm install express)
const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const { saveNewsFromRequest, updateStatsFromRequest } = require('./firebase-util');
const { initializeDBConnection } = require('./firebase-db-connect');

// create new express app and save it as "app"
const app = express();
app.use(express.json());

// server configuration
const PORT = process.env.PORT || 8080;

// create a route for the app
app.post('/save-news', async(req, res) => {
  const result = await saveNewsFromRequest(req.body);
  if(result === 'success') res.sendStatus(200);
  else res.send(result);
});

app.post('/update-stats', async(req, res) => {
  const result = await updateStatsFromRequest(req.body);
  if(result === 'success') res.sendStatus(200);
  else res.send(result);
});

// make the server listen to requests
app.listen(PORT, async() => {
  await initializeDBConnection();
  console.log(`Server running at: http://localhost:${PORT}/`);
});


const cleanup = async () => {
  try {
    console.log('Closing Firestore connection...');
    await getFirestore().terminate(); // Close the Firestore connection
    console.log('Firestore connection closed.');
  } catch (error) {
    console.error('Error closing Firestore connection:', error);
  }
  process.exit(0);
};

process.on('exit', cleanup); // Handle process exit
process.on('SIGINT', cleanup); // Handle Ctrl+C