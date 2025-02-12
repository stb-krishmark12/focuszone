const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });
    }

    // Regular purchase email template
    async sendRegularPurchaseEmail(customerEmail, orderID) {
        console.log('Sending regular purchase email to:', customerEmail);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Your Focus Zone Template is Ready! 🚀',
            html: this.getRegularEmailTemplate(orderID)
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Regular purchase email sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending regular purchase email:', error);
            throw error;
        }
    }

    // Gift email template for recipient
    async sendGiftEmail(recipientEmail, senderName, giftMessage, orderID) {
        console.log('Sending gift email to recipient:', recipientEmail);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `${senderName} has sent you a Valentine's Day Gift! 🎁`,
            html: this.getGiftEmailTemplate(senderName, giftMessage, orderID)
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Gift email sent successfully to recipient');
            return true;
        } catch (error) {
            console.error('Error sending gift email:', error);
            throw error;
        }
    }

    // Confirmation email to gift sender
    async sendGiftConfirmationToSender(senderEmail, recipientName, orderID) {
        console.log('Sending gift confirmation to sender:', senderEmail);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: senderEmail,
            subject: `Your Gift to ${recipientName} has been sent! 🎉`,
            html: this.getGiftConfirmationTemplate(recipientName, orderID)
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Gift confirmation sent to sender');
            return true;
        } catch (error) {
            console.error('Error sending gift confirmation:', error);
            throw error;
        }
    }

    // Main method to handle email sending
    async sendTemplateEmail(customerEmail, orderID, paymentData = {}) {
        console.log('Processing email send request:', { customerEmail, orderID, paymentData });

        if (paymentData.isGift) {
            // Send gift email to recipient
            await this.sendGiftEmail(
                paymentData.giftData.recipientEmail,
                paymentData.giftData.senderName,
                paymentData.giftData.giftMessage,
                orderID
            );
            
            // Send confirmation to sender
            await this.sendGiftConfirmationToSender(
                customerEmail,
                paymentData.giftData.recipientName,
                orderID
            );
        } else {
            // Regular purchase
            await this.sendRegularPurchaseEmail(customerEmail, orderID);
        }
    }

    // Template for gift email
    getGiftEmailTemplate(senderName, giftMessage, orderID) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #0984E3;">You've Received a Valentine's Day Gift! 🎁</h1>
                
                <div style="background-color: #fff4f4; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffccd5;">
                    <h2 style="color: #e63946;">A Special Note from ${senderName}</h2>
                    <p style="font-style: italic; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #e63946;">
                        "${giftMessage}"
                    </p>
                </div>

                <p>${senderName} has gifted you The Focus Zone template - a powerful Notion template to help you achieve your goals!</p>

                <div style="background-color: #f5f6fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h2 style="color: #2D3436;">Your Template Link</h2>
                    <p>Click the button below to access your template:</p>
                    <a href="${process.env.TEMPLATE_LINK}" 
                       style="display: inline-block; background-color: #e63946; color: white; 
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

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; 
                            font-size: 12px; color: #666;">
                    <p>Order ID: ${orderID}</p>
                    <p>The Focus Zone © 2025</p>
                </div>
            </div>
        `;
    }

    // Template for regular purchase email
    getRegularEmailTemplate(orderID) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #0984E3;">Thank You for Your Purchase! 🚀</h1>
                
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
        `;
    }

    // Template for gift confirmation to sender
    getGiftConfirmationTemplate(recipientName, orderID) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #0984E3;">Your Valentine's Day Gift has been Sent! 🎉</h1>
                
                <p>Your gift has been successfully sent to ${recipientName}!</p>
                
                <div style="background-color: #f5f6fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h2 style="color: #2D3436;">Gift Details</h2>
                    <p>Recipient: ${recipientName}</p>
                    <p>Product: The Focus Zone Template</p>
                    <p>Order ID: ${orderID}</p>
                </div>

                <p>They will receive an email with the template link and your personal message.</p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; 
                            font-size: 12px; color: #666;">
                    <p>Thank you for spreading productivity! ❤️</p>
                    <p>The Focus Zone © 2025</p>
                </div>
            </div>
        `;
    }
}

module.exports = new EmailService(); 