/**
 * POST /api/submit
 * Handle contact form submissions for Aden Enterprises
 */
export async function onRequestPost(context) {
  try {
    // Parse the form data
    let input = await context.request.formData();

    // Convert FormData to JSON object
    // Handle multiple values per key (like checkboxes)
    let formData = {};
    for (let [key, value] of input) {
      // Skip honeypot and form-name fields
      if (key === 'bot-field' || key === 'form-name') continue;

      let existing = formData[key];
      if (existing === undefined) {
        formData[key] = value;
      } else {
        formData[key] = [].concat(existing, value);
      }
    }

    // Check honeypot for spam protection
    const honeypot = input.get('bot-field');
    if (honeypot) {
      return new Response('Spam detected', { status: 400 });
    }

    // Log the submission (you can see this in the Real-time Logs section)
    console.log('Contact form submission:', JSON.stringify(formData, null, 2));

    // Send email notification
    try {
      await sendEmailNotification(formData, context.env);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue even if email fails - don't break user experience
    }

    // Redirect to success page
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/contact-success',
      },
    });
  } catch (err) {
    console.error('Form submission error:', err);
    return new Response('Error processing form submission', { status: 500 });
  }
}

/**
 * Send email notification using Cloudflare Email Workers
 */
async function sendEmailNotification(formData, env) {
  // Format the email content
  const emailBody = `
New Contact Form Submission - Aden Enterprises

Details:
- First Name: ${formData.firstName || 'Not provided'}
- Last Name: ${formData.lastName || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}
- Email: ${formData.email || 'Not provided'}
- Message: ${formData.message || 'Not provided'}

Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} (Mountain Time)

---
This email was sent automatically from the Aden Enterprises contact form.
Website: ${formData.email ? `Reply to: ${formData.email}` : 'No email provided'}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2c3e50; margin-top: 0;">New Contact Form Submission - Aden Enterprises</h2>

        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #34495e; margin-top: 0;">Contact Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">First Name:</td><td style="padding: 8px 0;">${formData.firstName || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Last Name:</td><td style="padding: 8px 0;">${formData.lastName || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${formData.phone || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;">${formData.email || 'Not provided'}</td></tr>
            </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #34495e; margin-top: 0;">Message:</h3>
            <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 0;">
                ${formData.message || 'No message provided'}
            </p>
        </div>

        <div style="text-align: center; color: #7f8c8d; font-size: 14px; margin-top: 30px;">
            <p>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} (Mountain Time)</p>
            <p>This email was sent automatically from the Aden Enterprises contact form.</p>
        </div>
    </div>
</body>
</html>
  `.trim();

  // Use Cloudflare's Email Workers API
  try {
    // Check if email binding is available
    if (!env.EMAIL) {
      console.log('Email binding not configured. Email content that would be sent:');
      console.log('To: kellee@prairiegiraffe.com');
      console.log('From: noreply@adenentllc.com');
      console.log('Subject:', `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`);
      console.log('Body:', emailBody);
      return;
    }

    // Send email using Cloudflare Email Workers
    await env.EMAIL.send({
      from: 'noreply@adenentllc.com',
      to: 'kellee@prairiegiraffe.com',
      subject: `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`,
      text: emailBody,
      html: htmlBody,
    });

    console.log('Email notification sent successfully to kellee@prairiegiraffe.com via Cloudflare Email Workers');
  } catch (error) {
    console.error('Failed to send email via Cloudflare Email Workers:', error);

    // Fallback: Log the email content for debugging
    console.log('Email content that failed to send:');
    console.log('To: kellee@prairiegiraffe.com');
    console.log('From: noreply@adenentllc.com');
    console.log('Subject:', `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`);
    console.log('Body:', emailBody);

    throw error; // Re-throw to be caught by the main function
  }
}
