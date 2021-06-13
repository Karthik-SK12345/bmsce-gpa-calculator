  var nodemailer = require('nodemailer');
  const express = require('express')
  const bodyParser = require('body-parser');
  const fs = require('fs')
  const multer = require('multer')
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'))
  app.use(bodyParser.json())

  var to;
  var subject;
  var body;
  var path

  var Storage = multer.diskStorage({
      destination: function(req, file, callback) {
          callback(null, "./BMSCE-GRADE-CARD");
      },
      filename: function(req, file, callback) {
          callback(null, file.originalname);
      }
  });

  var upload = multer({
      storage: Storage
  }).single("image"); //Field name and max count

  app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html')
  })

  app.post('/sendemail', (req, res) => {
      upload(req, res, function(err) {
          if (err) {
              console.log(err)
              return res.end("Something went wrong!");
          } else {
              to = req.body.to
              subject = req.body.subject
              body = req.body.subject
              path = req.file.path
              console.log(to)
              console.log(subject)
              console.log(body)
              console.log(req.file)
              console.log(req.files)
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'bmscegpacalculator@gmail.com',
                      pass: 'Skart@123'
                  }
              });


              var mailOptions = {
                  from: 'bmscegpacalculator@gmail.com',
                  to: to,


                  subject: "GRADE CARD",
                  html: "<h3 style='display:block;'>Hello,</h3><h5>Thanks for using BMSCE GP CALCULATOR</h5><h5>Below we have attached Your Grade Card. Hope you like it. </h5><h5>Thank You,</h5><h5>BMSCE GP CALCULATOR.</h5>",
                  attachments: [{
                      path: path
                  }],
                  amp: `<!doctype html>
                  <html ⚡4email>
                    <head>
                      <meta charset="utf-8">
                      <style amp4email-boilerplate>body{visibility:hidden}</style>
                      <script async src="https://cdn.ampproject.org/v0.js"></script>
                      <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
                    </head>
                    <body>
                      <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
                      <p>GIF (requires "amp-anim" script in header):<br/>
                        <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
                    </body>
                  </html>`

              };

              transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                      console.log(error);
                  } else {
                      console.log('Email sent: ' + info.response);
                      fs.unlink(path, function(err) {
                          if (err) {
                              return res.end(err)
                          } else {
                              console.log("deleted")
                              return res.redirect('/result.html')
                          }
                      })
                  }
              });
          }
      })
  })
  const port = process.env.PORT || '5000';
  app.listen(port, () => console.log(`Server started on Port ${port}`));