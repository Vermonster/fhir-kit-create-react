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
        total: results.total,
        patients: results.patients,
        prevPageLink: results.prevPageLink,
        nextPageLink: results.nextPageLink,
        loading: false,
        searchResolved: true
       });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ loading: false });
    });
  }

  turnPage(page, pageSize) {
    console.log(page);
    console.log(pageSize);
    // fetch(pageLink, {
    //   accept: 'application/json'
    // })
    // .then((results) => {
    //   this.setState({
    //     patients: results.patients
    //   })
    // })
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
          ) }
        </Content>
      </Layout>
    );
  }
}

export default App;
