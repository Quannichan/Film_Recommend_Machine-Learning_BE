function verifyEmailTemplate(verifyUrl, name = "bạn", minutes) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body>
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Chào ${name},</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản FilmFinder.</p>
        <p>Hãy bấm nút bên dưới để xác nhận email của bạn:</p>
        <p style="text-align:center">
          <a href="${verifyUrl}" 
            style="background:#2563eb;color:#fff;padding:10px 20px;
                    border-radius:8px;text-decoration:none;font-weight:bold;">
            Xác nhận tài khoản
          </a>
        </p>
        <p>Nếu không phải bạn đăng ký, hãy bỏ qua email này.</p>
        <small>Liên kết sẽ hết hạn sau ${minutes} phút.</small>
      </div>
    </body>
    </html>
  `;
}

module.exports = { verifyEmailTemplate };
