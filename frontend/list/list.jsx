import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './list.css';
import Header from '../header/header';
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';

const List = () => {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = () => {
    axios.get('http://localhost:8081/meetings')
      .then(response => {
        setMeetings(response.data);
      })
      .catch(error => {
        console.error('Error fetching meetings:', error);
      });
  };

  const handleStatusChange = (meetingID, newStatus) => {
    axios.post('http://localhost:8081/meetings/updateStatus', { meetingID, status: newStatus })
      .then(response => {
        fetchMeetings(); // Refresh the list after updating status
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  const handleDelete = (meetingID) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      axios.delete(`http://localhost:8081/meetings/delete/${meetingID}`)
        .then(response => {
          fetchMeetings(); // Refresh the list after deletion
        })
        .catch(error => {
          console.error('Error deleting meeting:', error);
        });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUpdateClick = (meetingID) => {
    Navigate(`/update/${meetingID}`);
  };

  const filteredMeetings = meetings.filter(meeting => 
    meeting.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = async () => {
    setLoading(true);
  
    try {
      // Fetch detailed data for each meeting
      const detailedMeetings = await Promise.all(meetings.map(async (meeting) => {
        const response = await axios.get(`http://localhost:8081/summary/${meeting.IDm}`);
        return response.data;
      }));
  
      // Prepare data for export
      const exportData = detailedMeetings.flatMap(meetingData => {
        const { meeting, notes, titles, participants } = meetingData;
  
        return [
          {
            IDm: meeting.IDm,
            Title: meeting.Title,
            OrgaName: meeting.OrgaName,
            StartTime: meeting.StartTime,
            EndTime: meeting.EndTime,
            MeetingDate: meeting.MeetingDate,
            Status: meeting.status,
            Notes: notes.map(note => note.NoteText).join('; '),
            Titles: titles.map(title => `${title.name_title}: ${title.TitleText} - Subtitles: ${title.subtitles.map(subtitle => `${subtitle.name_subtitle}: ${subtitle.SubtitleText}`).join(', ')}`).join('; '),
            Participants: participants.map(participant => participant.ParticipantName).join('; ')
          }
        ];
      });
  
      // Convert data to Excel
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Meetings Summary');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'meetings_summary.xlsx');
    } catch (error) {
      console.error('Error exporting meetings:', error);
    }
  
    setLoading(false);
  }; 
  return (
    <div className="table-wrapper">
      <Header/>
      <h2>Here are all of your meetings</h2>
      <button onClick={handleExport} className="export-btn" disabled={loading}><FontAwesomeIcon icon={faFileExcel} /> 
           { loading ? 'Exporting...' :  'Export to Excel'}
      </button>
      <div style={{ width: '100%', maxWidth: '80%', margin: '0 auto' }}>
      <div className="mzzz">
  <FontAwesomeIcon icon={faSearch} className="search-icon" />
  <input
    type="text"
    placeholder="Search by title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Meeting Title</th>
              <th>Organizer Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map(meeting => (
              <tr key={meeting.IDm}>
                <td>{meeting.IDm}</td>
                <td>{meeting.Title}</td>
                <td>{meeting.OrgaName}</td>
                <td>
                  <select
                    value={meeting.status}
                    onChange={(e) => handleStatusChange(meeting.IDm, e.target.value)}
                    className="status-select"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Reported">Reported</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{formatDate(meeting.MeetingDate)}</td>
                <td>
                  <div className="actions">
                    <a href={`/summary/${meeting.IDm}`} className="summary-btn">Summary</a>
                    <button className="update-btn" onClick={() => handleUpdateClick(meeting.IDm)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDelete(meeting.IDm)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
