var express = require('express')
var cors = require('cors');
const { default: axios } = require('axios');
var bodyParser = require('body-parser');
var fs = require('fs'); 

var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.use(cors(corsOptions));

async function uploadFile() {
  const auth = await authenticate({
      keyfilePath: path.join(__dirname, 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
      name: 'file.pdf',
  };

  const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath),
  };

  try {
      const file = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id',
      });
      console.log('File Id: ', file.data.id);
  } catch (error) {
      console.error('Error uploading file:', error);
  }
}


function savePdf(data,location){
  const buffer = Buffer.from(data, 'base64');
  fs.writeFileSync(location, buffer);
      
  //TODO: save file in Google Drive (Create Folder Permission Required) or Local Storage
}

app.get('/states', async (req, res, next)=> {
  let state = await axios.get("https://gateway-voters.eci.gov.in/api/v1/common/states/")
  res.json({data: state.data, error: null});
});

app.get( '/district/:stateCode', async (req, res, next)=> {
  let district = await axios.get(`https://gateway-voters.eci.gov.in/api/v1/common/districts/${req.params.stateCode}`)
  res.json({data: district.data, error: null});
});

app.get( '/constituencies/:stateCode/:districtCode', async (req, res, next)=> {
  let constituencies = await axios.get(`https://gateway-voters.eci.gov.in/api/v1/common/acs/${req.params.districtCode}`)
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
  console.log("DOWNLOAD STARTED -- "+req.params.state_name+"/"+req.params.district_name+"/"+req.params.ac_name+"/"+req.params.part_name)
  await axios.post('https://gateway-voters.eci.gov.in/api/v1/printing-publish/generate-published-eroll',req.body).then((res1)=>{
    if(res1.data.statusCode === 200){
      filePath = "D:/WORKSPACE/DEB_WORKSPACE/Miscellaneous/PDFs/"+req.params.state_name+"/"+req.params.district_name+"/"+req.params.ac_name+"/"

      if (!fs.existsSync(filePath)){
        fs.mkdirSync(filePath, { recursive: true });
      }

      fileName = `${req.body.partNumber}_${req.params.part_name}.pdf`
      savePdf(res1.data.file,(filePath+fileName));
      res.json({success: true, data: "Successfully Downloaded", error: null});
      console.log("DOWNLOAD COMPLETED -- "+req.params.state_name+"/"+req.params.district_name+"/"+req.params.ac_name+"/"+req.params.part_name)
    }
    else {
      res.statusCode = 401;
      res.json({success: false, data: "Error Downloading", error: null});
      console.log("DOWNLOAD FAILED -- "+req.params.state_name+"/"+req.params.district_name+"/"+req.params.ac_name+"/"+req.params.part_name)
    }
  }).catch((error)=>{
    res.statusCode = 201;
    res.json({success: false, data: error.response.data.message, error: error.message});
    console.log("DOWNLOAD FAILED -- "+req.params.state_name+"/"+req.params.district_name+"/"+req.params.ac_name+"/"+req.params.part_name)
  })
})

app.get('/getcaptcha', async (req, res, next)=> {
  let captcha = axios.get('https://gateway-voters.eci.gov.in/api/v1/captcha-service/generateCaptcha/EROLL')
  res.json({data: (await captcha).data, error: null})
})

app.listen(9000, function () {
  console.log('CORS-enabled web server listening on port 80')
});