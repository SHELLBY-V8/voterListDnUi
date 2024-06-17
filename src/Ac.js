import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetAc, GetCaptcha, GetDistrict, GetPart, GetStates } from './util';

function Ac() {

  let [ac, setAc] = useState({});
  let [partList, setPartList] = useState({});

  
  let state = window.location.pathname.split("/")[1];
  let district = window.location.pathname.split("/")[2];
  let districtName =(JSON.parse(localStorage.getItem("district"))?.filter((e) => {return e.districtCd == district}))[0]?.districtValue
  let stateName= (JSON.parse(localStorage.getItem("states"))?.filter((e) => {return e.stateCd == state}))[0]?.stateName

  useEffect(() => {
    localStorage.setItem("index",0)
    GetAc(state,district,setAc);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>STATE: {stateName}</p>
        <p>DISTRICT: {districtName}</p>
        <p>
          <select onChange={(e)=>{localStorage.setItem("index", 0); localStorage.setItem("acNumber", e.target.value); window.location.assign(`http://localhost:3000/${state}/${district}/${e.target.value}`)}}>
          <option>CHOOSE ASSEMBLY</option>

            {ac.length > 1 && ac?.map(ele=>{
              return <option value={ele.asmblyNo}>{ele.asmblyName}</option>
            })}
          </select>
        </p>
      </header>
    </div>
  );
}

export default Ac;
