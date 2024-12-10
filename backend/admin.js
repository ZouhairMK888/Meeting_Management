const express = require('express');
const router = express.Router();
const db = require('./db');

function authenticateAdmin(req, res, next) {
  if (req.session.adminId) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

// Fetch admin personal info
router.get('/info', authenticateAdmin, (req, res) => {
  const sql = 'SELECT fname, lname FROM admin WHERE idA = ?';
  db.query(sql, [req.session.adminId], (err, results) => {
    if (err) {
      console.error('Error fetching admin info:', err);
      return res.status(500).send('Error fetching admin info');
    }
    if (results.length === 0) {
      return res.status(404).send('Admin not found');
    }
    res.json(results[0]);
  });
});

router.post('/updateInfo', authenticateAdmin, (req, res) => {
  const { fname, lname } = req.body;
  const sql = "UPDATE admin SET fname = ?, lname = ? WHERE idA = ?";
  db.query(sql, [fname, lname, req.session.adminId], (err, result) => {
    if (err) {
      console.error('Error updating personal info:', err);
      return res.status(500).send('Internal server error');
    }
    res.send('Personal info updated successfully');
  });
});

router.post('/updatePassword', authenticateAdmin, (req, res) => {
  const { newPassword } = req.body;
  const updateSql = "UPDATE admin SET passA = ? WHERE idA = ?";
  
  db.query(updateSql, [newPassword, req.session.adminId], (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).send('Internal server error');
    }
    res.send('Password updated successfully');
  });
});

// Fetch a specific meeting by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const meetingQuery = 'SELECT * FROM Meetings WHERE IDm = ?';
  const participantsQuery = 'SELECT * FROM Participants WHERE MeetingID = ?';
  const titlesQuery = 'SELECT * FROM Titles WHERE MeetingID = ?';
  const subtitlesQuery = 'SELECT * FROM Subtitles WHERE TitleID IN (SELECT IDt FROM Titles WHERE MeetingID = ?)';
  const notesQuery = 'SELECT * FROM Notes WHERE MeetingID = ?';

  db.query(meetingQuery, [id], (err, meetingResult) => {
    if (err) {
      console.error('Error fetching meeting:', err);
      return res.status(500).send('Error fetching meeting');
    }

    db.query(participantsQuery, [id], (err, participantsResult) => {
      if (err) {
        console.error('Error fetching participants:', err);
        return res.status(500).send('Error fetching participants');
      }

      db.query(titlesQuery, [id], (err, titlesResult) => {
        if (err) {
          console.error('Error fetching titles:', err);
          return res.status(500).send('Error fetching titles');
        }

        db.query(subtitlesQuery, [id], (err, subtitlesResult) => {
          if (err) {
            console.error('Error fetching subtitles:', err);
            return res.status(500).send('Error fetching subtitles');
          }

          db.query(notesQuery, [id], (err, notesResult) => {
            if (err) {
              console.error('Error fetching notes:', err);
              return res.status(500).send('Error fetching notes');
            }

            res.json({
              meeting: meetingResult[0],
              participants: participantsResult,
              titles: titlesResult,
              subtitles: subtitlesResult,
              notes: notesResult
            });
          });
        });
      });
    });
  });
});

