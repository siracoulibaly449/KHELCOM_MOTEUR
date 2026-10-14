// @ts-nocheck
Deno.serve(async (req) => {
  // Refuse tout appel qui ne vient pas du webhook Supabase
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('non autorisé', { status: 401 })
  }

  const { record } = await req.json()

  const message =
    `🛒 Nouvelle réservation ${record.reference}\n\n` +
    `Client : ${record.client_nom}\n` +
    `Téléphone : ${record.client_telephone}\n` +
    `Adresse : ${record.adresse}\n\n` +
    `Total : ${Number(record.total).toLocaleString('fr-FR')} FCFA\n` +
    `Acompte : ${Number(record.acompte).toLocaleString('fr-FR')} FCFA\n` +
    `Paiement : ${record.mode_paiement}`

  const reponse = await fetch(
    `https://api.telegram.org/bot${Deno.env.get('TELEGRAM_JETON')}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: Deno.env.get('TELEGRAM_CHAT_ID'),
        text: message,
      }),
    }
  )

  return new Response(reponse.ok ? 'ok' : 'erreur', {
    status: reponse.ok ? 200 : 502,
  })
})