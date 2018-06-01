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

      const nextPageLink = response.link.find(link => link.relation === 'next');

      const { searchParams } = new URL(nextPageLink.url);

      const results = {
        total: response.total,
        _getpages: searchParams._getpages,
        _getpagesoffset: searchParams._getpagesoffset,
        _count: searchParams._count,
        patients: patients,
        prevPageLink: response.link.find(link => link.relation.match(/^prev(ious)?$/)),
        nextPageLink: response.link.find(link => link.relation === 'next'),
      }

      console.log(results);

      res.status(200).json(results);
    });
  } else {
    res.status(200).json({ patients: []});
  }
});

app.listen(app.get('port'), () => {
  console.log('Express server started on port 3001');
});
