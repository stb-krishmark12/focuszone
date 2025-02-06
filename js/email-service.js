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
        console.log('Preparing to send email to:', customerEmail);
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
                        <div style="margin: 20px 0;">
                            <h4 style="color: #2D3436;">Watch the Setup Guide:</h4>
                            <iframe src="https://scribehow.com/embed/How_to_Add_The_Focus_Zone_to_Your_Private_Page__aXFNIqOCSlOlEbWmcbqCEw?as=scrollable" 
                                    width="100%" 
                                    height="500" 
                                    style="border: 1px solid #eee; border-radius: 8px;"
                                    allowfullscreen 
                                    frameborder="0">
                            </iframe>
                        </div>
                        <p style="color: #666; font-size: 0.9em;">If the guide doesn't load, <a href="https://scribehow.com/shared/How_to_Add_The_Focus_Zone_to_Your_Private_Page__aXFNIqOCSlOlEbWmcbqCEw" 
                           style="color: #0984E3; text-decoration: none;">click here to view it in your browser</a>.</p>
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
                        Need help? Reply to this email or contact thestbcompany@gmail.com
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
            console.error('Mail options:', {
                ...mailOptions,
                html: '(omitted)'
            });
            throw error;
        }
    }
}

module.exports = new EmailService(); 