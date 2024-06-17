var express = require('express')
var cors = require('cors');
const { default: axios } = require('axios');
var bodyParser = require('body-parser');

var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.use(cors(corsOptions))

app.get('/states', async (req, res, next)=> {
  let state = await axios.get("https://gateway-voters.eci.gov.in/api/v1/common/states/")
  res.json({data: state.data, error: null});
});

app.get( '/district/:stateCode', async (req, res, next)=> {
  let district = await axios.get(`https://gateway-voters.eci.gov.in/api/v1/common/constituencies?stateCode=${req.params.stateCode}`)
  res.json({data: district.data, error: null});
});

app.get( '/constituencies/:stateCode/:districtCode', async (req, res, next)=> {
  let constituencies = await axios.get(`https://gateway-voters.eci.gov.in/api/v1/common/acs/${req.params.districtCode}`)
  console.log(`${req.params.stateCode}${req.params.districtCode}`);
  res.json({data: constituencies.data, error: null});
});

app.get( '/partlist/:stateCode/:districtCode/:acNumber', async (req, res, next)=> {
  let partlist = await axios.post(`https://gateway-voters.eci.gov.in/api/v1/printing-publish/get-part-list`,
    {
      "stateCd": req.params.stateCode,
      "districtCd": req.params.stateCode+req.params.districtCode,
      "acNumber": req.params.acNumber
    })
  res.json({data: partlist.data, error: null});
});

app.post('/downloadPdf/:state_name/:district_name/:ac_name/:part_name', async (req, res, next)=> {
  console.log(req.body);
  let file = await axios.post('https://gateway-voters.eci.gov.in/api/v1/printing-publish/generate-published-eroll',req.body)
  
  let pdfFile = Base64.atob(file.data.content)

  let path = "D:/WORKSPACE/DEB_WORKSPACE/Miscellaneous/PDFs/"+str(req.params.state_name)+"/"+str(req.params.district_name)+"/"+str(req.params.ac_name)+"/"
  let fileName = `${req.body.part_number}_${req.params.part_name}.pdf`
  store(pdfFile,path,fileName)

})

app.get('/getcaptcha', async (req, res, next)=> {
  let captcha = axios.get('https://gateway-voters.eci.gov.in/api/v1/captcha-service/generateCaptcha/EROLL')
  res.json({data: (await captcha).data, error: null})
})

app.get('/download/:stateCode/:districtCode/:acNumber/:partNumber')

app.listen(9000, function () {
  console.log('CORS-enabled web server listening on port 80')
});