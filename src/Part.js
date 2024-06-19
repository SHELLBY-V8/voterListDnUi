import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetPart, PdfDownload, logError } from './util';

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
            let parameters = {
                parameter: downBody,
                stateName,
                districtName,
                acName,
                partName: curPartList.partName
            }

            logError(parameters);
            //TODO: LOG ERROR WITH ALL PARAMS
            // Define the path for the JSON file
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
        <div>
            <div className='error'>
                {error}
            </div>
            <div>
                <p>RETRY COUNT: {3-i}</p>
            </div>
        </div>
        
        <div>
            <table>
                <tr><td>State Name</td><td>{stateName && <span>{stateName}</span>}</td></tr>
                <tr><td>District Name</td><td>{districtName && <span>{districtName}</span>}</td></tr>
                <tr><td>AsC Name</td><td>{acName && <span>{acName}</span>}</td></tr>
                <tr><td>Part Number</td><td>{curPartList && <span>{curPartList.partNumber}</span>}</td></tr>
                <tr><td>Part Name</td><td>{curPartList && <span>{curPartList.partName}</span>}</td></tr>
            </table>
        </div>
        <hr></hr>
        {captcha ? <img src={`data:image/png;base64,${captcha.captcha}`}/>: ''}
        <hr></hr>
        <div>
            <div className='row'>
                <input className="input-group-text" type="text" value={data} placeholder="Enter Captcha" onChange={(e)=>{setData(e.target.value)}}></input>
            </div>
            <div className='row'>
                <div className='col-md'>
                    <button className="btn btn-success" onClick={()=>{DownloadPDF()}}>SUBMIT</button>
                </div>
                <div className='col-md'>
                    <button className="btn btn-outline-warning" onClick={()=>{setRefresh(!refesh)}}>Refresh</button>
                </div>
            </div>
        </div>
        <hr></hr>
        <button className="btn btn-info" onClick={()=>{localStorage.setItem("index",(parseInt(localStorage.getItem("index"))+1)); setRefresh(!refesh); setSkip("")}}>SKIP</button>
        <hr></hr>
        <div>
            <input className="input-group-text" type="text" value={skip} placeholder="Enter Skip Number" onChange={(e)=>{setSkip(e.target.value)}}></input>
            <button className="btn btn-info" onClick={()=>{localStorage.setItem("index",(skip-1<0? 0:skip-1)); setRefresh(!refesh); setSkip("")}}>Jump</button>
        </div>
      </header>
    </div>
  );
}

export default Part;
