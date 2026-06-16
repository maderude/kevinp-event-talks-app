# BigQuery Release Notes Web Application

A lightweight, modern web dashboard built with Python/Flask and Vanilla JavaScript to aggregate, format, and share Google Cloud BigQuery release notes.

## 🚀 Features

- **Live Aggregation**: Real-time fetching of Google Cloud BigQuery release notes from the official Atom Feed.
- **Double HTML Decoupling**: Automatically cleans double-escaped HTML payloads for seamless rendering.
- **Responsive Layout**: Designed with CSS variables, custom styling, and responsive cards.
- **Twitter Integration**: Share release updates directly to X/Twitter with one-click custom intent windows.

---

## 🛠️ Tech Stack

- **Backend**: Python (Flask, `requests`, `xml.etree.ElementTree`)
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6, Fetch API)

---

## 📋 Prerequisites

Ensure you have Python 3.8+ installed on your system.

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/maderude/kevinp-event-talks-app.git
   cd kevinp-event-talks-app
   ```

2. **Install dependencies**:
   Create a virtual environment (optional but recommended) and install `requests` and `Flask`:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   pip install flask requests
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```
   The application will start running on [http://127.0.0.1:5000/](http://127.0.0.1:5000/).

---

## 📂 Project Structure

- [`app.py`](file:///C:/agy-cli-projects/app.py): Core Flask application serving templates and the backend feed API proxy.
- [`templates/index.html`](file:///C:/agy-cli-projects/templates/index.html): Entry page structure.
- [`static/app.js`](file:///C:/agy-cli-projects/static/app.js): Handles asynchronous fetch requests, HTML sanitization, and client-side rendering.
- [`static/style.css`](file:///C:/agy-cli-projects/static/style.css): Main stylesheet housing design system variables, dark themes, and layout definitions.
