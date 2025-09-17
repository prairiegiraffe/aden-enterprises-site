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
 * Send contact form data to Make.com webhook for processing
 * This approach is client-friendly: no DNS changes, no domain verification, no email service setup
 */
async function sendEmailNotification(formData, env) {
  // Prepare data for Make.com webhook
  const webhookData = {
    // Website/client information
    website: 'Aden Enterprises, LLC',
    domain: 'adenentllc.com',
    submissionId: `aden-${Date.now()}`, // Unique ID for tracking

    // Form data
    firstName: formData.firstName || 'Not provided',
    lastName: formData.lastName || 'Not provided',
    phone: formData.phone || 'Not provided',
    email: formData.email || 'Not provided',
    message: formData.message || 'Not provided',

    // Metadata
    timestamp: new Date().toISOString(),
    timezone: 'America/Denver',
    userAgent: env.request?.headers?.get('User-Agent') || 'Unknown',

    // Email routing
    destinationEmail: 'kellee@prairiegiraffe.com',

    // Future AI filtering data
    spamScore: 0, // Placeholder for future AI spam detection
    category: 'contact-form', // For routing/filtering
  };

  // Make.com webhook URL (Prairie Giraffe universal webhook)
  const webhookUrl = 'https://hook.us1.make.com/4cc22ksg4lqahuu2w8kom41rq0llnru4';

  try {
    console.log('Sending contact form data to Make.com webhook:', JSON.stringify(webhookData, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Workers/1.0 (Aden Enterprises Contact Form)',
      },
      body: JSON.stringify(webhookData),
    });

    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Contact form successfully sent to Make.com webhook');
      console.log('Response:', responseText);
    } else {
      throw new Error(`Make.com webhook responded with status ${response.status}: ${await response.text()}`);
    }
  } catch (error) {
    console.error('❌ Failed to send to Make.com webhook:', error);

    // Fallback: Log the data that failed to send
    console.log('Contact form data that failed to send to webhook:');
    console.log('Webhook URL:', webhookUrl);
    console.log('Data:', JSON.stringify(webhookData, null, 2));

    // Don't throw - we want the form to still redirect to success page
    // The user doesn't need to know about webhook failures
  }
}
