import React, { useState } from 'react';
import { Layout, Input, List, Card, Row, Col, Spin } from 'antd';
import Patient from './Patient';
import './App.css';

const { Header, Content } = Layout;
const Search = Input.Search;

const App = () => {
  const [ loading, setLoading ] = useState(false);
  const [ patients, setPatients ] = useState([]);
  const [ searchResolved, setSearchResolved ] = useState(false);

  const searchPatientNames = (name) => {
    setLoading(true);
    setSearchResolved(false);

    fetch(`api/patient?name=${name}`, {
      accept: 'application/json'
    })
    .then((response) => (
      response.json()
    ))
    .then((patients) => {
      setPatients(patients || []);
      setLoading(false);
      setSearchResolved(true);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    })
  }

  return (
    <Layout className="App">
      <Header className="App-header">
        <h1>FHIR Kit: Create React App</h1>
      </Header>
      <Content className="App-content">
        <Row>
          <Col span={10} offset={7}>
            <p>This is an example React app generated with the
              <a
                href="https://github.com/Vermonster/fhir-kit-create-react"
                rel="noopener noreferrer"
                target="_blank"
                title="FHIRKit Create React App repo"> FHIRKit Create React App</a>
              template. The generated Node.js backend uses
              <a
                href="https://github.com/Vermonster/fhir-kit-client"
                rel="noopener noreferrer"
                target="_blank"
                title="FHIRKit Client repo">FHIRKit Client</a>
              to search an open FHIR server.</p>
          </Col>
        </Row>
        <h2>Patient Name Search Example</h2>
        <Search
          className="App-search"
          placeholder="Search Patient Names"
          enterButton="Search"
          size="large"
          onSearch={searchPatientNames}
        />
        { loading ? (
            <Row type="flex" justify="center">
              <Col span={4}>
                <Spin/>
              </Col>
            </Row>
          ) : (
            <List
              className="App-list"
              grid={{ gutter: 16, column: 2 }}
              dataSource={patients}
              locale={searchResolved ? { emptyText: 'No results found.' } : { emptyText: '' }}
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
        ) }
      </Content>
    </Layout>
  );
};

export default App;
