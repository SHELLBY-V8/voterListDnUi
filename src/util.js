import axios from "axios";

export const GetStates = (setState) => {
    axios.get("http://localhost:9000/states").then((res)=>{
        // console.log(res);
        setState(res.data.data)  
    })

}

export const GetDistrict = (scd,setState) => {
    axios.get(`http://localhost:9000/district/${scd}`).then((res)=>{
        // console.log(res);
        setState(res.data.data)  
    })

}

export const GetAc = (scd,dcd,setState) => {
    axios.get(`http://localhost:9000/constituencies/${scd}/${dcd}`).then((res)=>{
        // console.log(res);
        setState(res.data.data)  
    })

}




export const GetCaptcha = (setCaptcha) => {
    axios.get("http://localhost:9000/getcaptcha").then((res)=>{
        console.log(res.data);
        setCaptcha(res.data.data)
    })
}