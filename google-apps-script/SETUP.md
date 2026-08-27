# Contact form setup

The website posts contact submissions to a Google Apps Script web app. The script appends each submission to Google Sheets and emails `hello@wrapstanz.com`.

1. Create the destination Google Sheet and copy its ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`.
2. Open [Google Apps Script](https://script.google.com), create a project, and replace its `Code.gs` with this folder's `Code.gs`.
3. Replace `PASTE_GOOGLE_SHEET_ID_HERE` in the script with the Sheet ID. Change `recipient` if the notification email should be different.
4. Choose **Deploy → New deployment → Web app**.
5. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy and approve the requested Sheets and Mail permissions.
6. Copy the deployed URL ending in `/exec`.
7. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and create `CONTACT_ENDPOINT` with the `/exec` URL.
8. Run the **Deploy to GitHub Pages** workflow again, then submit a test inquiry and verify both the email and Sheet row.

The endpoint URL is public by design. The handler includes a honeypot field, input length limits, and a script lock, but production forms can still receive spam.
