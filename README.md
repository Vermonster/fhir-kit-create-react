# FHIRKit Create React App

A [create-react-app](https://github.com/facebook/create-react-app) template
using the [FHIRKit Client](https://github.com/Vermonster/fhir-kit-client) with
an Express.js server.

View an example deployment of the app at
[https://fhir-kit-react.herokuapp.com](http://fhir-kit-react.herokuapp.com/).

## Architecture

This template creates an application using the common [BFF (Backend for
Frontend) pattern](https://samnewman.io/patterns/architectural/bff/). From our
experience, this separation leads to more efficient and enjoyable development,
as it allows teams to follow conventional react patterns (e.g. use JSON-API and
build optimized domain models) and keep the FHIR logic in one place on the
server. This pattern also allows us to keep secrets (keys) and other logic on
protected on the server.


```
  +------------------+
  |      EHR         |
  |..................|
  |   FHIR |  OAuth2 |
  +------------------+
           :
           : (FHIR)
           :
  +------------------+  <----.
  | Server (Express) |       |
  +..................+       |
           : (BFF)       this template
  +..................+       |
  |  Client (React)  |       |
  +------------------+  <----'

```

For instance, consider a patient React component that may show patient name,
active condition, and most recent height, weight, and blood pressure. A simple
flat model in React/BFF can be built. In react this could be modeled like this:

```js
Patient.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  condition: PropTypes.string,
  height: PropTypes.string,
  weight: PropTypes.string,
  bloodPressure: PropTypes.string
}
```

The logic to issue multiple FHIR queries and process the results happens
on the server. This also leads to nice patterns where domain models can be
mocked to allow for rapid react development, independent of FHIR modeling and
integration. This pattern is also useful given the current state of multiple
versions of FHIR in the field, and even possibility to build connections to
non-FHIR APIs while keeping that complexity out of the react application code.

Here is an example server implementation:

```node
const fhirPatient = await fhirClient.read({ resourceType: 'Patient', id: '12345' });
const fhirCondition = await fhirClient.search({
  resourceType: 'Condition',
  searchParams: { patient: '12345', 'clinical-status': 'active' }
  );
///...

// Construct our domain model to react
const patient = {
  id: '12345',
  name: `${fhirPatient.resource.name[0].given} ${fhirPatient.resource.name[0].family}`,
  condition: `${fhirCondition.entry[0].code.text || fhirCondition.entry[0].code.coding.display}`,
  // ...
};

```


## Installing

NOTE: If you are on windows, you should consider a bash shell, such as enabling
the [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) ([why?](https://docs.microsoft.com/en-us/windows/wsl/faq)).

```
$ npm install -g create-react-app
$ npm install -g craftool
```

## Using the template

```
$ craft MyFHIRKitApp https://github.com/Vermonster/fhir-kit-create-react/archive/master.zip

$ cd MyFHIRKitApp
$ npm run install-kit
```

## Running the app

`npm start` will use
[Concurrently](https://github.com/kimmobrunfeldt/concurrently) to run
`server/main.js` and `react-scripts start`. The app starts out with an example
of a patient name search using FHIRKit Client surfaced to a React app using
[Ant Design](https://github.com/ant-design/ant-design) UI components.

## Deployment to Heroku

You will need to install the [Heroku CLI
tools](https://devcenter.heroku.com/articles/heroku-cli).

Update the react build with `npm build`. Use the example express server to
serve the new build. For example:

```
$ npm run build
$ git init .
$ git add .
$ git commit -m "Initial commit for my new FHIRKit create react app"
$ heroku create
$ git subtree push --prefix src/server heroku master
$ heroku open
```

## License

MIT

Copyright (c) 2019 Vermonster LLC
