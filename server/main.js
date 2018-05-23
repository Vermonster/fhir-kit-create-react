const express = require('express');
const fhirKitClient = require('fhir-kit-client');

const config = { baseUrl: 'https://sb-fhir-stu3.smarthealthit.org/smartstu3/open/' };
const client = new fhirKitClient(config);

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/patient', (req, res) => {
  if (req.query.name) {
    client.search({
      resourceType: 'Patient',
      searchParams: { name: req.query.name }
    }).then((response) => {
      const patients = response.entry.map((obj) => {
        return {
          id: obj.resource.id,
          name: `${obj.resource.name[0].given} ${obj.resource.name[0].family}`,
          gender: obj.resource.gender,
          birthDate: obj.resource.birthDate
        }
      });

      res.status(200).json(patients);
    });
  }
});

app.listen(3001, () => {
  console.log('Express server started on port 3001');
});
