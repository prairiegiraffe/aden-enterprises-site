# Cloudflare Email Workers Setup for Contact Form

This document explains how to configure Cloudflare Email Workers to send contact form submissions to kellee@prairiegiraffe.com.

## Overview

The contact form is configured to use Cloudflare Email Workers, keeping everything under one roof with your existing Cloudflare Pages deployment.

## Configuration Steps

### 1. Set up Email Routing (if using your domain)

**Option A: Use your own domain (@adenentllc.com)**

1. Go to Cloudflare Dashboard → Your domain (adenentllc.com)
2. Navigate to **Email** → **Email Routing**
3. Enable Email Routing
4. Add destination address: `kellee@prairiegiraffe.com`
5. Create a custom address like `contact@adenentllc.com` → forwards to `kellee@prairiegiraffe.com`

**Option B: Use Cloudflare's email service**

1. Go to your Pages project → **Settings** → **Environment Variables**
2. Add email service configuration (details below)

### 2. Configure Email Binding in Pages

1. Go to Cloudflare Dashboard → **Pages** → Your project
2. Navigate to **Settings** → **Functions**
3. Add **Environment Variables**:
   - Name: `EMAIL`
   - Value: Configure based on your email service choice

### 3. Alternative: Use Email Service Binding

1. Go to **Workers & Pages** → **Your Pages Project**
2. Navigate to **Settings** → **Bindings**
3. Add a **Service Binding**:
   - Variable name: `EMAIL`
   - Service: Your email service

## Email Features

### What the email includes:

- **Professional HTML formatting** with clean styling
- **All form fields**: First Name, Last Name, Phone, Email, Message
- **Timestamp** in Mountain Time
- **Reply-to functionality** using the submitted email address
- **Spam protection** with honeypot field filtering

### Email format:

```
To: kellee@prairiegiraffe.com
From: noreply@adenentllc.com
Subject: New Contact Form Submission - [FirstName] [LastName]

[Beautifully formatted HTML email with all contact details]
```

## Current Status

✅ **Code is ready** - The Worker function is configured to use Cloudflare Email Workers
✅ **Fallback logging** - If email isn't configured yet, submissions are logged to console
✅ **Error handling** - Form still works even if email fails
✅ **Professional formatting** - Both text and HTML email versions

## Testing

1. **Before email is configured**: Check Functions → Real-time Logs to see what would be sent
2. **After email is configured**: Submit test form and check kellee@prairiegiraffe.com inbox

## Next Steps

1. Choose your email routing method (own domain vs Cloudflare service)
2. Configure the email binding in your Pages project
3. Deploy and test the contact form
4. Monitor submissions in Real-time Logs

## Cost

- **Cloudflare Email Workers**: Included in Workers pricing (very affordable)
- **Email Routing**: Free for up to 100,000 emails/month
- **No separate email service fees** - everything under Cloudflare

## Support

If you need help configuring the email service:

1. Check Cloudflare's Email Workers documentation
2. Use the Real-time Logs to debug any issues
3. The form will continue working and logging even if email needs adjustment
