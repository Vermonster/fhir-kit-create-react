import React, { Component } from 'react';
import Patient from './Patient.jsx';
import { Layout, Input, List, Card, Row, Col, Spin, Pagination } from 'antd';
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
    this.setState({ loading: true });
    fetch(`api/patient?name=${value}`, {
      accept: 'application/json'
    })
    .then((response) => (
      response.json()
    ))
    .then((results) => {
      this.setState({
        patients: results.patients,
        loading: false,
        searchResolved: true,
        bundle: results.bundle,
        total: results.total
       });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ loading: false });
    });
  }

  turnPage = (page, _pageSize) => {

    fetch(`api/patient?page=${page}`, {
      body: JSON.stringify({ bundle: this.state.bundle }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      accept: 'application/json',
      method: 'POST',
      mode: 'cors'
    })
    .then((response) => (
      response.json()
    ))
    .then((results) => {
      this.setState({
        patients: results.patients,
        bundle: results.bundle,
        total: results.total
      });
    })
  }

  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>Previous</a>;
    } else if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  }

  render() {
    const { patients, loading, searchResolved, total } = this.state;

    return (
      <Layout className="App">
        <Header className="App-header">
          <h1>FHIR Kit: Create React App</h1>
        </Header>
        <Content className="App-content">
          <Row>
            <Col span={10} offset={7}>
              <p>This is an example React app generated with the <a href="https://github.com/Vermonster/fhir-kit-create-react" rel="noopener noreferrer" target="_blank" title="FHIRKit Create React App repo"> FHIRKit Create React App</a> template.  The generated Node.js backend uses <a href="https://github.com/Vermonster/fhir-kit-client" rel="noopener noreferrer" target="_blank" title="FHIRKit Client repo"> FHIRKit Client</a> to search an open FHIR server.</p>
            </Col>
          </Row>
          <h2>Patient Name Search Example</h2>
          <Search
            className="App-search"
            placeholder="Search Patient Names"
            enterButton="Search"
            size="large"
            onSearch={this.searchPatientNames}
          />
          { loading ? (
              <Row type="flex" justify="center">
                <Col span={4}>
                  <Spin/>
                </Col>
              </Row>
            ) : (
              <Row type="flex" justify="center">
                <Col span={24}>
                  <h3>{ total ? (total + ' result(s)') : ''}</h3>
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
                  <Pagination
                    total={total}
                    pageSize={4}
                    itemRender={this.itemRender}
                    onChange={this.turnPage}
                  />
                </Col>
              </Row>
          ) }
        </Content>
      </Layout>
    );
  }
}

export default App;
