const express = require('express');
const fhirKitClient = require('fhir-kit-client');
const bodyParser = require('body-parser');
const { URL } = require('url');

const config = { baseUrl: 'https://sb-fhir-stu3.smarthealthit.org/smartstu3/open/' };
const client = new fhirKitClient(config);

const app = express();

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/patient', (req, res) => {
  if (req.query.name) {
    client.search({
      resourceType: 'Patient',
      searchParams: { name: req.query.name, _count: 4 }
    }).then((response) => {
      const patients = response.entry ? response.entry.map((obj) => {
        return {
          id: obj.resource.id,
          name: `${obj.resource.name[0].given} ${obj.resource.name[0].family}`,
          gender: obj.resource.gender,
          birthDate: obj.resource.birthDate
        }
      }) : response;

      res.status(200).json({ patients: patients, bundle: response, total: response.total });
    });
  }
});

app.post('/api/patient', (req, res) => {
  console.log(req);
  client.pagination.initialize(req.body);

 if (req.query.name) {
  client.pagination.goToPage(req.query.page)
    .then((response) => {
      const patients = response.entry.map((obj) => {
        return {
          id: obj.resource.id,
          name: `${obj.resource.name[0].given} ${obj.resource.name[0].family}`,
          gender: obj.resource.gender,
          birthDate: obj.resource.birthDate
        }
      });

      res.status(200).json({ patients: patients, bundle: response, total: response.total });
    });

  } else {
    res.status(200).json({ patients: []});
  }
});

app.listen(app.get('port'), () => {
  console.log('Express server started on port 3001');
});
