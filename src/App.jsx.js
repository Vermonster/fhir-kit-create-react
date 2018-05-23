import React, { Component } from 'react';
import Patient from './Patient.jsx';
import { Layout, Input, List, Card } from 'antd';
import './App.css';

const { Header, Content } = Layout;
const Search = Input.Search;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.searchPatientNames = this.searchPatientNames.bind(this);
  }

  searchPatientNames(value) {
    fetch(`api/patient?name=${value}`, {
      accept: 'application/json'
    })
    .then((response) => (
      response.json()
    ))
    .then((patients) => {
      this.setState({ patients });
    })
  }

  render() {
    const { patients } = this.state;

    return (
      <Layout className="App">
        <Header className="App-header">
          <h1>FHIR Kit: Create React App</h1>
        </Header>
        <Content className="App-content">
          <h2>Patient Name Search Example</h2>
          <Search
            className="App-search"
            placeholder="Search Patient Names"
            enterButton="Search"
            size="large"
            onSearch={this.searchPatientNames}
          />
          <List
            className="App-list"
            grid={{ gutter: 16, column: 2 }}
            dataSource={patients}
            renderItem={patient => (
              <List.Item>
                <Card title={patient.name}>
                <Patient
                  id={patient.id}
                  name={patient.name}
                  birthDate={patient.birthDate}
                  gender={patient.gender} />
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    );
  }
}

export default App;
