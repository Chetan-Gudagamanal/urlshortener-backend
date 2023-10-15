// import nodemailer from 'nodemailer';
// export const handleSendRegistrationEmail=(userEmail,link)=>{

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.CONFIG_EMAIL,
//     pass: process.env.CONFIG_PASSWORD
    
//   }
// });

// const mailOptions = {
//   from: 'Verify Registration @accountregistration.com <donotreply@resetpassword.com>',
//   to: userEmail,
//   subject: 'Email Verification',
//   text: `${link}`,
//   html: `<p><a href=${link}>Click here to varify your email</a><br/>
//             If above link is not clickable kindly, copy below url and paste it in browser<br/>
//             ${link}
//         <p>`
// };


// async function main() {
//   const info = await transporter.sendMail(mailOptions);

//   console.log("Message sent: %s", info.messageId);
// }

// main().catch(console.error)
// }


import nodemailer from 'nodemailer';
export const handleSendRegistrationEmail=async (userEmail,link) => {

  
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      auth: {
          user: process.env.WEB_MAILER,
          pass: process.env.WEB_MAILER_PASSWORD,
      },
      secure: true,
  });
  
  await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              console.log("Server is ready to take our messages");
              resolve(success);
          }
      });
  });
  
  const mailData = {
    from: 'Verify Registration @accountregistration.com <donotreply@resetpassword.com>',
    to: userEmail,
    subject: 'Email Verification',
    text: `${link}`,
    html: `<p><a href=${link}>Click here to varify your email</a><br/>
              If above link is not clickable kindly, copy below url and paste it in browser<br/>
              ${link}
          <p>`
  };
  
  await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
  });
  res.status(200).json({ status: "OK" });
};