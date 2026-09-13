#!/usr/bin/env node
/**
 * Guards the blog against the factual errors that circulate widely in Russian
 * metal-trading content. Each rule below was verified against the standards
 * themselves during the competitor content audit; the "wrong" side of every
 * pair is something competitors publish routinely.
 *
 *   node scripts/check-blog-facts.mjs
 *
 * Exits non-zero when any article trips a rule.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'src', 'content', 'blog');

const RULES = [
  {
    pattern: /ГОСТ\s+ISO\s+6594/i,
    message: 'Российского «ГОСТ ISO 6594» нет. Ссылаться на EN 877, DIN 19522, ISO 6594:2006.',
  },
  {
    pattern: /EN\s*877[^.]{0,60}(принят|действует)[^.]{0,40}ГОСТ\s*Р/i,
    message: 'Принятие EN 877 как ГОСТ Р документально не подтверждено.',
  },
  {
    pattern: /SML[^.]{0,80}ГОСТ\s*6942/i,
    message: 'ГОСТ 6942-98 — про раструбные чугунные трубы, не про безраструбные SML.',
  },
  {
    pattern: /ГОСТ\s*Р\s*55601/i,
    message: 'ГОСТ Р 55601 — про крепление труб в трубных решётках, не про компенсаторы.',
  },
  {
    pattern: /ГОСТ\s*Р\s*53673/i,
    message: 'ГОСТ Р 53673-2009 отменён с 01.03.2017. Строительные длины затворов — ГОСТ 28908-91.',
  },
  {
    pattern: /ГОСТ\s*1282[0-2](?![^.]{0,80}(отмен|замен|недейств|устарев|взамен|ранее|старо))/i,
    message: 'Серия ГОСТ 12815-80…12822-80 отменена. Действует ГОСТ 33259-2015 — упоминать только с пометкой об отмене.',
  },
  {
    pattern: /12Х18Н10Т\s*[—–-]*\s*(это\s+)?(=|полный аналог|соответствует)\s*AISI\s*304/i,
    message: '12Х18Н10Т ближе к AISI 321; AISI 304 сопоставим с 08Х18Н10. И это не взаимозаменяемость.',
  },
  {
    pattern: /ГОСТ\s*8731-87/,
    message: 'Правильное обозначение — ГОСТ 8731-74 (техусловия на бесшовные горячедеформированные трубы).',
  },
  {
    pattern: /покрытие\s+PURAL(?![^.]{0,40}(марк|торгов))/i,
    message: 'PURAL — торговая марка. Писать «полиуретановое покрытие (ПУ / PUR), торговые марки типа Pural».',
  },
];

/** Frontmatter/структурные требования, общие для всех статей. */
const STRUCTURE = [
  { test: (body) => /\n\|.+\|/.test(body), message: 'нет ни одной таблицы' },
  { test: (body) => /^>\s/m.test(body), message: 'нет врезки (> **Важно.** …)' },
  { test: (body) => /```/.test(body), message: 'нет готовой формы/чек-листа в code-блоке' },
  {
    test: (body) => (body.match(/\]\(\/blog\//g) ?? []).length >= 2,
    message: 'меньше двух внутренних ссылок на другие статьи блога',
  },
];

const files = (await readdir(blogDir)).filter((f) => f.endsWith('.md'));
let problems = 0;

for (const file of files.sort()) {
  const raw = await readFile(path.join(blogDir, file), 'utf8');
  const body = raw.replace(/^---[\s\S]*?\n---\n/, '');
  const found = [];

  for (const rule of RULES) {
    const match = raw.match(rule.pattern);
    if (match) found.push(`факт: ${rule.message} (найдено: «${match[0].trim()}»)`);
  }

  for (const rule of STRUCTURE) {
    if (!rule.test(body)) found.push(`структура: ${rule.message}`);
  }

  const words = body.trim().split(/\s+/).length;
  if (words < 700) found.push(`объём: всего ${words} слов`);

  if (found.length > 0) {
    problems += found.length;
    console.log(`\n✗ ${file}`);
    for (const issue of found) console.log(`    ${issue}`);
  }
}

console.log(
  problems === 0
    ? `\n✓ Проверено ${files.length} статей, замечаний нет.`
    : `\n${problems} замечание(й) в ${files.length} статьях.`
);

process.exit(problems === 0 ? 0 : 1);
