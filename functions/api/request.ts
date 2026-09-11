interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const file = formData.get('file') as File | null;

    if (!name || !phone) {
      return Response.json({ error: 'Укажите имя и телефон' }, { status: 400 });
    }

    const text = [
      '📋 *Новая заявка DELDIN TRADE*',
      '',
      `👤 *Имя:* ${escapeMd(name)}`,
      `📞 *Телефон:* ${escapeMd(phone)}`,
      email ? `📧 *Email:* ${escapeMd(email)}` : '',
      message ? `\n💬 *Комментарий:*\n${escapeMd(message)}` : '',
      file && file.size > 0 ? `\n📎 *Файл:* ${escapeMd(file.name)} (${formatSize(file.size)})` : '',
      `\n🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        },
      );

      if (!tgRes.ok) {
        console.error('Telegram error:', await tgRes.text());
        return Response.json({ error: 'Ошибка отправки уведомления' }, { status: 500 });
      }

      if (file && file.size > 0 && file.size < 10 * 1024 * 1024) {
        const fileForm = new FormData();
        fileForm.append('chat_id', env.TELEGRAM_CHAT_ID);
        fileForm.append('document', file, file.name);
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: fileForm,
        });
      }
    } else {
      console.log('Request received (Telegram not configured):', { name, phone, email, message });
    }

    return Response.json({
      message: 'Заявка принята! Менеджер свяжется с вами в рабочее время.',
    });
  } catch (err) {
    console.error('Form error:', err);
    return Response.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
};

function escapeMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
