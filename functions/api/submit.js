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
        'Location': '/contact-success'
      }
    });

  } catch (err) {
    console.error('Form submission error:', err);
    return new Response('Error processing form submission', { status: 500 });
  }
}

/**
 * Send email notification using Cloudflare's email service
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
  `.trim();

  // Use a simple email service API (we'll use EmailJS or similar service)
  // For production, you might want to use Cloudflare's email routing or a service like SendGrid

  const emailData = {
    to: 'kellee@prairiegiraffe.com',
    from: 'noreply@adenentllc.com',
    subject: `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`,
    text: emailBody,
    html: emailBody.replace(/\n/g, '<br>')
  };

  // For now, we'll use a webhook service like Zapier or a simple email API
  // This is a placeholder - you'll need to configure an actual email service
  console.log('Email would be sent to kellee@prairiegiraffe.com:', emailData);

  // For testing: Use EmailJS free service (no API key needed for basic usage)
  // In production, you should use a proper email service with authentication

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'default_service', // You'll need to replace with actual service ID
        template_id: 'template_contact', // You'll need to replace with actual template ID
        user_id: 'YOUR_EMAILJS_USER_ID', // You'll need to replace with actual user ID
        template_params: {
          to_email: 'kellee@prairiegiraffe.com',
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email || 'no-reply@adenentllc.com',
          subject: `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`,
          message: emailBody
        }
      })
    });

    if (response.ok) {
      console.log('Email notification sent successfully to kellee@prairiegiraffe.com');
    } else {
      console.error('Failed to send email notification:', await response.text());
    }
  } catch (fetchError) {
    // For now, just log the email content since we need to set up the email service
    console.log('Email service not configured yet. Email content that would be sent:');
    console.log('To: kellee@prairiegiraffe.com');
    console.log('Subject:', emailData.subject);
    console.log('Body:', emailBody);
  }
}