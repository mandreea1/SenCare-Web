import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Recommendations.css';

const Recommendations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newRecommendation, setNewRecommendation] = useState('');
  
  // Mock data - in a real app, this would come from an API
  const recommendations = [
    {
      id: 1,
      date: '2024-03-15',
      content: 'Take medication twice daily with meals',
      status: 'active'
    },
    {
      id: 2,
      date: '2024-03-10',
      content: 'Exercise for 30 minutes daily',
      status: 'active'
    },
    {
      id: 3,
      date: '2024-02-28',
      content: 'Follow up appointment in 2 weeks',
      status: 'completed'
    }
  ];

  const handleAddRecommendation = (e) => {
    e.preventDefault();
    if (newRecommendation.trim()) {
      // In a real app, this would send data to an API
      console.log('New recommendation:', newRecommendation);
      setNewRecommendation('');
    }
  };

  return (
    <div className="recommendations">
      <div className="header">
        <h1>Patient Recommendations</h1>
        <button className="btn btn-secondary" onClick={() => navigate(`/doctor/patient/${id}`)}>
          Back to Patient
        </button>
      </div>

      <div className="recommendations-list">
        {recommendations.map(rec => (
          <div key={rec.id} className={`recommendation-card ${rec.status}`}>
            <div className="recommendation-header">
              <span className="date">{rec.date}</span>
              <span className={`status ${rec.status}`}>{rec.status}</span>
            </div>
            <p className="content">{rec.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddRecommendation} className="add-recommendation">
        <h2>Add New Recommendation</h2>
        <div className="form-group">
          <textarea
            value={newRecommendation}
            onChange={(e) => setNewRecommendation(e.target.value)}
            placeholder="Enter your recommendation..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Recommendation
        </button>
      </form>
    </div>
  );
};

export default Recommendations; 