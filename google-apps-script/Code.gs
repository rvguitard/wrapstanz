const CONFIG = {
  spreadsheetId: 'PASTE_GOOGLE_SHEET_ID_HERE',
  sheetName: 'Contact submissions',
  recipient: 'hello@wrapstanz.com',
};

function doPost(event) {
  const data = event.parameter || {};

  // Quietly accept bot submissions caught by the hidden field.
  if (data.website) return HtmlService.createHtmlOutput('OK');

  const name = clean_(data.name);
  const email = clean_(data.email);
  const company = clean_(data.company);
  const questions = clean_(data.questions);
  const page = clean_(data.page);

  if (!name || !email) {
    return HtmlService.createHtmlOutput('Missing required fields.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
    const sheet = spreadsheet.getSheetByName(CONFIG.sheetName) || spreadsheet.insertSheet(CONFIG.sheetName);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Submitted at', 'Name', 'Email', 'Company', 'Questions', 'Page']);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([new Date(), name, email, company, questions, page]);

    const subject = `New Wrapstanz inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      '',
      'Questions:',
      questions || 'None provided',
    ].join('\n');

    MailApp.sendEmail({
      to: CONFIG.recipient,
      replyTo: email,
      subject,
      body,
      htmlBody: `<p><strong>Name:</strong> ${escapeHtml_(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml_(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml_(company || 'Not provided')}</p>
        <p><strong>Questions:</strong><br>${escapeHtml_(questions || 'None provided').replace(/\n/g, '<br>')}</p>`,
    });

    return HtmlService.createHtmlOutput('Thanks! Your message has been sent.');
  } finally {
    lock.releaseLock();
  }
}

function clean_(value) {
  return String(value || '').trim().slice(0, 5000);
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
