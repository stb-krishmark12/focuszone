const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD // Use App Password from Google Account
            }
        });
    }

    async sendTemplateEmail(customerEmail, orderID, customerName = '') {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Your Focus Zone Template is Ready! 🚀',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0984E3;">Thank You${customerName ? ', ' + customerName : ''}!</h1>
                    
                    <p>We're excited to have you start your productivity journey with The Focus Zone template!</p>
                    
                    <div style="background-color: #f5f6fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #2D3436;">Your Template Link</h2>
                        <p>Click the button below to access your template:</p>
                        <a href="${process.env.TEMPLATE_LINK}" 
                           style="display: inline-block; background-color: #00B894; color: white; 
                                  padding: 12px 24px; text-decoration: none; border-radius: 5px; 
                                  margin: 10px 0;">
                            Access Your Template
                        </a>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3>Quick Steps to Get Started:</h3>
                        <ol>
                            <li>Click the template link above</li>
                            <li>Click "Duplicate" in the top right corner</li>
                            <li>The template will be added to your Notion workspace</li>
                        </ol>
                    </div>

                    <div style="background-color: #f5f6fa; padding: 20px; border-radius: 10px;">
                        <h3>For Students:</h3>
                        <p>Get Notion Plus for free! Follow these steps:</p>
                        <ol>
                            <li>Visit notion.so/students</li>
                            <li>Verify with your student email</li>
                            <li>Enjoy Notion Plus features!</li>
                        </ol>
                    </div>

                    <p style="margin-top: 20px;">
                        Need help? Reply to this email or contact support@thefocuszone.com
                    </p>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; 
                                font-size: 12px; color: #666;">
                        <p>Order ID: ${orderID}</p>
                        <p>The Focus Zone © 2025</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Template email sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending template email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService(); 