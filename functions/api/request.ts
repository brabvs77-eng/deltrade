interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  AMOCRM_WEBHOOK_URL?: string;
  REQUEST_EMAIL_WEBHOOK_URL?: string;
}

interface RequestPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
  fileName: string | null;
  fileSize: number;
  file: File | null;
  source: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const source = String(formData.get('source') || request.headers.get('referer') || 'сайт').trim();
    const file = formData.get('file') as File | null;

    if (!name || !phone) {
      return Response.json({ error: 'Укажите имя и телефон' }, { status: 400 });
    }

    const payload: RequestPayload = {
      name,
      phone,
      email,
      message,
      fileName: file && file.size > 0 ? file.name : null,
      fileSize: file?.size ?? 0,
      file: file && file.size > 0 ? file : null,
      source,
    };

    const errors: string[] = [];

    const results = await Promise.allSettled([
      sendTelegram(env, payload),
      sendAmoCrm(env, payload),
      sendEmailWebhook(env, payload),
    ]);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const channel = ['Telegram', 'amoCRM', 'Email'][index];
        console.error(`${channel} error:`, result.reason);
        errors.push(channel);
      }
    });

    const anySuccess = results.some((r) => r.status === 'fulfilled' && r.value === true);
    const noneConfigured = results.every(
      (r) => r.status === 'fulfilled' && r.value === false,
    );

    if (!anySuccess && !noneConfigured) {
      return Response.json(
        { error: 'Не удалось отправить заявку. Попробуйте позже или позвоните нам.' },
        { status: 500 },
      );
    }

    if (noneConfigured) {
      console.log('Request received (no channels configured):', { name, phone, email, message, source });
    }

    return Response.json({
      message: 'Заявка принята! Менеджер свяжется с вами в рабочее время.',
      warnings: errors.length > 0 ? `Часть каналов недоступна: ${errors.join(', ')}` : undefined,
    });
  } catch (err) {
    console.error('Form error:', err);
    return Response.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
};

async function sendTelegram(env: Env, payload: RequestPayload): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;

  const text = formatRequestText(payload);

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
    throw new Error(await tgRes.text());
  }

  if (payload.file && payload.fileSize < 10 * 1024 * 1024) {
    const fileForm = new FormData();
    fileForm.append('chat_id', env.TELEGRAM_CHAT_ID);
    fileForm.append('document', payload.file, payload.fileName ?? 'file');
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: fileForm,
    });
  }

  return true;
}

async function sendAmoCrm(env: Env, payload: RequestPayload): Promise<boolean> {
  if (!env.AMOCRM_WEBHOOK_URL) return false;

  const body = {
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    message: payload.message,
    source: payload.source,
    fileName: payload.fileName,
    createdAt: new Date().toISOString(),
  };

  const res = await fetch(env.AMOCRM_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`amoCRM webhook: ${res.status} ${await res.text()}`);
  }

  return true;
}

async function sendEmailWebhook(env: Env, payload: RequestPayload): Promise<boolean> {
  if (!env.REQUEST_EMAIL_WEBHOOK_URL) return false;

  const res = await fetch(env.REQUEST_EMAIL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: `Заявка DELDIN TRADE — ${payload.name}`,
      text: formatRequestPlainText(payload),
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      message: payload.message,
      source: payload.source,
      fileName: payload.fileName,
    }),
  });

  if (!res.ok) {
    throw new Error(`Email webhook: ${res.status} ${await res.text()}`);
  }

  return true;
}

function formatRequestText(payload: RequestPayload): string {
  return [
    '📋 *Новая заявка DELDIN TRADE*',
    '',
    `👤 *Имя:* ${escapeMd(payload.name)}`,
    `📞 *Телефон:* ${escapeMd(payload.phone)}`,
    payload.email ? `📧 *Email:* ${escapeMd(payload.email)}` : '',
    `📍 *Источник:* ${escapeMd(payload.source)}`,
    payload.message ? `\n💬 *Комментарий:*\n${escapeMd(payload.message)}` : '',
    payload.fileName ? `\n📎 *Файл:* ${escapeMd(payload.fileName)} (${formatSize(payload.fileSize)})` : '',
    `\n🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function formatRequestPlainText(payload: RequestPayload): string {
  return [
    'Новая заявка DELDIN TRADE',
    '',
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : '',
    `Источник: ${payload.source}`,
    payload.message ? `\nКомментарий:\n${payload.message}` : '',
    payload.fileName ? `\nФайл: ${payload.fileName} (${formatSize(payload.fileSize)})` : '',
    `\n${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function escapeMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
