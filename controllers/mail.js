const { MailtrapClient } = require('mailtrap');
const fs = require('fs');

const templatePath = 'templates/email-template.html';
const templateContent = fs.readFileSync(templatePath, 'utf-8');

const sendMail = async (req, res) => {
    const client = new MailtrapClient({endpoint: process.env.ENDPOINT, token: process.env.MAILTRAP_TOKEN});
    const sender = {name: 'Vinquizitor', email: process.env.SENDER_EMAIL};

    try {

        // const {name, subject, email, message} = req.body;
        let name = req.body.name;
        let subject = req.body.subject;
        let email = req.body.email;
        let message = req.body.message;

        if (!name || !subject || !email || !message) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        const emailHtml = replacePlaceholders(templateContent, {name, subject, email, message});

        client.send({
            from: sender,
            to: [{email: process.env.RECIPIENT_EMAIL}],
            subject: `New message from ${name} with subject ${subject}`,
            text: `New message\n\nSubject: ${subject}\nFrom: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: emailHtml,
            category: "Testing mail"
        }).then((result) => {
            // console.log('Email sent...', 'Message ids: ' + result.message_ids);
            res.status(200).json({message: 'Success'});
        }).catch((error) => {
            console.error('Error sending mail:',error);
            res.status(500).json({error: 'Error sending email'});
        });

    } catch(error) {
        console.error('Error sending email:', error);
        res.status(500).json({error: 'Error sending email'});
    }
}

function replacePlaceholders(html, data) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const placeholder = `{{${key}}}`;
            html = html.replace(new RegExp(placeholder, 'g'), data[key]);
        }
    }

    return html;
}

module.exports = {
    sendMail
}