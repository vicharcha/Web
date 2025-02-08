import React, { useState } from 'react';

const CreateJobPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle job post submission logic here
    console.log('Job post submitted:', { title, description, company, location });
  };

  return (
    <div>
      <h2>Create Job Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required title="Title" placeholder="Enter job title" />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required title="Description" placeholder="Enter job description"></textarea>
        </div>
        <div>
          <label>Company:</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required title="Company" placeholder="Enter company name" />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required title="Location" placeholder="Enter job location" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateJobPost;
