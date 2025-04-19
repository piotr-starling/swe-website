import type { APIRoute } from "astro";
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Send email using Resend
    await resend.emails.send({
      from: 'estimates@yourdomain.com',
      to: 'your@email.com',
      subject: 'New Estimate Request',
      html: `
        <h2>New Estimate Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        ${data.otherDescription ? `<p><strong>Other Description:</strong> ${data.otherDescription}</p>` : ''}
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Budget/Timeline:</strong> ${data.budget || 'N/A'}</p>
        <p><strong>Source:</strong> ${data.source || 'N/A'}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}; 