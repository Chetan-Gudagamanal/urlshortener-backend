import nodemailer from 'nodemailer';
export const handleSendRegistrationEmail=(userEmail,link)=>{

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CONFIG_EMAIL,
    pass: process.env.CONFIG_PASSWORD
    
  }
});

const mailOptions = {
  from: 'Verify Registration @accountregistration.com <donotreply@resetpassword.com>',
  to: userEmail,
  subject: 'Email Verification',
  text: `${link}`,
  html: `<p><a href=${link}>Click here to varify your email</a><br/>
            If above link is not clickable kindly, copy below url and paste it in browser<br/>
            ${link}
        <p>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
	console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}