import './App.css';
import { useEffect, useState } from 'react';
import {GetErr} from './util';

function Error() {

  let [errorList, setErrorList] = useState({});

  useEffect(() => {
    GetErr(setErrorList);
    localStorage.setItem('index',0)
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <p>
          <select  class="form-select" aria-label="Default select example" onChange={(e)=>{window.location.assign(`http://localhost:3000/error/${e.target.value}`)}}>
          <option>CHOOSE ERROR LOG</option>

            {errorList.length > 0 && errorList?.map(ele=>{
              return <option value={ele.value}>{ele.name}</option>
            })}
          </select>
        </p>
      </header>
    </div>
  );
}

export default Error;
