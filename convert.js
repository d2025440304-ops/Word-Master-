const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(`${process.env.HOME}/Downloads/CET6_3.json`, 'utf-8');
// JSONL 格式：每行一个 JSON 对象
const data = raw.trim().split('\n').map(line => JSON.parse(line));

const words = [];

for (const item of data) {
  const hw = item.headWord;
  // 跳过为空或含空格的
  if (!hw || hw.includes(' ')) continue;

  const wc = item.content?.word?.content;
  if (!wc) continue;

  // p: usphone 前后加 "/"，为空则 ""
  const usphone = wc.usphone || '';
  const p = usphone ? `/${usphone}/` : '';

  // m: 合并所有 trans，"pos. tranCn"，多个用 "；" 分隔
  const trans = wc.trans || [];
  const m = trans.map(t => {
    const pos = t.pos || '';
    const cn = t.tranCn || '';
    return pos ? `${pos}. ${cn}` : cn;
  }).join('；');

  // e: sentences[0].sContent，没有则 ""
  const sentences = wc.sentence?.sentences;
  const e = sentences?.[0]?.sContent || '';

  words.push({ w: hw, p, m, e });
}

const lines = words.map(w =>
  `  { w:${JSON.stringify(w.w)}, p:${JSON.stringify(w.p)}, m:${JSON.stringify(w.m)}, e:${JSON.stringify(w.e)} },`
);

const output = `const CET4_WORDS = [\n${lines.join('\n')}\n];\n`;

fs.writeFileSync('./data/cet6.js', output, 'utf-8');

console.log(`转换成功 ${words.length} 条`);
