import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { driverEmail, booking } = req.body;

    const html = `
      <h2>🚖 Nieuwe rit toegewezen</h2>
      <p><b>Pickup:</b> ${booking.pickup}</p>
      <p><b>Dropoff:</b> ${booking.dropoff}</p>
      <p><b>Datum:</b> ${booking.date}</p>
      <p><b>Klant:</b> ${booking.name}</p>
      <p><b>Telefoon:</b> ${booking.phone}</p>
      <p><b>Voertuig:</b> ${booking.vehicle}</p>
      <p><b>Extras:</b> ${booking.extras}</p>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: driverEmail,
      subject: "🚖 Nieuwe booking toegewezen",
      html
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Email failed" });
  }
}
