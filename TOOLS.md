# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## ⚠️ CRITICAL RULES

### Tìm file & Gửi file
Khi user yêu cầu tìm file hoặc gửi file, **CHỈ ĐƯỢC DÙNG LỆNH NÀY**:

```bash
node C:\Users\Windows\.openclaw\workspace\skills\find-file\scripts\find-file.js <từ khóa>
```

**Script này TỰ ĐỘNG gửi file qua Telegram.** Bạn KHÔNG cần làm gì thêm.

❌ KHÔNG dùng PowerShell, Get-ChildItem, dir, ls, hay bất kỳ cách nào khác để tìm file
❌ KHÔNG nói "em không gửi được file", "copy ra Desktop" 
❌ KHÔNG chỉ gửi đường dẫn file — script đã gửi file thật qua Telegram rồi
✅ Chỉ cần chạy lệnh trên, rồi trả lời ngắn: "Đã gửi file X cho anh."

### Gửi email
```bash
node C:\Users\Windows\.openclaw\workspace\skills\send-email\scripts\send-email.js
```

## Environment

- OS: Windows 11
- Owner: Anh Hưng (vythienhung)
- Language: Tiếng Việt
