import axios from "axios";

export const GetStates = (setState) => {
    axios.get("http://localhost:9000/states").then((res)=>{
        // console.log(res);
        setState(res.data.data) 
        localStorage.setItem("states",JSON.stringify(res.data.data)) 
    })

}

export const GetDistrict = (scd,setState) => {
    axios.get(`http://localhost:9000/district/${scd}`).then((res)=>{
        console.log(res.data.data);
        setState(res.data.data)  
        localStorage.setItem("district",JSON.stringify(res.data.data))
    })

}

export const  GetAc = (scd,dcd,setState) => {
    axios.get(`http://localhost:9000/constituencies/${scd}/${dcd}`).then((res)=>{
        console.log(res.data);
        setState(res.data.data)  
        localStorage.setItem("constituencies",JSON.stringify(res.data.data))
    })

}

export const  GetPart = (scd,dcd,acn,setState,setCurPart) => {
    let curIndex = localStorage.getItem("index");
    axios.get(`http://localhost:9000/partlist/${scd}/${dcd}/${acn}`).then((res)=>{
        setState(res.data.data.payload);
        let partListJ = res.data.data.payload
        let part = partListJ && Object.entries(partListJ)[parseInt(curIndex)][1]
        setCurPart(part) 
        localStorage.setItem("partList",JSON.stringify(res.data.data.payload))
    })
}

export const PdfDownload = async (stateName,districtName,acName,partName,body) => {
    let response = await axios.post(`http://localhost:9000/downloadPdf/${stateName}/${districtName}/${acName}/${partName}`, body).then((res)=>{
        return res.data
    })
    return response
}

export const GetCaptcha = (setCaptcha) => {
    axios.get("http://localhost:9000/getcaptcha").then((res)=>{
        console.log(res.data);
        setCaptcha(res.data.data)
    })
}