// Update meeting details
router.post('/update', authenticateAdmin, (req, res) => {
  const { IDm, Title, OrgaName, MeetingDate, startTime, endTime, participants, pointsDiscussed, notes } = req.body;

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    // Update main meeting details
    db.query(
      'UPDATE Meetings SET Title = ?, OrgaName = ?, MeetingDate = ?, startTime = ?, endTime = ? WHERE IDm = ?',
      [Title, OrgaName, MeetingDate, startTime, endTime, IDm],
      (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error updating meeting:', err);
            res.status(500).json({ error: 'Error updating meeting' });
          });
        }

        // Update participants
        const participantPromises = participants.map(participant => {
          if (participant.id) {
            // Update existing participant
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE Participants SET ParticipantName = ? WHERE IDp = ?',
                [participant.name, participant.id],
                (err, results) => {
                  if (err) {
                    console.error('Error updating participant:', err);
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          } else {
            // Insert new participant
            return new Promise((resolve, reject) => {
              db.query(
                'INSERT INTO Participants (ParticipantName, MeetingID) VALUES (?, ?)',
                [participant.name, IDm],
                (err, results) => {
                  if (err) {
                    console.error('Error adding participant:', err);
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          }
        });

        // Update titles and subtitles
        const titlePromises = pointsDiscussed.map(point => {
          if (point.id) {
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE Titles SET name_title = ? WHERE IDt = ?',
                [point.nameTitle, point.id],
                (err, results) => {
                  if (err) {
                    console.error('Error updating title:', err);
                    reject(err);
                  } else {
                    const subtitlePromises = point.subtitles.map(subtitle => {
                      if (subtitle.id) {
                        return new Promise((resolve, reject) => {
                          db.query(
                            'UPDATE Subtitles SET name_subtitle = ?, SubtitleText = ? WHERE IDs = ?',
                            [subtitle.nameSubtitle, subtitle.subtitle, subtitle.id],
                            (err, results) => {
                              if (err) {
                                console.error('Error updating subtitle:', err);
                                reject(err);
                              } else {
                                resolve();
                              }
                            }
                          );
                        });
                      } else {
                        // Insert new subtitle
                        return new Promise((resolve, reject) => {
                          db.query(
                            'INSERT INTO Subtitles (name_subtitle, SubtitleText, TitleID) VALUES (?, ?, ?)',
                            [subtitle.nameSubtitle, subtitle.subtitle, point.id],
                            (err, results) => {
                              if (err) {
                                console.error('Error adding subtitle:', err);
                                reject(err);
                              } else {
                                resolve();
                              }
                            }
                          );
                        });
                      }
                    });
                    Promise.all(subtitlePromises).then(resolve).catch(reject);
                  }
                }
              );
            });
          } else {
            // Insert new title
            return new Promise((resolve, reject) => {
              db.query(
                'INSERT INTO Titles (name_title, MeetingID) VALUES (?, ?)',
                [point.nameTitle, IDm],
                (err, results) => {
                  if (err) {
                    console.error('Error adding title:', err);
                    reject(err);
                  } else {
                    const newTitleId = results.insertId;
                    const subtitlePromises = point.subtitles.map(subtitle => {
                      return new Promise((resolve, reject) => {
                        db.query(
                          'INSERT INTO Subtitles (name_subtitle, SubtitleText, TitleID) VALUES (?, ?, ?)',
                          [subtitle.nameSubtitle, subtitle.subtitle, newTitleId],
                          (err, results) => {
                            if (err) {
                              console.error('Error adding subtitle:', err);
                              reject(err);
                            } else {
                              resolve();
                            }
                          }
                        );
                      });
                    });
                    Promise.all(subtitlePromises).then(resolve).catch(reject);
                  }
                }
              );
            });
          }
        });

        // Update notes
        let notesPromise = Promise.resolve();
        if (notes.id) {
          notesPromise = new Promise((resolve, reject) => {
            db.query(
              'UPDATE Notes SET NoteText = ? WHERE IDn = ?',
              [notes.text, notes.id],
              (err, results) => {
                if (err) {
                  console.error('Error updating note:', err);
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          });
        }

        // Wait for all updates to complete
        Promise.all([...participantPromises, ...titlePromises, notesPromise])
          .then(() => {
            // Commit the transaction
            db.commit(err => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ error: 'Error committing transaction' });
                });
              }
              res.status(200).json({ message: 'Meeting updated successfully' });
            });
          })
          .catch(err => {
            db.rollback(() => {
              console.error('Error in one of the update operations:', err);
              res.status(500).json({ error: 'Error in one of the update operations' });
            });
          });
      }
    );
  });
});

module.exports = router;