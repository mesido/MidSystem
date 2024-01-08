const express = require('express');
const bodyParser = require('body-parser'); // o parse the body of incoming HTTP requests
const cors = require('cors'); // allows web browser to make cross-origin http request safety 
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medical_record',
});

// Set up middleware and routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define API routes

// Get records from the 'addrecord' table
app.get('/api/get', (req, res) => {
  db.query('SELECT * FROM addrecord', (error, results) => {
    if (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

// Insert a new record into the 'addrecord' table
app.post('/api/insert', (req, res) => {
  const { PatientName, Condition, Treatment } = req.body;
  const query = 'INSERT INTO addrecord (PatientName, `Condition`, Treatment) VALUES (?, ?, ?)';
  const values = [PatientName, Condition, Treatment];
  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error saving record:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ id: results.insertId });
    }
  });
});

// Update an existing record in the 'addrecord' table
app.put('/api/update/:id', (req, res) => {
  const { id } = req.params;
  const { PatientName, Condition, Treatment } = req.body;
  const query = 'UPDATE addrecord SET PatientName = ?, `Condition` = ?, Treatment = ? WHERE id = ?';
  const values = [PatientName, Condition, Treatment, id];
  db.query(query, values, (error) => {
    if (error) {
      console.error('Error updating addrecord:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete a record from the 'addrecord' table
app.delete('/api/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM addrecord WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.sendStatus(204);
      }
    }
  });
});

// Start the server
const port = 2000; // Choose the desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
