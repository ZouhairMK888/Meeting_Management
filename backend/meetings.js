const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/create', (req, res) => {
  const { organizer, participants, startTime, endTime, date, discussionTitle, pointsDiscussed, notes } = req.body;

  // Insert into Meetings table
  const meetingQuery = `INSERT INTO Meetings (Title, OrgaName, StartTime, EndTime, MeetingDate) VALUES (?, ?, ?, ?, ?)`;
  db.query(meetingQuery, [discussionTitle, organizer, startTime, endTime, date], (err, result) => {
    if (err) {
      console.error('Error inserting meeting:', err);
      return res.status(500).json({ error: 'Error inserting meeting' });
    }

    const meetingID = result.insertId;
    console.log(`Meeting inserted with ID: ${meetingID}`);

    //Insert into Participants table
    const participantsQuery = `INSERT INTO Participants (MeetingID, ParticipantName) VALUES ?`;
    const participantsValues = participants.map(participant => [meetingID, participant.trim()]);
    db.query(participantsQuery, [participantsValues], (err, result) => {
      if (err) {
        console.error('Error inserting participants:', err);
        return res.status(500).json({ error: 'Error inserting participants' });
      }

      // Insert into Titles table
      const insertPointsAndNotes = (callback) => {
        const pointsQuery = `INSERT INTO Titles (TitleText, name_title, MeetingID) VALUES (?, ?, ?)`;
        pointsDiscussed.forEach(point => {
          db.query(pointsQuery, [point.point, point.title, meetingID], (err, result) => {
            if (err) {
              console.error('Error inserting points discussed:', err);
              return res.status(500).json({ error: 'Error inserting points discussed' });
            }

            const pointID = result.insertId;
            console.log(`Point discussed inserted with ID: ${pointID}`);

            const insertSubtitles = () => {
              if (point.hasSubtitles && point.subtitles.length > 0) {
                const subtitlesQuery = `INSERT INTO Subtitles (TitleID, SubtitleText, name_subtitle) VALUES ?`;
                const subtitlesValues = point.subtitles.map(subtitle => [pointID, subtitle.point.trim(), subtitle.subtitle.trim()]);
                db.query(subtitlesQuery, [subtitlesValues], (err, result) => {
                  if (err) {
                    console.error('Error inserting subtitles:', err);
                    return res.status(500).json({ error: 'Error inserting subtitles' });
                  }
                  console.log('Subtitles inserted successfully');
                });
              }
            };
            insertSubtitles();
          });
        });
        callback();
      };

      insertPointsAndNotes(() => {
        // Insert into Notes table
        if (notes) {
          const notesQuery = `INSERT INTO Notes (MeetingID, NoteText, DateAdded) VALUES (?, ?, ?)`;
          db.query(notesQuery, [meetingID, notes, new Date().toISOString().slice(0, 10)], (err, result) => {
            if (err) {
              console.error('Error inserting notes:', err);
              return res.status(500).json({ error: 'Error inserting notes' });
            }

            console.log('Notes inserted successfully');
            res.json({ message: 'Meeting created successfully' });
          });
        } else {
          res.json({ message: 'Meeting created successfully' });
        }
      });
    });
  });
});

module.exports = router;
