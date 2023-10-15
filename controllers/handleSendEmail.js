import nodemailer from 'nodemailer';
export const handleSendEmail=(userEmail,link)=>{

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: process.env.CONFIG_EMAIL,
    pass: process.env.CONFIG_PASSWORD
  },
  secure: true,
});

const mailOptions = {
  from: 'Reset Password @resetpassword.com <donotreply@resetpassword.com>',
  to: userEmail,
  subject: 'Reset Password',
  text: `${link}`,
  html: `<p><a href=${link}>Click here to reset password</a><br/>
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