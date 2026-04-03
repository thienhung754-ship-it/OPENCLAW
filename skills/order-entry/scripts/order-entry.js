const { execSync } = require('child_process');

const MASTER_ID = '1jReIJI1SvenBy3E0HymAhmH-r1yxheiQuIv-5k3hU4E';
const MASTER_TAB = 'Trang tính1';
const OUTPUT_ID = '1AwF7Jin0guCJlMXmo7pcbZ69IgNwSJrgqFjyNeihFho';
const OUTPUT_TAB = 'Trang tính1';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' });
}

function loadMasterData() {
  const raw = run(`gog sheets get "${MASTER_ID}" "${MASTER_TAB}!A2:D2000" --json`);
  const data = JSON.parse(raw);
  return (data.values || [])
    .map((row) => ({
      ma: (row[0] || '').trim(),
      ten: (row[1] || '').trim(),
      dvt: (row[2] || '').trim(),
      gia: (row[3] || '').toString().trim()
    }))
    .filter((r) => r.ma && r.ten);
}

function getNextStt() {
  const raw = run(`gog sheets get "${OUTPUT_ID}" "${OUTPUT_TAB}!A:A" --json`);
  const data = JSON.parse(raw);
  const currentRows = (data.values || []).length;
  return Math.max(currentRows, 1);
}

function appendToOutput(maKhach, items) {
  const startStt = getNextStt();
  const rows = items.map((item, i) => [
    startStt + i,
    maKhach,
    item.ma,
    item.ten,
    item.dvt,
    item.so_luong,
    item.don_gia || '',
    item.don_gia ? Number(item.so_luong) * Number(item.don_gia) : '',
    '',
    ''
  ]);

  const jsonStr = JSON.stringify(rows);
  const cmd = `gog sheets append "${OUTPUT_ID}" "${OUTPUT_TAB}!A:J" --values-json ${JSON.stringify(jsonStr)} --insert INSERT_ROWS`;
  const result = run(cmd);
  return { rows, result };
}

function buildItemsFromCodes(master, specs) {
  return specs.map((spec) => {
    const found = master.find((p) => p.ma === spec.ma);
    if (!found) {
      throw new Error(`Không tìm thấy mã hàng trong master: ${spec.ma}`);
    }
    return {
      ma: found.ma,
      ten: found.ten,
      dvt: found.dvt,
      so_luong: spec.so_luong,
      don_gia: spec.don_gia || ''
    };
  });
}

function main() {
  const payloadArg = process.argv[2];
  if (!payloadArg) {
    throw new Error('Thiếu payload JSON. Ví dụ: node order-entry.js "{...}" hoặc node order-entry.js @payload.json');
  }

  const payloadText = payloadArg.startsWith('@')
    ? require('fs').readFileSync(payloadArg.slice(1), 'utf8')
    : payloadArg;
  const payload = JSON.parse(payloadText);
  if (!payload.maKhach) {
    throw new Error('Thiếu maKhach');
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Thiếu items');
  }

  const master = loadMasterData();
  const items = buildItemsFromCodes(master, payload.items);
  const appended = appendToOutput(payload.maKhach, items);

  console.log(JSON.stringify({
    ok: true,
    maKhach: payload.maKhach,
    count: appended.rows.length,
    items,
    raw: appended.result
  }, null, 2));
}

main();
