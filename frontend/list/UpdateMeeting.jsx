import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './update.css';

const UpdateMeeting = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState('');
  const [participants, setParticipants] = useState([]);
  const [participantsId, setParticipantsId] = useState([]);
  const [meetingDate, setMeetingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [pointsDiscussed, setPointsDiscussed] = useState([]);
  const [notes, setNotes] = useState('');
  const [notesId, setNotesId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8081/admin/${id}`, { withCredentials: true })
      .then(response => {
        const data = response.data;
        setOrganizer(data.meeting.OrgaName || '');
        setParticipants(data.participants.map(p => p.ParticipantName) || []);
        setParticipantsId(data.participants.map(p => p.IDp) || []);
        setMeetingDate(data.meeting.MeetingDate || '');
        setStartTime(data.meeting.startTime || '');
        setEndTime(data.meeting.endTime || '');
        setMeetingTitle(data.meeting.Title || '');
        setPointsDiscussed(data.titles.map(title => ({
          id: title.IDt,
          nameTitle: title.name_title,
          subtitles: data.subtitles
            .filter(subtitle => subtitle.TitleID === title.IDt)
            .map(subtitle => ({
              id: subtitle.IDs,
              nameSubtitle: subtitle.name_subtitle,
              subtitle: subtitle.SubtitleText
            })),
        })) || []);
        setNotes(data.notes[0]?.NoteText || '');
        setNotesId(data.notes[0]?.IDn || '');
      })
      .catch(error => {
        console.error('Error fetching meeting details:', error);
        alert('Error fetching meeting details. Please check the console for more information.');
      });
  }, [id]);

  const handleParticipantChange = (index, event) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = event.target.value;
    setParticipants(updatedParticipants);
  };

  const handlePointChange = (pointIndex, event) => {
    const updatedPoints = [...pointsDiscussed];
    updatedPoints[pointIndex].nameTitle = event.target.value;
    setPointsDiscussed(updatedPoints);
  };

  const handleSubtitleChange = (pointIndex, subtitleIndex, event) => {
    const updatedPoints = [...pointsDiscussed];
    updatedPoints[pointIndex].subtitles[subtitleIndex].subtitle = event.target.value;
    setPointsDiscussed(updatedPoints);
  };

  const handlePointTextChange = (pointIndex, subtitleIndex, event) => {
    const updatedPoints = [...pointsDiscussed];
    updatedPoints[pointIndex].subtitles[subtitleIndex].nameSubtitle = event.target.value;
    setPointsDiscussed(updatedPoints);
  };

  const handleNotesChange = event => {
    setNotes(event.target.value);
  };

  const handleSubmit = () => {
    const updatedMeeting = {
      IDm: id,
      Title: meetingTitle,
      OrgaName: organizer,
      MeetingDate: meetingDate,
      startTime: startTime,
      endTime: endTime,
      participants: participants.map((name, index) => ({
        name: name,
        id: participantsId[index]
      })),
      pointsDiscussed: pointsDiscussed.map(point => ({
        nameTitle: point.nameTitle,
        id: point.id,
        subtitles: point.subtitles.map(subtitle => ({
          nameSubtitle: subtitle.nameSubtitle,
          subtitle: subtitle.subtitle,
          id: subtitle.id
        }))
      })),
      notes: { text: notes, id: notesId }
    };

    axios.post('http://localhost:8081/admin/update', updatedMeeting, { withCredentials: true })
      .then(response => {
        alert('Meeting updated successfully!');
        navigate('/list');
      })
      .catch(error => {
        console.error('Error updating meeting:', error);
        alert('Error updating meeting. Please check the console for more information.');
      });
  };

  return (
    <div className="update-meeting-container">
      <h2>Update Meeting</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Organizer */}
        <div className="form-group">
          <label className='LALA'>Organizer</label>
          <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
        </div>
        {/* Participants */}
        <div className="form-group participant-inputs">
          <label className='LALA'>Participants</label>
          {participants.map((participant, index) => (
            <input
              key={index}
              type="text"
              value={participant}
              onChange={(e) => handleParticipantChange(index, e)}
            />
          ))}
          <button type="button" className="add-button" onClick={() => setParticipants([...participants, ''])}>Add Participant</button>
        </div>
        {/* Meeting Date */}
        <div className="form-group">
          <label className='LALA'>Meeting Date</label>
          <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
        </div>
        {/* Start Time */}
        <div className="form-group">
          <label className='LALA'>Start Time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        {/* End Time */}
        <div className="form-group">
          <label className='LALA'>End Time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        {/* Meeting Title */}
        <div className="form-group">
          <label className='LALA'>Meeting Title</label>
          <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
        </div>
        {/* Points Discussed */}
        <div className="form-group point-inputs">
          <label className='LALA'>Points Discussed</label>
          {pointsDiscussed.map((point, pointIndex) => (
            <div key={pointIndex}>
              <input
                type="text"
                value={point.nameTitle}
                onChange={(e) => handlePointChange(pointIndex, e)}
              />
              <div className="subtitle-inputs">
                {point.subtitles.map((subtitle, subtitleIndex) => (
                  <div key={subtitleIndex}>
                    <input
                      type="text"
                      value={subtitle.nameSubtitle}
                      onChange={(e) => handlePointTextChange(pointIndex, subtitleIndex, e)}
                    />
                    <textarea
                      value={subtitle.subtitle}
                      onChange={(e) => handleSubtitleChange(pointIndex, subtitleIndex, e)}
                    />
                  </div>
                ))}
                <button type="button" className="add-button" onClick={() => {
                  const newPointsDiscussed = [...pointsDiscussed];
                  newPointsDiscussed[pointIndex].subtitles.push({ nameSubtitle: '', subtitle: '' });
                  setPointsDiscussed(newPointsDiscussed);
                }}>Add Subtitle</button>
              </div>
            </div>
          ))}
                  </div>
        {/* Notes */}
        <div className="form-group">
          <label className='LALA'>Notes</label>
          <textarea value={notes} onChange={handleNotesChange}></textarea>
        </div>
        {/* Submit Button */}
        <button type="submit" onClick={handleSubmit}>Update Meeting</button>
      </form>
    </div>
  );
};

export default UpdateMeeting;
