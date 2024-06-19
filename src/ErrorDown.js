import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GetCaptcha, GetErrorData, GetPart, PdfDownload, logError } from './util';

function ErrorDown() {

  let [curPartList, setCurPartList] = useState({});
  let [captcha, setCaptcha] = useState({});
  let [refesh, setRefresh] = useState(true);
  let [data, setData] = useState("")
  let [skip, setSkip] = useState("")
  let [error, setError] = useState("")
  let [errorList, setErrorList] = useState("")
  let [i, setI] = useState(0)
  
  let err= window.location.pathname.split("/")[2];

  let stateName="";
  let districtName = "";
  let acName = "";
  
  
  useEffect(() => {
    GetErrorData(err,setErrorList,setCurPartList);
  }, [refesh]);
  
  useEffect(() => {
    GetCaptcha(setCaptcha);
  }, [refesh]);

  async function DownloadPDF (){
    let scd = localStorage.getItem("stateCd");
    let dcd = localStorage.getItem("districtCd");
    let acn = localStorage.getItem("acNumber");
    if(curPartList && curPartList?.parameter){
        let downBody = curPartList.parameter
        downBody.captcha = data;
        downBody.captchaId = captcha.id
        stateName = curPartList.stateName
        districtName = curPartList.districtName
        acName = curPartList.acName

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
            if(curIndex+1 < errorList.length )
                localStorage.setItem("index",(curIndex+1).toString());
            setRefresh(!refesh);
            setError("");
            setData("");
            setI(0);
        } else if (download.success) {
            if(curIndex+1 < errorList.length )
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
                <tr><td>State Name</td><td>{curPartList && <span>{curPartList.stateName}</span>}</td></tr>
                <tr><td>District Name</td><td>{curPartList && <span>{curPartList.districtName}</span>}</td></tr>
                <tr><td>AsC Name</td><td>{curPartList && <span>{curPartList.acName}</span>}</td></tr>
                <tr><td>Part Number</td><td>{curPartList && <span>{curPartList?.parameter?.partNumber}</span>}</td></tr>
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

export default ErrorDown;
