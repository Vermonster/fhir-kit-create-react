import React, { Component } from 'react';
import logo from './logo.svg';
import Patient from './Patient.jsx';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.setSearchTerms = this.setSearchTerms.bind(this);
    this.searchPatientNames = this.searchPatientNames.bind(this);
  }

  searchPatientNames(event) {
    fetch(`api/patient?name=${this.state.searchTerms}`, {
      accept: 'application/json'
    })
    .then((response) => (
      response.json()
    ))
    .then((patients) => {
      this.setState({ patients });
    })

    event.preventDefault();
  }

  setSearchTerms(event) {
    this.setState({ searchTerms: event.target.value });
  }

  render() {
    const { patients } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">FHIR Kit: Create React App</h1>
        </header>
        <section className="App-search">
          <form className='App-search-form' onSubmit={this.searchPatientNames}>
            <label>Search Patient Names: </label>
            <input name='patient-search' type='text' onChange={this.setSearchTerms} />
            <input type='submit' value='Search' />
          </form>
        </section>
        <section className="App-intro">
          {patients && patients.map((patient) =>
            <Patient
              id={patient.id}
              name={patient.name}
              birthDate={patient.birthDate}
              gender={patient.gender} />
          )}
        </section>
      </div>
    );
  }
}

export default App;
