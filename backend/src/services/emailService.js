import crypto from 'crypto';
import { Resend } from 'resend';

/**
 * Email Service using Resend
 *
 * Resend Setup Instructions (Super Easy!):
 * 1. Sign up at https://resend.com (Free: 3,000 emails/month)
 * 2. Get API key from dashboard
 * 3. Add RESEND_API_KEY to .env file
 * 4. Done! No sender verification needed!
 */

class EmailService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    this.fromName = process.env.FROM_NAME || 'PushToolkit';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    this.isDevelopment = process.env.NODE_ENV !== 'production';

    // Initialize Resend
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
      console.log('✓ Resend email service initialized');
    } else {
      console.warn('⚠ RESEND_API_KEY not set - emails will be logged to console only');
      this.resend = null;
    }
  }

  /**
   * Generate a secure random token
   */
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, token, userName) {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    const emailContent = {
      to: email,
      from: this.fromEmail,
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">PushToolkit</p>
      `,
      text: `
        Password Reset Request

        Hi ${userName},

        You requested to reset your password. Copy and paste this link to set a new password:
        ${resetUrl}

        This link will expire in 1 hour.

        If you didn't request this, please ignore this email.
      `
    };

    return this._sendEmail(emailContent);
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(email, token, userName) {
    const verifyUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    const emailContent = {
      to: email,
      from: this.fromEmail,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Welcome to PushToolkit!</h2>
        <p>Hi ${userName},</p>
        <p>Thanks for signing up! Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">PushToolkit</p>
      `,
      text: `
        Welcome to PushToolkit!

        Hi ${userName},

        Thanks for signing up! Please verify your email address by copying and pasting this link:
        ${verifyUrl}

        This link will expire in 24 hours.

        If you didn't create an account, please ignore this email.
      `
    };

    return this._sendEmail(emailContent);
  }

  /**
   * Internal method to send email via Resend
   */
  async _sendEmail(emailContent) {
    // If Resend is not configured, log to console (development mode)
    if (!this.resend) {
      console.log('\n=== EMAIL (Console Mode - No Resend API Key) ===');
      console.log('To:', emailContent.to);
      console.log('From:', emailContent.from);
      console.log('Subject:', emailContent.subject);
      console.log('Body:', emailContent.text);
      console.log('HTML:', emailContent.html.substring(0, 200) + '...');
      console.log('==============================================\n');
      return { success: true };
    }

    // Send via Resend
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.fromName} <${emailContent.from}>`,
        to: emailContent.to,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`✓ Email sent to ${emailContent.to}: ${emailContent.subject}`);
      return { success: true, data };
    } catch (error) {
      console.error('Resend error:', error.message);

      // If Resend fails, log the email for debugging
      if (this.isDevelopment) {
        console.log('\n=== EMAIL (Resend Failed - Logging to Console) ===');
        console.log('To:', emailContent.to);
        console.log('Subject:', emailContent.subject);
        console.log('Error:', error.message);
        console.log('===============================================\n');
      }

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

export default new EmailService();
