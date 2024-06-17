import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetAc, GetCaptcha, GetDistrict, GetPart, GetStates, PdfDownload } from './util';

function Part() {

  let [partList, setPartList] = useState({});
  let [captcha, setCaptcha] = useState({});
  let [refesh, setRefresh] = useState(true);
  let [data, setData] = useState({})
  
  let state = window.location.pathname.split("/")[1];
  let district = window.location.pathname.split("/")[2];
  let acNum = window.location.pathname.split("/")[3];
  let stateName= (JSON.parse(localStorage.getItem("states"))?.filter((e) => {return e.stateCd == state}))[0]?.stateName
  let districtName =(JSON.parse(localStorage.getItem("district"))?.filter((e) => {return e.districtCd == district}))[0]?.asmblyName
  let acName =(JSON.parse(localStorage.getItem("constituencies"))?.filter((e) => {return e.asmblyNo == acNum}))[0]?.asmblyName
  let partName = "";
  let partCode = "";
  let part = {};
  let curIndex = localStorage.getItem("index");
  
  
  useEffect(() => {
    GetPart(state,district,acNum,setPartList);
  }, []);

  useEffect(()=>{
    let partListJ = JSON.parse(localStorage.getItem("partList"))
    part = partListJ && Object.entries(partListJ)[curIndex][1]//partList.filter((ele, i)=>{i==curIndex});
    console.log(part)
    partName = part.partName;
    partCode = part.partNumber;
  },[partList])
  
  useEffect(() => {
    GetCaptcha(setCaptcha);
  }, [refesh]);

  function DownloadPDF (){
    let scd = localStorage.getItem("stateCd");
    let dcd = localStorage.getItem("districtCd");
    let acn = localStorage.getItem("acNumber");
    console.log(partCode);
    if(part && part?.partNumber){
        let downBody = {
            "stateCd": scd,
            "districtCd": dcd,
            "acNumber": acn,
            "partNumber": part.partNumber,
            "captcha": data,
            "captchaId": captcha.id,
            "langCd": "ENG"
        }
        console.log(downBody)
        let download = PdfDownload(stateName,districtName,acName,partName,downBody)
        
    }

    // window.location.reload();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>DOWNLOAD</p>
        {stateName && <span>{stateName}</span>}
        {districtName && <span>{districtName}</span>}
        {acName && <span>{acName}</span>}
        {partName && <span>{partName}</span>}
        <hr/>
        {captcha ? <img src={`data:image/png;base64,${captcha.captcha}`}/>: ''}
        <hr/>
        <input type="text" placeholder="Enter Captcha" onChange={(e)=>{setData(e.target.value)}}></input>
        <hr/>
        <button onClick={()=>{DownloadPDF()}}>SUBMIT</button>
        <hr/>
        <button onClick={()=>{setRefresh(!refesh)}}>Refresh</button>
      </header>
    </div>
  );
}

export default Part;
