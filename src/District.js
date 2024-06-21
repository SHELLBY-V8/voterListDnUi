import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetDistrict, GetStates } from './util';

function District() {
  
  let state = window.location.pathname.split("/")[2];
  console.log(state);
  let [district, setDistrict] = useState({});
  let stateName= (JSON.parse(localStorage.getItem("states"))?.filter((e) => {return e.stateCd == state}))[0]?.stateName
  

  useEffect(() => {
    GetDistrict(state,setDistrict);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p style={{fontSize:"18px"}}>STATE: {stateName}</p>
        <p>
          <select  class="form-select" aria-label="Default select example" onChange={(e)=>{localStorage.setItem("districtCd", e.target.value);  window.location.assign(`http://3.110.159.106:3000/dwn/${state}/${e.target.value}`)}}>
          <option>CHOOSE DISTRICT</option>

            {district.length > 1 && district?.map(ele=>{
              return <option value={ele.districtCd}>{ele.districtValue}</option>
            })}
          </select>
        </p>
      </header>
    </div>
  );
}

export default District;
