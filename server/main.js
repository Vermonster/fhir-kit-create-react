const express = require('express');
const fhirKitClient = require('fhir-kit-client');

const config = { baseUrl: 'https://r3.smarthealthit.org/' };
const client = new fhirKitClient(config);

const app = express();

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

app.get('/api/patient', (req, res) => {
  if (req.query.name) {
    client.search({
      resourceType: 'Patient',
      searchParams: { name: req.query.name }
    }).then((response) => {
      const patients = response.entry ? response.entry.map((obj) => {
        return {
          id: obj.resource.id,
          name: `${obj.resource.name[0].given} ${obj.resource.name[0].family}`,
          gender: obj.resource.gender,
          birthDate: obj.resource.birthDate
        }
      }) : [];

      res.status(200).json(patients);
    });
  } else {
    res.status(200).json({ patients: []});
  }
});

app.listen(app.get('port'), () => {
  console.log('Express server started');
});
