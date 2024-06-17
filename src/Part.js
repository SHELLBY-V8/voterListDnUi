import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetPart, PdfDownload } from './util';

function Part() {

  let [partList, setPartList] = useState({});
  let [curPartList, setCurPartList] = useState({});
  let [captcha, setCaptcha] = useState({});
  let [refesh, setRefresh] = useState(true);
  let [data, setData] = useState({})
  
  let state = window.location.pathname.split("/")[1];
  let district = window.location.pathname.split("/")[2];
  let acNum = window.location.pathname.split("/")[3];
  
  let stateName= (JSON.parse(localStorage.getItem("states"))?.filter((e) => {return e.stateCd == state}))[0]?.stateName
  let districtName =(JSON.parse(localStorage.getItem("district"))?.filter((e) => {return e.districtCd == district}))[0]?.asmblyName
  let acName =(JSON.parse(localStorage.getItem("constituencies"))?.filter((e) => {return e.asmblyNo == acNum}))[0]?.asmblyName
  
  
  useEffect(() => {
    let curIndex = localStorage.getItem("index");
    GetPart(state,district,acNum,setPartList,setCurPartList, curIndex);
  }, [refesh]);
  
  useEffect(() => {
    GetCaptcha(setCaptcha);
  }, [refesh]);

  function DownloadPDF (){
    let scd = localStorage.getItem("stateCd");
    let dcd = localStorage.getItem("districtCd");
    let acn = localStorage.getItem("acNumber");
    if(curPartList && curPartList?.partNumber){
        let downBody = {
            "stateCd": scd,
            "districtCd": dcd,
            "acNumber": acn,
            "partNumber": curPartList.partNumber,
            "captcha": data,
            "captchaId": captcha.id,
            "langCd": "ENG"
        }
        
        let download = PdfDownload(stateName,districtName,acName,curPartList.partName,downBody)   
        //TODO: 3 Retry if PdfDownload Fails
            //Refesh Captcha on fail
        
        //TODO: Save all parameters in JSON file with error reason returned from API after 3 tries 
            //increment local storage index by 1
            //Refresh the Captcha by toggling "refresh" state

        //TODO: Incase of Success
            //increment local storage index by 1
            //toggle "refresh" state 
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>DOWNLOAD</p>
        {stateName && <span>{stateName}</span>}
        {districtName && <span>{districtName}</span>}
        {acName && <span>{acName}</span>}
        {curPartList.partName && <span>{curPartList.partName}</span>}
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
