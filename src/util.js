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
        // console.log(res);
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

export const  GetPart = (scd,dcd,acn,setState,setCurPart,index) => {
    axios.get(`http://localhost:9000/partlist/${scd}/${dcd}/${acn}`).then((res)=>{
        console.log(res.data);
        setState(res.data.data.payload);
        let partListJ = res.data.data.payload
        let part = partListJ && Object.entries(partListJ)[index][1]
        setCurPart(part) 
        localStorage.setItem("partList",JSON.stringify(res.data.data.payload))
    })
}

export const PdfDownload = (stateName,districtName,acName,partName,body) => {
    axios.post(`http://localhost:9000/downloadPdf/${stateName}/${districtName}/${acName}/${partName}`, body).then((res)=>{
        console.log(res.data)
    })
}

export const GetCaptcha = (setCaptcha) => {
    axios.get("http://localhost:9000/getcaptcha").then((res)=>{
        console.log(res.data);
        setCaptcha(res.data.data)
    })
}