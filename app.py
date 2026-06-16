import xml.etree.ElementTree as ET
import html
import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def clean_html(raw_html):
    """Clean and decode HTML content from the RSS feed."""
    if not raw_html:
        return ""
    # Unescape twice to resolve double HTML encoding in feeds
    decoded = html.unescape(html.unescape(raw_html))
    return decoded

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/releases')
def get_releases():
    try:
        # Set a reasonable timeout for the network request
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
        
        # Parse XML feed
        # Note: Google feeds are typically Atom feeds
        root = ET.fromstring(response.content)
        
        # Atom namespaces
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        entries = []
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns)
            updated = entry.find('atom:updated', ns)
            content = entry.find('atom:content', ns)
            link_elem = entry.find('atom:link', ns)
            
            link = link_elem.get('href') if link_elem is not None else ""
            title_text = title.text if title is not None else "No Title"
            updated_text = updated.text if updated is not None else ""
            content_html = content.text if content is not None else ""
            
            # Formulate a clean description
            clean_content = clean_html(content_html)
            
            # Format update date if possible (usually ISO format, e.g., 2026-06-15T00:00:00Z)
            date_display = updated_text.split('T')[0] if 'T' in updated_text else updated_text
            
            entries.append({
                'title': title_text,
                'date': date_display,
                'content': clean_content,
                'link': link
            })
            
        return jsonify({'success': True, 'data': entries})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
