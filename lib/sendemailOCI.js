var nodemailer = require('nodemailer');





async function enviaremail(from,to,subject,html) {   
    let transporter = nodemailer.createTransport({
      host: "smtp.email.eu-frankfurt-1.oci.oraclecloud.com",
      port: 25,
      secure: false,      
      auth: {
        user: "ocid1.user.oc1..aaaaaaaaehq7nskyg7iiuc5plkhhh67wyoxlgul2boyjatldjhmvnf5qjoxq@ocid1.tenancy.oc1..aaaaaaaaywfum437yxhqfjfwcqh3mekqfv7xn24fdds33dy4bdi52tloiwxa.qw.com", 
        pass: "_I4JPh+eI6#[}wF3PoyX", 
      },
    });


    let info = await transporter.sendMail({
      from: from, 
      to: to, 
      subject: subject,
      html: html, 
    });

    console.log("Message sent: %s", info.messageId);
     
  }

  module.exports = { enviaremail };

  