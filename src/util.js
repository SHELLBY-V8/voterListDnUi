import axios from "axios";

export const GetStates = (setState) => {
    axios.get("http://3.110.159.106:9000/states").then((res)=>{
        // console.log(res);
        setState(res.data.data) 
        localStorage.setItem("states",JSON.stringify(res.data.data)) 
    })

}

export const GetDistrict = (scd,setState) => {
    axios.get(`http://3.110.159.106:9000/district/${scd}`).then((res)=>{
        console.log(res.data.data);
        setState(res.data.data)  
        localStorage.setItem("district",JSON.stringify(res.data.data))
    })

}

export const  GetAc = (scd,dcd,setState) => {
    axios.get(`http://3.110.159.106:9000/constituencies/${scd}/${dcd}`).then((res)=>{
        console.log(res.data);
        setState(res.data.data)  
        localStorage.setItem("constituencies",JSON.stringify(res.data.data))
    })

}

export const  GetPart = (scd,dcd,acn,setState,setCurPart) => {
    let curIndex = localStorage.getItem("index");
    axios.get(`http://3.110.159.106:9000/partlist/${scd}/${dcd}/${acn}`).then((res)=>{
        setState(res.data.data.payload);
        let partListJ = res.data.data.payload
        let part = partListJ && Object.entries(partListJ)[parseInt(curIndex)][1]
        setCurPart(part) 
        localStorage.setItem("partList",JSON.stringify(res.data.data.payload))
    })
}

export const PdfDownload = async (stateName,districtName,acName,partName,body) => {
    let response = await axios.post(`http://3.110.159.106:9000/downloadPdf/${stateName}/${districtName}/${acName}/${partName}`, body).then((res)=>{
        return res.data
    })
    return response
}

export const GetCaptcha = (setCaptcha) => {
    axios.get("http://3.110.159.106:9000/getcaptcha").then((res)=>{
        console.log(res.data);
        setCaptcha(res.data.data)
    })
}

export const logError = (parameters) => {
    axios.post('http://3.110.159.106:9000/logerror',parameters);
}

export const GetErr = (setState) => {
    axios.get('http://3.110.159.106:9000/allerror').then((res)=>{
        let data = res.data.data
        let master = []
        data.forEach(ele=>{
            console.log(ele);
            let temp = { name: ele, value: ele}
            master.push(temp)
        })
        setState(master);
    });
}

export const GetErrorData = (err,setError,setCur) =>{
    let curIndex = localStorage.getItem("index");
    axios.post('http://3.110.159.106:9000/errordata',{file: err}).then((res)=>{
        let data = res.data.data;
        setError(data)
        let part = data && Object.entries(data)[parseInt(curIndex)][1]
        setCur(part)
        localStorage.setItem('error',res.data.data)
    })
}