// backend/routes/summary.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // Ensure this path matches your project structure
const util = require('util');

const query = util.promisify(db.query).bind(db);

router.get('/:id', async (req, res) => {
  const meetingID = req.params.id;
  try {
    console.log(`Fetching details for meeting ID: ${meetingID}`);

    // Fetch meeting details
    const meetingRows = await query('SELECT * FROM Meetings WHERE IDm = ?', [meetingID]);
    if (meetingRows.length === 0) {
      return res.status(404).send('Meeting not found');
    }
    const meeting = meetingRows[0];
    console.log('Meeting details:', meeting);

    // Fetch associated notes
    const notes = await query('SELECT * FROM Notes WHERE MeetingID = ?', [meetingID]);
    console.log('Notes:', notes);

    // Fetch titles and associated subtitles
    const titles = await query('SELECT * FROM Titles WHERE MeetingID = ?', [meetingID]);
    for (let title of titles) {
      const subtitles = await query('SELECT * FROM Subtitles WHERE TitleID = ?', [title.IDt]);
      title.subtitles = subtitles;
    }
    console.log('Titles with subtitles:', titles);

    // Fetch participants
    const participants = await query('SELECT * FROM Participants WHERE MeetingID = ?', [meetingID]);
    console.log('Participants:', participants);

    // Respond with the meeting details, notes, titles with subtitles, and participants
    res.json({ meeting, notes, titles, participants });
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
