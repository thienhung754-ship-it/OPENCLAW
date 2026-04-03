---
name: order-entry
description: Nhan thong tin dat hang (text/anh/bat ky format nao), doi chieu ma hang, ghi vao Google Sheet dau ra.
---

# Order Entry
## ⚡ QUY TAC VANG — KHONG DUOC VI PHAM

- **NEU NHAN ANH** → OCR xong → chay thang Buoc 2, KHONG dung lai hoi
- **NEU TIM THAY 1 KET QUA MATCH** → dung luon, KHONG hoi
- **KHONG chi tom tat** — phai CHAY LENH GOG thuc su

## MUC TIEU
Khi nhan duoc thong tin dat hang (text, anh, ghi tay, bat ky format nao):
1. Hieu noi dung muon dat gi, so luong bao nhieu
2. Doi chieu voi bang ma hang
3. CHAY LENH GOG de ghi vao Sheet dau ra
4. Phan hoi ngan gon

## QUAN TRONG - PHAI CHAY LENH GOG
Sau khi hieu duoc hang can dat, PHAI chay luon cac lenh gog sau day.
KHONG chi tom tat. KHONG hoi them. CHAY LENH NGAY.

---

## BUOC 1: DOC BANG MA HANG

Chay lenh nay de lay toan bo ma hang:

```
node -e "
const {execSync}=require('child_process');
const r=execSync('gog sheets get \"1jReIJI1SvenBy3E0HymAhmH-r1yxheiQuIv-5k3hU4E\" \"Trang t\u00ednh1!A2:C500\" --json',{encoding:'utf8'});
const d=JSON.parse(r);
const rows=(d.values||[]).map(x=>({ma:x[0],ten:x[1],dvt:x[2]}));
console.log(JSON.stringify(rows));
"
```

## BUOC 2: KHOP TEN HANG - TIM MA

Voi moi mat hang khach dat, tim trong ket qua buoc 1:
- Chuan hoa: bo dau, viet thuong, loai ky tu dac biet
- Tim san pham chua tu khoa khach goi
- Neu tim thay 1 ket qua: lay ma do
- Neu tim thay nhieu ket qua: hoi khach chon (Inline Keyboard)
- Neu khong tim thay: ghi ma trong, ten the khach viet

## BUOC 3: CHAY SCRIPT GOG DE GHI SHEET DAU RA

Viet file /tmp/write_order.js voi noi dung sau, ROI CHAY node /tmp/write_order.js:

```js
const {execSync}=require('child_process');
const OUT='1AwF7Jin0guCJlMXmo7pcbZ69IgNwSJrgqFjyNeihFho';
const TAB='Trang t\u00ednh1';

// LAY STT CUOI CUNG
const cur=JSON.parse(execSync(`gog sheets get "${OUT}" "${TAB}!A:A" --json`,{encoding:'utf8'}));
const nextStt=(cur.values||[]).length; // cot A co header o row 1

// DU LIEU CAN GHI - THAY THE BANG DU LIEU THUC TE
const maKhach='[MA_KHACH_HANG]'; // Lay tu noi dung tin nhan, neu khong co thi de trong
const items=[
  // {ma:'MA001', ten:'Ten san pham', dvt:'DVT', sl:1, gia:'', ngay:''}
  // Them cac dong thuc te vao day
];

const rows=items.map((x,i)=>[
  nextStt+i,    // A: STT
  maKhach,      // B: Ma khach hang
  x.ma,         // C: Ma san pham
  x.ten,        // D: Ten san pham
  x.dvt,        // E: DVT
  x.sl,         // F: SLYCL
  x.gia||'',    // G: Don gia
  x.gia?x.sl*x.gia:'', // H: Thanh tien
  x.ngay||'',   // I: Ngay du kien
  ''            // J: Ghi chu
]);

const j=JSON.stringify(rows);
const cmd=`gog sheets append "${OUT}" "${TAB}!A:J" --values-json ${JSON.stringify(j)} --insert INSERT_ROWS`;
const res=execSync(cmd,{encoding:'utf8'});
console.log('DONE:',res.trim());
console.log('ROWS:',rows.length);
```

## BUOC 4: PHAN HOI TELEGRAM
Sau khi script chay xong, phan hoi:
"Da nhap [X] mat hang cho khach [MA_KHACH] vao Sheet"

Neu loi: Phan hoi loi cu the de debug.

---

## NGUYEN TAC XU LY INPUT LINH HOAT

- Input la TEXT: Doc truc tiep, hieu ten hang + so luong
- Input la ANH/HINH: Doc bang Vision/OCR truoc, lay text, xu ly nhu text
- Input co ma khach (vi du "1HMD", "THMD", "K001"...): Luu vao cot B
- Input KHONG co ma khach: De cot B trong, KHONG hoi them
- Format khac nhau bat ky: "can 5 thung nuoc mam", "nuoc mam x5", "5T nuoc mam"... deu chap nhan

## NGUYEN TAC KHONG DUOC VI PHAM

- KHONG tao sheet moi. Chi ghi append vao sheet dau ra co san.
- KHONG luu memory roi thoi. PHAI chay gog.
- KHONG yeu cau khach phai viet dung format nao do.
- KHONG hoi "anh con gi khong" sau khi da ghi xong.
- Moi khach hang khac nhau -> same sheet, chi khac cot B (Ma khach).

## LINK SHEET

Master Data (bang ma hang):
https://docs.google.com/spreadsheets/d/1jReIJI1SvenBy3E0HymAhmH-r1yxheiQuIv-5k3hU4E/edit
Sheet ID: 1jReIJI1SvenBy3E0HymAhmH-r1yxheiQuIv-5k3hU4E

Output (bang ke dau ra):
https://docs.google.com/spreadsheets/d/1AwF7Jin0guCJlMXmo7pcbZ69IgNwSJrgqFjyNeihFho/edit
Sheet ID: 1AwF7Jin0guCJlMXmo7pcbZ69IgNwSJrgqFjyNeihFho
