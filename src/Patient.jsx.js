import React from 'react';
import PropTypes from 'prop-types';
import './App.css';

const Patient = ({ id, name, gender, birthDate }) => {
  return <div className="patient">
    <ul>
      <li>ID: {id}</li>
      <li>Name: {name}</li>
      <li>Gender: {gender}</li>
      <li>Birthdate: {birthDate}</li>
    </ul>
  </div>
}

Patient.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  gender: PropTypes.string,
  birthDate: PropTypes.string
}

export default Patient;
