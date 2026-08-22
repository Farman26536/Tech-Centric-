import { env } from '../config/env.js';

export async function sendEmail(input: { to: string; subject: string; html: string }) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return { sent: false, reason: 'Email provider is not configured' };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [input.to], subject: input.subject, html: input.html })
  });
  if (!response.ok) return { sent: false, reason: await response.text() };
  return { sent: true };
}
