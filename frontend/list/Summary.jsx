import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './summary.css'; // Ensure this CSS file contains the previous styles

const Summary = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState([]);
  const [participants, setParticipants] = useState([]); // Add participants state
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    fetchMeetingDetails(id);
  }, [id]);

  const fetchMeetingDetails = (id) => {
    axios.get(`http://localhost:8081/summary/${id}`)
      .then(response => {
        setMeeting(response.data.meeting);
        setNotes(response.data.notes);
        setTitles(response.data.titles);
        setParticipants(response.data.participants); // Set participants state
        setLoading(false); // Set loading to false
      })
      .catch(error => {
        console.error('Error fetching meeting details:', error);
        setError('Error fetching meeting details');
        setLoading(false); // Set loading to false even on error
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="summary-wrapper">
      <h2>Meeting Summary</h2>
      <h3>{meeting.Title}</h3>
      <p><strong>Organizer:</strong> {meeting.OrgaName}</p>
      <p><strong>Date:</strong> {new Date(meeting.MeetingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {meeting.StartTime} - {meeting.EndTime}</p>
      <p><strong>Status:</strong> {meeting.status}</p>

      <h4>Participants</h4>
      <ul>
        {participants.map(participant => (
          <li key={participant.IDp}>{participant.ParticipantName}</li>
        ))}
      </ul>

      <h4>Notes</h4>
      <ul>
        {notes.map(note => (
          <li key={note.IDn}>{note.NoteText}</li>
        ))}
      </ul>

      <h4>Titles and Subtitles</h4>
      <ul>
        {titles.map(title => (
          <li key={title.IDt}>
            <strong>{title.name_title}:</strong> {title.TitleText}
            <ul>
              {title.subtitles.map(subtitle => (
                <li key={subtitle.IDs}>{subtitle.name_subtitle}: {subtitle.SubtitleText}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Summary;
