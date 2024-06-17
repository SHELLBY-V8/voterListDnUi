import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetDistrict, GetStates } from './util';

function District() {
  
  let [district, setDistrict] = useState({});
  let [ac, setAc] = useState({});
  let [partList, setPartList] = useState({});
  let [captcha, setCaptcha] = useState({});
  let [data, setData] = useState({})
  let [refesh, setRefresh] = useState(true)
  
  let state = window.location.pathname.split("/")[1];

  useEffect(() => {
    GetDistrict(state,setDistrict);
  }, []);
  
  useEffect(() => {
    GetCaptcha(setCaptcha);
  }, [refesh]);

  function DownloadPDF (){
    window.location.reload();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>STATE: {state}</p>
        <p>DISTRICT
          <select onChange={(e)=>{window.location.replace(`http://localhost:3000/${state}/${e.target.value}`)}}>
            {district.length > 1 && district?.map(ele=>{
              return <option value={ele.districtCd}>{ele.asmblyName}</option>
            })}
          </select>
        {captcha ? captcha.id: ""}
        </p>
        {captcha ? <img src={`data:image/png;base64,${captcha.captcha}`}/>: ''}
        <hr/>
        <input type="text" placeholder="Enter Captcha" onChange={(e)=>{ console.log(e.target.value); setData(e.target.value)}}></input>
        <hr/>
        <button onClick={()=>{DownloadPDF()}}>SUBMIT</button>
        <hr/>
        <button onClick={()=>{setRefresh(!refesh)}}>Refresh</button>
      </header>
    </div>
  );
}

export default District;
