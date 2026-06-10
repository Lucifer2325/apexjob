import http.server
import socketserver
import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import html
import sys
import os

PORT = 8000
DIRECTORY = "public"

# WWR Feeds
wwr_feeds = {
    "it_support": "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
    "frontend": "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
    "customer_support": "https://weworkremotely.com/categories/remote-customer-support-jobs.rss",
    "digital_growth": "https://weworkremotely.com/categories/remote-marketing-jobs.rss"
}

def clean_html(text):
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = html.unescape(clean)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()

def parse_job_title(full_title):
    if ":" in full_title:
        parts = full_title.split(":", 1)
        return parts[0].strip(), parts[1].strip()
    return "Unknown Company", full_title.strip()

def fetch_wwr_jobs():
    wwr_jobs = []
    for category, url in wwr_feeds.items():
        print(f"Fetching WWR {category} jobs from: {url}")
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                xml_data = response.read()
            
            root = ET.fromstring(xml_data)
            count = 0
            for item in root.findall('.//item'):
                title_text = item.find('title').text if item.find('title') is not None else ""
                link = item.find('link').text if item.find('link') is not None else ""
                pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ""
                description = item.find('description').text if item.find('description') is not None else ""
                
                company, title = parse_job_title(title_text)
                clean_desc = clean_html(description)
                
                wwr_jobs.append({
                    "company": company,
                    "title": title,
                    "link": link,
                    "date": pub_date,
                    "description": clean_desc[:350] + "..." if len(clean_desc) > 350 else clean_desc,
                    "full_description": clean_desc,
                    "category": category,
                    "source": "We Work Remotely"
                })
                count += 1
            print(f"Loaded {count} jobs from WWR {category}")
        except Exception as e:
            print(f"Error fetching WWR {category} feed: {e}")
    return wwr_jobs

def fetch_remotive_jobs():
    remotive_jobs = []
    url = "https://remotive.com/api/remote-jobs?limit=50"
    print(f"Fetching Remotive jobs from: {url}")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        jobs_list = data.get("jobs", [])
        print(f"Successfully loaded {len(jobs_list)} raw jobs from Remotive API")
        
        for j in jobs_list:
            company = j.get("company_name", "Unknown Company")
            title = j.get("title", "")
            link = j.get("url", "")
            pub_date = j.get("publication_date", "")
            desc_html = j.get("description", "")
            remotive_category = j.get("category", "")
            
            clean_desc = clean_html(desc_html)
            
            # Map Remotive category to internal category
            category = "it_support" # Default
            if remotive_category == "Software Development":
                category = "frontend"
            elif remotive_category == "Customer Service":
                category = "customer_support"
            elif remotive_category == "Marketing":
                category = "digital_growth"
            else:
                # Sub-matching based on title
                title_lower = title.lower()
                if any(x in title_lower for x in ["frontend", "front-end", "web developer", "react", "ui", "ux"]):
                    category = "frontend"
                elif any(x in title_lower for x in ["helpdesk", "help desk", "it support", "system administrator", "desktop support", "sysadmin"]):
                    category = "it_support"
            
            remotive_jobs.append({
                "company": company,
                "title": title,
                "link": link,
                "date": pub_date,
                "description": clean_desc[:350] + "..." if len(clean_desc) > 350 else clean_desc,
                "full_description": clean_desc,
                "category": category,
                "source": "Remotive"
            })
    except Exception as e:
        print(f"Error fetching Remotive API: {e}")
    return remotive_jobs

class DualHTTPServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == '/api/jobs':
            self.handle_api_jobs()
        else:
            super().do_GET()

    def handle_api_jobs(self):
        # Fetch both and merge
        wwr = fetch_wwr_jobs()
        remotive = fetch_remotive_jobs()
        all_jobs = wwr + remotive
        
        # Log summary
        print(f"Total merged jobs: {len(all_jobs)}")
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_json = json.dumps({"status": "success", "jobs": all_jobs})
        self.wfile.write(response_json.encode('utf-8'))

def main():
    if not os.path.exists(DIRECTORY):
        os.makedirs(DIRECTORY)
        print(f"Created static files directory: {DIRECTORY}")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print(f"Starting ApexJob Dashboard Server on port {PORT}...")
    print(f"Open http://localhost:{PORT} in your web browser.")
    
    # Avoid port reuse issues on quick restarts
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DualHTTPServerHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            sys.exit(0)

if __name__ == '__main__':
    main()
