import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetPart, PdfDownload } from './util';

function Part() {

  let [partList, setPartList] = useState({});
  let [curPartList, setCurPartList] = useState({});
  let [captcha, setCaptcha] = useState({});
  let [refesh, setRefresh] = useState(true);
  let [data, setData] = useState("")
  let [skip, setSkip] = useState("")
  let [error, setError] = useState("")
  let [i, setI] = useState(0)
  
  let state = window.location.pathname.split("/")[1];
  let district = window.location.pathname.split("/")[2];
  let acNum = window.location.pathname.split("/")[3];

  let stateName= (JSON.parse(localStorage.getItem("states"))?.filter((e) => {return e.stateCd == state}))[0]?.stateName
  let districtName =(JSON.parse(localStorage.getItem("district"))?.filter((e) => {return e.districtCd == district}))[0]?.districtValue
  let acName =(JSON.parse(localStorage.getItem("constituencies"))?.filter((e) => {return e.asmblyNo == acNum}))[0]?.asmblyName
  
  
  useEffect(() => {
    GetPart(state,district,acNum,setPartList,setCurPartList);
  }, [refesh]);
  
  useEffect(() => {
    GetCaptcha(setCaptcha);
  }, [refesh]);

  async function DownloadPDF (){
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

        let curIndex = parseInt(localStorage.getItem("index"));
        let download = await PdfDownload(stateName,districtName,acName,curPartList.partName,downBody);
        if(i>=2 && !download.success){
            //TODO: LOG ERROR WITH ALL PARAMS
            localStorage.setItem("index",(curIndex+1).toString());
            setRefresh(!refesh);
            setError("");
            setData("");
            setI(0);
        } else if (download.success) {
            localStorage.setItem("index",(curIndex+1).toString());
            setRefresh(!refesh);
            setError("");
            setData("");
            setI(0);
        } else {
            setI((i+1));
            setRefresh(!refesh);
            setData("");
            setError(download.data);
        }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <span>{error}</span>
        RETRY COUNT:  <span>{3-i}</span>
        <p>State: {stateName && <span>{stateName}</span>}</p>
        <p>District: {districtName && <span>{districtName}</span>}</p>
        <p>AC Name: {acName && <span>{acName}</span>}</p>
        <p>Part Name: {curPartList.partName && <span>{curPartList.partNumber} {curPartList.partName}</span>}</p>
        <hr/>
        {captcha ? <img src={`data:image/png;base64,${captcha.captcha}`}/>: ''}
        <hr/>
        <input type="text" value={data} placeholder="Enter Captcha" onChange={(e)=>{setData(e.target.value)}}></input>
        <hr/>
        <button onClick={()=>{DownloadPDF()}}>SUBMIT</button>
        <button onClick={()=>{setRefresh(!refesh)}}>Refresh</button>

      <hr/>
      <input type="text" value={skip} placeholder="Enter Skip Number" onChange={(e)=>{setSkip(e.target.value)}}></input>
      <button onClick={()=>{localStorage.setItem("index",(skip-1<0? 0:skip-1)); setRefresh(!refesh); setSkip("")}}>Jump</button>

      </header>
    </div>
  );
}

export default Part;
