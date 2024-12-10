import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './design.css';
import Header from '../header/header';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root');

const MeetingForm = () => {
  const [name, setName] = useState({ fname: '', lname: '' });
  const [organizer, setOrganizer] = useState('');
  const [numParticipants, setNumParticipants] = useState(1);
  const [participants, setParticipants] = useState(['']);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [pointsDiscussed, setPointsDiscussed] = useState([{ title: '', hasSubtitles: false, subtitles: [], point: '' }]);
  const [addNotes, setAddNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/form')
      .then(res => {
        if (res.data.valid) {
          setName({ fname: res.data.fname, lname: res.data.lname });
          setOrganizer(`${res.data.fname} ${res.data.lname}`);
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  const handleNumParticipantsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumParticipants(num);
    setParticipants(Array(num).fill(''));
  };

  const handleParticipantChange = (index, e) => {
    const newParticipants = [...participants];
    newParticipants[index] = e.target.value;
    setParticipants(newParticipants);
  };

  const handleAddSubtitle = (pointIndex) => {
    const newPoints = [...pointsDiscussed];
    newPoints[pointIndex].subtitles.push({ subtitle: '', point: '' });
    setPointsDiscussed(newPoints);
  };

  const handlePointChange = (pointIndex, e) => {
    const newPoints = [...pointsDiscussed];
    newPoints[pointIndex].title = e.target.value;
    setPointsDiscussed(newPoints);
  };

  const handleSubtitleChange = (pointIndex, subtitleIndex, e) => {
    const newPoints = [...pointsDiscussed];
    newPoints[pointIndex].subtitles[subtitleIndex].subtitle = e.target.value;
    setPointsDiscussed(newPoints);
  };

  const handlePointTextChange = (pointIndex, subtitleIndex, e) => {
    const newPoints = [...pointsDiscussed];
    newPoints[pointIndex].subtitles[subtitleIndex].point = e.target.value;
    setPointsDiscussed(newPoints);
  };

  const handleHasSubtitlesChange = (pointIndex, e) => {
    const newPoints = [...pointsDiscussed];
    newPoints[pointIndex].hasSubtitles = e.target.checked;
    if (!e.target.checked) {
      newPoints[pointIndex].subtitles = [];
    }
    setPointsDiscussed(newPoints);
  };

  const handlePointTextOnlyChange = (pointIndex, e) => {
    const newPoints = [...pointsDiscussed];
    newPoints[pointIndex].point = e.target.value;
    setPointsDiscussed(newPoints);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const data = {
      organizer,
      participants,
      startTime,
      endTime,
      date: meetingDate,
      discussionTitle: meetingTitle,
      pointsDiscussed: pointsDiscussed.map(point => ({
        title: point.title,
        hasSubtitles: point.hasSubtitles,
        subtitles: point.subtitles.map(sub => ({
          subtitle: sub.subtitle,
          point: sub.point
        })),
        point: point.point
      })),
      notes: addNotes ? notes : null,
    };

    axios.post('http://localhost:8081/meetings/create', data)
      .then(response => {
        console.log('Meeting created successfully:', response.data);
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error creating meeting:', error);
      });
  };

  const handleEdit = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="meeting-form-container">
      <Header />
      <h2>Welcome, <br />{name.fname} {name.lname}</h2>
      <form id="meeting-form" onSubmit={handleSubmit}>
        <div className="form-left">
          <label>
            Organizer:
            <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
          </label>
          <label>
            Number of Participants:
            <input type="number" value={numParticipants} placeholder='Enter Number of Prticipants' onChange={handleNumParticipantsChange} />
          </label>
          {participants.map((participant, index) => (
            <label key={index}>
              Participant {index + 1}:
              <input type="text" value={participant} placeholder='Participant Full Name' onChange={(e) => handleParticipantChange(index, e)} required/>
            </label>
          ))}
          <label>
            Start Time:
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required/>
          </label>
          <label>
            End Time:
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required/>
          </label>
          <label>
            Meeting Date:
            <input type="date" value={meetingDate}  onChange={(e) => setMeetingDate(e.target.value)} required/>
          </label>
          <label>
            Meeting Title:
            <input type="text" value={meetingTitle} placeholder='Enter Meeting Title' onChange={(e) => setMeetingTitle(e.target.value)} required/>
          </label>
        </div>
        <div className="form-right">
          <div className="right-header">Points Discussed</div>
          {pointsDiscussed.map((point, pointIndex) => (
            <div key={pointIndex} className="point-discussed">
              <label>
                Title:
                <input type="text" value={point.title} placeholder='Enter Point Title' onChange={(e) => handlePointChange(pointIndex, e)} required/>
              </label>
              {!point.hasSubtitles && (
                <label>
                  Point Text:
                  <textarea value={point.point} placeholder='Points...' onChange={(e) => handlePointTextOnlyChange(pointIndex, e)} />
                </label>
              )}
              <label>
                Has Subtitles:
                <input type="checkbox" checked={point.hasSubtitles} onChange={(e) => handleHasSubtitlesChange(pointIndex, e)} />
              </label>
              {point.hasSubtitles && (
                point.subtitles.map((subtitle, subtitleIndex) => (
                  <div key={subtitleIndex}>
                    <label>
                      Subtitle {subtitleIndex + 1}:
                      <input type="text" value={subtitle.subtitle} placeholder='Enter SubTitle' onChange={(e) => handleSubtitleChange(pointIndex, subtitleIndex, e)} />
                    </label>
                    <label>
                      Point:
                      <textarea
                        value={subtitle.point}
                        placeholder='Points...'
                         onChange={(e) => handlePointTextChange(pointIndex, subtitleIndex, e)}
                      />
                      </label>
                  </div>
                ))
              )}
              {point.hasSubtitles && (
                <button type="button" onClick={() => handleAddSubtitle(pointIndex)}>Add Subtitle</button>
              )}
            </div>
          ))}
          <label>
            Add Notes:
            <input type="checkbox" checked={addNotes} placeholder='Add Your Notes' onChange={() => setAddNotes(!addNotes)} />
          </label>
          {addNotes && (
            <label>
              Notes:
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          )}
        </div>
      </form>
      <div className="submit-container">
        <button type="submit" form="meeting-form">Submit</button>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Meeting Summary"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Meeting Details</h2>
        <table className="summary-table">
          <tbody>
            <tr>
              <td>Organizer:</td>
              <td>{organizer}</td>
            </tr>
            <tr>
              <td>Participants:</td>
              <td>{participants.join(', ')}</td>
            </tr>
            <tr>
              <td>Start Time:</td>
              <td>{startTime}</td>
            </tr>
            <tr>
              <td>End Time:</td>
              <td>{endTime}</td>
            </tr>
            <tr>
              <td>Meeting Date:</td>
              <td>{meetingDate}</td>
            </tr>
            <tr>
              <td>Meeting Title:</td>
              <td>{meetingTitle}</td>
            </tr>
            {pointsDiscussed.map((point, pointIndex) => (
              <React.Fragment key={pointIndex}>
                <tr>
                  <td colSpan="2"><strong>Point {pointIndex + 1}</strong></td>
                </tr>
                <tr>
                  <td>Title:</td>
                  <td>{point.title}</td>
                </tr>
                {point.hasSubtitles ? (
                  point.subtitles.map((subtitle, subtitleIndex) => (
                    <React.Fragment key={subtitleIndex}>
                      <tr>
                        <td>Subtitle {subtitleIndex + 1}:</td>
                        <td>{subtitle.subtitle}</td>
                      </tr>
                      <tr>
                        <td>Point:</td>
                        <td>{subtitle.point}</td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td>Point:</td>
                    <td>{point.point}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {addNotes && (
              <tr>
                <td>Notes:</td>
                <td>{notes}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="modal-buttons">
          <Link to='/list'>
           <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
          </Link>
          <button className="edit-button" onClick={handleEdit}>Edit</button>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingForm;
