const express = require('express');
const router = express.Router();
const db = require('./db');

// Fetch all meetings
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Meetings';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching meetings:', err);
      return res.status(500).send('Error fetching meetings');
    }
    res.json(results);
  });
});

// Update meeting status
router.post('/updateStatus', (req, res) => {
  const { meetingID, status } = req.body;
  const query = 'UPDATE Meetings SET status = ? WHERE IDm = ?';
  db.query(query, [status, meetingID], (err, results) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).send('Error updating status');
    }
    res.send('Status updated successfully');
  });
});

// Delete a meeting
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Meetings WHERE IDm = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting meeting:', err);
      return res.status(500).send('Error deleting meeting');
    }
    res.send('Meeting deleted successfully');
  });
});
  
  module.exports = router;