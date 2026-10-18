# Summatice

Summatice is a simple personal finance tracker for keeping monthly income and expenses clear. Add transactions, review your monthly totals, and search your transaction descriptions, categories, and notes.

**Code review / repository:** [crugwiro-sudo/frontend-summativeAssignment](https://github.com/crugwiro-sudo/frontend-summativeAssignment)  
**UI interaction video:** [Watch the walkthrough](https://youtu.be/Whc6Fqjd0h8)

## Features

- Record income and expenses with an amount, description, category, date, and optional notes.
- View monthly income, expenses, and remaining balance.
- Switch between months to review past transactions.
- Search transactions with a regular expression (case-insensitive).
- Save transactions in your browser using `localStorage`.

## Getting started

This is a static website and does not require a build step or package installation.

1. Clone or download the repository.
2. Open `frontend/index.html` in a browser, or serve the project with a local web server (for example, VS Code Live Server).

The app's HTML, styles, and JavaScript are in the `frontend` directory.

## Using the app

1. Select a month to view its transactions and summary.
2. Select **Add transaction**, complete the form, and save.
3. Use the search field to filter the displayed transactions. Enter a regular expression such as `coffee|tea`; an invalid expression displays a warning.

Transactions are stored in the browser on the device and browser profile where they were entered. Clearing that browser's site data may remove them.

## Built with

- HTML
- CSS
- Vanilla JavaScript
