# FHIRKit Create React App

A [create-react-app](https://github.com/facebook/create-react-app) template
using the [FHIRKit Client](https://github.com/Vermonster/fhir-kit-client) with
an Express.js server.

View an example deployment of the app at
[https://fhir-kit-react.herokuapp.com](http://fhir-kit-react.herokuapp.com/).

## Architecture

This template uses the common BFF (Backend for Frontend) pattern. From our
experience, this separation leads to more efficient and enjoyable development,
as it allows teams to follow conventional React patterns (e.g. use standard
JSON-API -like API and build optimized domain models) and keeps the FHIR logic
in one place, on the server. This pattern also allows us to keep secret keys
and other logic on the server.

For instance, consider patient React component that may show patient name,
active conditions, and most recent heigh, weight, and blood pressure. A simple
flat model in React/BFF can be built. The logic to initiate the multiple FHIR
queries and process the results happens on the server. This also leads to nice
patterns where domain models can be mocked to allow for rapid react
development, independent of FHIR modeling and integration.


```

  +------------------+
  |      EHR         |
  |..................|
  |   FHIR |  OAuth2 |
  +------------------+
           :
           : (FHIR)
           :
  +------------------+  ----.
  | Server (Express) |      |
  +..................+      |
           : (BFF)      this template
  +..................+      |
  |  Client (React)  |      |
  +------------------+  ----'

```


## Installing

NOTE: If you are on windows, you should consider a bash shell, such as enabling
the [WSL](https://docs.microsoft.com/en-us/windows/wsl/about).

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

You will need to install the [Heroku CLI tools](https://devcenter.heroku.com/articles/heroku-cli).

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
