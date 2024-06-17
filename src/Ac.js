import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetAc, GetCaptcha, GetDistrict, GetStates } from './util';

function Ac() {

  let [ac, setAc] = useState({});
  let [partList, setPartList] = useState({});
  let [captcha, setCaptcha] = useState({});
  let [data, setData] = useState({})
  let [refesh, setRefresh] = useState(true)
  
  let state = window.location.pathname.split("/")[1];
  let district = window.location.pathname.split("/")[1];

  useEffect(() => {
    GetAc(state,district,setAc);
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
        <p>DISTRICT
          <select onChange={(e)=>{window.location.replace(`http://localhost:3000/${state}/${e.target.value}`)}}>
            {ac.length > 1 && ac?.map(ele=>{
              return <option value={ele.asmblyNo}>{ele.asmblyName}</option>
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

export default Ac;
