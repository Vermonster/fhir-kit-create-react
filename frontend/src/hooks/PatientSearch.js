import { useState } from "react";

export default function usePatientSearch(name) {
  const [patients, setPatients] = useState([]);
  const loadPatients = () => {
    fetch(`api/patient?name=${name}`, {
      accept: 'application/json'
    })
    .then((response) => (
      response.json()
    ))
    .then((patients) => {
      setPatients(patients || []);
    })
    .catch((err) => {
      console.log(err);
      setPatients([]);
    })
    return patients;
  }
}