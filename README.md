# ApexJob - Remote Application Hub & AI Optimization Tracker

An ultra-premium, local dashboard utility that fetches live remote opportunities, tracks your application pipeline on a daily basis, and generates tailored resumes and cover letters using the Google Gemini API.

---

## Key Features

1. **Live Remote Job Feed**: Fetches real-time remote job opportunities from **We Work Remotely** and the **Remotive API**. Categorized by IT Support, Frontend, Support, and Marketing/Growth with entry-level job filters.
2. **RezPass ATS Score Match**: Built-in keyword analyzer that parses job descriptions and compares them against your master resume sections to calculate an ATS compatibility score, displayed via a premium radial gauge. Supports manual override.
3. **Optimized Kanban Stage**: A 5-column Kanban board to track your pipelines: **Wishlist (Saved)** -> **Resume Optimized (RezPass)** -> **Applied** -> **Interviewing** -> **Offer / Closed**.
4. **Source Board Lead Tracking**: Tag and filter jobs by remote boards (Remotive, We Work Remotely, Jobspresso, Dynamite Jobs, Virtual Vocations, and Career Hound).
5. **No External Dependencies**: The backend server runs purely on vanilla Python standard libraries—no `pip install` required.

---

## How to Start the Dashboard

1. **Open your command terminal** inside this project directory (`apexjob/`).
2. **Start the local server**:
   ```powershell
   python server.py
   ```
3. **Open the Dashboard**:
   Go to your web browser and open:
   [http://localhost:8000](http://localhost:8000)

---

## Setting Up Your Gemini API Key

To use the AI generator:
1. Create a free API Key from [Google AI Studio](https://aistudio.google.com/).
2. Open the dashboard, go to the **Master Profile & API** tab, paste the key in the **Gemini API Key** field, and click **Save Settings**.
3. *Note: Your API key is stored securely inside your browser's local storage and is never sent to any third-party backend servers.*
