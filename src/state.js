import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetStates } from './util';
import { redirect } from 'react-router-dom';

function State() {
  
  let [state, setState] = useState({});
  
  useEffect(() => {
    GetStates(setState);
    localStorage.clear("states")
    localStorage.clear("district")
    localStorage.clear("constituencies")
    localStorage.clear("partList")
    localStorage.clear("statesCd")
    localStorage.clear("districtCd")
    localStorage.clear("acNumber")
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <select onChange={(e)=>{ console.log(e.target.value); localStorage.setItem("stateCd", e.target.value); localStorage.setItem("langCd", "ENG"); window.location.assign(`http://localhost:3000/${e.target.value}`)}}>
            {state.length > 1 && state?.map(ele=>{
              return <option value={ele.stateCd}>{ele.stateName}</option>
            })}
          </select>
        </p>
      </header>
    </div>
  );
}

export default State;
