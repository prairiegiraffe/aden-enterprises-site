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

    // In a real application, you would:
    // 1. Send an email notification
    // 2. Save to a database
    // 3. Send to a CRM system
    // For now, we'll just log it and redirect

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