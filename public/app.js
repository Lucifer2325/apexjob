/* ═══════════════════════════════════════════════════════
   ApexJob — Complete Application JavaScript
   ═══════════════════════════════════════════════════════ */

// ────────────────────────────────────────────
// 1. DEFAULT PROFILE DATA
// ────────────────────────────────────────────
const DEFAULT_PROFILE = {
    it_support: {
        summary: "Results-driven Technical Support Engineer with 2+ years of experience providing Tier 2 / L2 application support for mission-critical banking systems. Proven ability to manage incident lifecycle, perform root cause analysis, and maintain SLA compliance in high-availability BFSI environments. Hands-on expertise with AWS, Docker, Kubernetes, Linux, and CI/CD tooling. AWS Certified with strong DevOps knowledge and banking domain experience.",
        skills: "Incident & SLA Management: ServiceNow, Control-M, Root Cause Analysis\nOperating Systems: Linux (RHEL/Ubuntu), Windows Server\nDatabases: Oracle, MySQL, AWS RDS\nApp Servers: Apache Tomcat, JBoss\nCloud & DevOps: AWS, Docker, Kubernetes, Jenkins\nScripting & Dev: Python, SQL, Bash/Shell, YAML, Jenkins Declarative Pipeline, Git\nMonitoring: Control-M, Log Analysis",
        experience: "Technical Support Engineer (L2) — Lean Quality Solutions (I) Pvt Ltd | Pune, Maharashtra | Aug 2022 – July 2024\n- Managed end-to-end incident lifecycle for critical banking applications, maintaining 99.5%+ SLA compliance across 50+ monthly tickets via ServiceNow.\n- Conducted root cause analysis on production incidents, implementing preventive measures that reduced repeat incidents by ~30%.\n- Coordinated application updates and patch deployments across Apache Tomcat and JBoss environments with zero unplanned downtime.\n- Collaborated with development teams to escalate and track bug fixes, reducing average resolution time by 20%.\n- Monitored application health using Control-M and shell scripts; proactively identified performance anomalies before end-user impact.\n- Supported L1 team by providing technical guidance and documentation, reducing L3 escalations by 15%.\n\nProject — Banking Application Enhancement:\n- Contributed to feature development and testing of a core banking application, translating business requirements into technical specifications.\n- Validated new functionalities against BFSI compliance standards; provided on-site and remote hypercare support during go-live."
    },
    frontend: {
        summary: "Technical Support Engineer with strong front-end development capabilities and a Bachelor of Computer Applications (BCA) background. Eager to bridge application support, cloud architecture, and modern front-end web development.",
        skills: "HTML5, CSS3, JavaScript (ES6+), React, Responsive Design, AWS, Docker, Kubernetes, Git/GitHub, Linux Admin.",
        experience: "Technical Support & Interface Enhancements\n- Built local project prototypes including clinic landing pages with vanilla JS dynamic translation transitions.\n- Configured Tomcat/JBoss application servers and debugged user-facing UI interface bugs.\n- Automated testing and validation of core banking web views during release rollouts."
    },
    digital_growth: {
        summary: "Analytical Technical Support Engineer and BCA student with experience in cloud applications and digital strategy audits.",
        skills: "Python, SQL, Bash/Shell Scripting, AWS, Docker, Log Analysis, Automation Metrics, Market Research.",
        experience: "Cloud Operations & Growth Analysis\n- Created bash and Python scripts to monitor application health and automate manual checking tasks.\n- Conducted strategic reviews of cloud monetization models and SaaS cost optimizations.\n- Performed data queries in Oracle and MySQL databases to extract performance metrics."
    }
};

// ────────────────────────────────────────────
// 2. ATS SKILLS DICTIONARY
// ────────────────────────────────────────────
const ATS_SKILLS_DICTIONARY = [
    "aws", "gcp", "azure", "docker", "kubernetes", "k8s", "linux", "tomcat",
    "jboss", "servicenow", "control-m", "oracle", "mysql", "rds", "jenkins",
    "python", "scripting", "bash", "shell", "sla", "root cause", "troubleshooting",
    "html", "css", "javascript", "js", "react", "responsive", "git",
    "github", "sql", "automation", "log analysis", "monitoring", "jira", "itil"
];

// ────────────────────────────────────────────
// 3. SAFE LUCIDE WRAPPER
// ────────────────────────────────────────────
function safeCreateIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        try { lucide.createIcons(); } catch (e) { console.warn('Lucide error:', e); }
    }
}

// ────────────────────────────────────────────
// 4. APP STATE
// ────────────────────────────────────────────
let appState = {
    jobs: [],
    tracker: [],
    profile: {},
    settings: { geminiKey: "", dailyTarget: 5 },
    activeTab: "dashboard-tab",
    activeFilter: "all"
};

// ────────────────────────────────────────────
// 5. LOCAL STORAGE
// ────────────────────────────────────────────
function loadLocalStorage() {
    try {
        const settings = JSON.parse(localStorage.getItem('jp_settings'));
        if (settings) appState.settings = { ...appState.settings, ...settings };
    } catch (e) { console.warn('Failed to parse jp_settings:', e); }

    try {
        const profile = JSON.parse(localStorage.getItem('jp_profile'));
        if (profile && Object.keys(profile).length > 0) {
            appState.profile = profile;
        } else {
            appState.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
        }
    } catch (e) {
        appState.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }

    try {
        const tracker = JSON.parse(localStorage.getItem('jp_tracker'));
        if (Array.isArray(tracker)) {
            appState.tracker = tracker.map(entry => {
                // Auto-migrate old status values
                const statusMap = { 'wishlist': 'saved', 'tailored': 'optimized', 'interviewing': 'interview' };
                if (statusMap[entry.status]) entry.status = statusMap[entry.status];
                return entry;
            });
        }
    } catch (e) { console.warn('Failed to parse jp_tracker:', e); }

    // Populate settings UI
    const keyInput = document.getElementById('setting-gemini-key');
    const targetInput = document.getElementById('setting-daily-target');
    if (keyInput) keyInput.value = appState.settings.geminiKey || '';
    if (targetInput) targetInput.value = appState.settings.dailyTarget || 5;

    // Populate profile UI
    populateProfileUI();
    
    // Dynamic warning check
    checkApiKeyWarning();
}

function checkApiKeyWarning() {
    const warning = document.getElementById('api-key-warning');
    if (!warning) return;
    if (appState.settings.geminiKey) {
        warning.classList.add('hidden');
    } else {
        warning.classList.remove('hidden');
    }
}

function saveSettings() {
    const key = document.getElementById('setting-gemini-key').value.trim();
    const target = parseInt(document.getElementById('setting-daily-target').value) || 5;
    appState.settings.geminiKey = key;
    appState.settings.dailyTarget = target;
    try { localStorage.setItem('jp_settings', JSON.stringify(appState.settings)); } catch (e) { console.warn(e); }
    updateProgressUI();
    checkApiKeyWarning();
    showToast('Settings saved successfully!');
}

function saveTracker() {
    try { localStorage.setItem('jp_tracker', JSON.stringify(appState.tracker)); } catch (e) { console.warn(e); }
}

function saveProfile() {
    // Read profile from UI
    appState.profile.it_support = {
        summary: document.getElementById('prof-it-summary').value,
        skills: document.getElementById('prof-it-skills').value,
        experience: document.getElementById('prof-it-experience').value
    };
    appState.profile.frontend = {
        summary: document.getElementById('prof-fe-summary').value,
        skills: document.getElementById('prof-fe-skills').value,
        experience: document.getElementById('prof-fe-experience').value
    };
    appState.profile.digital_growth = {
        summary: document.getElementById('prof-dg-summary').value,
        skills: document.getElementById('prof-dg-skills').value,
        experience: document.getElementById('prof-dg-experience').value
    };
    try { localStorage.setItem('jp_profile', JSON.stringify(appState.profile)); } catch (e) { console.warn(e); }
    showToast('Profile saved successfully!');
}

function populateProfileUI() {
    const p = appState.profile;
    if (p.it_support) {
        document.getElementById('prof-it-summary').value = p.it_support.summary || '';
        document.getElementById('prof-it-skills').value = p.it_support.skills || '';
        document.getElementById('prof-it-experience').value = p.it_support.experience || '';
    }
    if (p.frontend) {
        document.getElementById('prof-fe-summary').value = p.frontend.summary || '';
        document.getElementById('prof-fe-skills').value = p.frontend.skills || '';
        document.getElementById('prof-fe-experience').value = p.frontend.experience || '';
    }
    if (p.digital_growth) {
        document.getElementById('prof-dg-summary').value = p.digital_growth.summary || '';
        document.getElementById('prof-dg-skills').value = p.digital_growth.skills || '';
        document.getElementById('prof-dg-experience').value = p.digital_growth.experience || '';
    }
}

// ────────────────────────────────────────────
// 6. TAB NAVIGATION
// ────────────────────────────────────────────
function initTabs() {
    const navBtns = document.querySelectorAll('.nav-btn[data-tab]');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Quick action buttons
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.goto));
    });
}

function switchTab(tabId) {
    appState.activeTab = tabId;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update panes
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const activePane = document.getElementById(tabId);
    if (activePane) activePane.classList.add('active');

    // Refresh dynamic content
    if (tabId === 'dashboard-tab') updateDashboardStats();
    if (tabId === 'tracker-tab') updateTrackerUI();
}

// ────────────────────────────────────────────
// 7. DASHBOARD STATS
// ────────────────────────────────────────────
function updateDashboardStats() {
    const total = appState.tracker.length;
    const today = new Date().toISOString().slice(0, 10);
    const appliedToday = appState.tracker.filter(e => e.status === 'applied' && e.date && e.date.slice(0, 10) === today).length;
    const interviews = appState.tracker.filter(e => e.status === 'interview').length;

    const scored = appState.tracker.filter(e => e.atsScore && e.atsScore > 0);
    const avgAts = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + b.atsScore, 0) / scored.length) : 0;

    document.getElementById('stat-total-tracked').textContent = total;
    document.getElementById('stat-applied-today').textContent = appliedToday;
    document.getElementById('stat-interviews').textContent = interviews;
    document.getElementById('stat-avg-ats').textContent = avgAts > 0 ? avgAts + '%' : '—';

    // Recent apps
    const list = document.getElementById('recent-apps-list');
    const emptyMsg = document.getElementById('recent-apps-empty');
    list.innerHTML = '';

    const recent = [...appState.tracker].reverse().slice(0, 5);
    if (recent.length > 0) {
        emptyMsg.style.display = 'none';
        recent.forEach(entry => {
            const li = document.createElement('li');
            const titleHtml = entry.url 
                ? `<a href="${escapeHTML(entry.url)}" target="_blank" class="recent-app-title-link" style="color:var(--primary);text-decoration:none;font-weight:500;">${escapeHTML(entry.title || 'Untitled')} <i data-lucide="external-link" style="width:11px;height:11px;display:inline-block;opacity:0.6;margin-left:2px;vertical-align:middle;"></i></a>`
                : `<span class="recent-app-title">${escapeHTML(entry.title || 'Untitled')}</span>`;
            li.innerHTML = `
                ${titleHtml}
                <span class="recent-app-meta">${escapeHTML(entry.company || '')} · ${entry.status}</span>
            `;
            list.appendChild(li);
        });
    } else {
        emptyMsg.style.display = 'block';
    }

    updateProgressUI();
}

// ────────────────────────────────────────────
// 8. DAILY PROGRESS
// ────────────────────────────────────────────
function updateProgressUI() {
    const today = new Date().toISOString().slice(0, 10);
    const applied = appState.tracker.filter(e => e.status === 'applied' && e.date && e.date.slice(0, 10) === today).length;
    const target = appState.settings.dailyTarget || 5;
    const percent = Math.min(100, Math.round((applied / target) * 100));

    const bar = document.getElementById('daily-progress');
    const fraction = document.getElementById('target-fraction');
    const pctEl = document.getElementById('target-percent');

    if (bar) bar.style.width = percent + '%';
    if (fraction) fraction.textContent = `${applied} / ${target}`;
    if (pctEl) pctEl.textContent = percent + '%';
}

// ────────────────────────────────────────────
// 9. JOB FEED
// ────────────────────────────────────────────
async function fetchJobs() {
    const container = document.getElementById('jobs-container');
    // Show skeletons
    container.innerHTML = `
        <div class="skeleton-card"><div class="skeleton-line w80"></div><div class="skeleton-line w60"></div><div class="skeleton-line w90"></div></div>
        <div class="skeleton-card"><div class="skeleton-line w80"></div><div class="skeleton-line w60"></div><div class="skeleton-line w90"></div></div>
        <div class="skeleton-card"><div class="skeleton-line w80"></div><div class="skeleton-line w60"></div><div class="skeleton-line w90"></div></div>
    `;

    try {
        const resp = await fetch('/api/jobs');
        if (!resp.ok) throw new Error('API response not OK');
        const data = await resp.json();
        appState.jobs = Array.isArray(data) ? data : (data.jobs || []);
    } catch (e) {
        console.warn('Job fetch failed, using sample data:', e);
        appState.jobs = getSampleJobs();
    }
    renderJobs();
}

function getSampleJobs() {
    return [
        {
            id: 1, title: "Junior Technical Support Engineer", company_name: "CloudScale Inc",
            category: "it_support", source: "Remotive",
            publication_date: new Date().toISOString(),
            url: "https://remotive.com/remote-jobs/software-dev",
            description: "We are looking for a Junior Technical Support Engineer to join our growing team. You will provide L1/L2 support for our cloud-based SaaS platform, troubleshoot customer issues, manage tickets in ServiceNow, and collaborate with engineering teams to resolve complex incidents.\n\nRequirements:\n- 1+ years of technical support experience\n- Familiarity with Linux, AWS, and Docker\n- Experience with ticketing systems (ServiceNow, Jira)\n- Strong troubleshooting and communication skills\n- Knowledge of SQL and basic scripting (Bash/Python)\n\nNice to have:\n- Kubernetes experience\n- ITIL certification\n- Experience with monitoring tools"
        },
        {
            id: 2, title: "Help Desk Analyst - Remote", company_name: "TechBridge Solutions",
            category: "it_support", source: "We Work Remotely",
            publication_date: new Date(Date.now() - 86400000).toISOString(),
            url: "https://weworkremotely.com/remote-jobs",
            description: "TechBridge Solutions seeks a Help Desk Analyst to provide first and second-level support for internal and external users. Responsibilities include managing incident tickets, performing root cause analysis, and maintaining SLA targets.\n\nRequirements:\n- Associate's degree in IT or related field\n- Experience with Windows Server and Linux\n- Familiarity with Oracle or MySQL databases\n- Strong documentation and communication skills\n- ServiceNow or similar ITSM tool experience"
        },
        {
            id: 3, title: "Junior Frontend Developer", company_name: "PixelCraft Studio",
            category: "frontend", source: "Jobspresso",
            publication_date: new Date(Date.now() - 172800000).toISOString(),
            url: "https://jobspresso.co",
            description: "PixelCraft Studio is hiring a Junior Frontend Developer to build modern, responsive web applications using React and JavaScript. You'll work closely with designers and backend engineers to deliver pixel-perfect UIs.\n\nRequirements:\n- Strong HTML5, CSS3, and JavaScript skills\n- Experience with React or similar framework\n- Responsive design expertise\n- Git/GitHub workflow experience\n- Eye for clean UI design\n\nNice to have:\n- TypeScript experience\n- Familiarity with AWS deployment\n- Experience with Docker containers"
        },
        {
            id: 4, title: "IT Support Specialist (Entry Level)", company_name: "NovaTech Global",
            category: "it_support", source: "Dynamite Jobs",
            publication_date: new Date(Date.now() - 259200000).toISOString(),
            url: "https://dynamitejobs.com",
            description: "NovaTech Global is looking for an entry-level IT Support Specialist to join our remote operations team. You'll handle helpdesk tickets, troubleshoot application issues, and support our cloud infrastructure.\n\nRequirements:\n- Degree in Computer Science or related field\n- Basic knowledge of AWS, Linux, and networking\n- SQL and scripting fundamentals\n- Excellent problem-solving abilities\n- Willingness to learn and grow"
        },
        {
            id: 5, title: "Growth & Automation Analyst", company_name: "DataPulse AI",
            category: "digital_growth", source: "Virtual Vocations",
            publication_date: new Date(Date.now() - 345600000).toISOString(),
            url: "https://virtualvocations.com",
            description: "DataPulse AI seeks a Growth & Automation Analyst to drive digital strategy and process automation initiatives. You'll leverage data analytics, Python scripting, and cloud tools to optimize business processes.\n\nRequirements:\n- Strong Python and SQL skills\n- Experience with AWS or cloud platforms\n- Data analysis and visualization abilities\n- Automation and scripting experience (Bash/Shell)\n- Understanding of digital marketing metrics"
        },
        {
            id: 6, title: "Remote Customer Operations Coordinator", company_name: "FlexiWork Co",
            category: "customer_support", source: "SkipTheDrive",
            publication_date: new Date(Date.now() - 432000000).toISOString(),
            url: "https://skipthedrive.com",
            description: "FlexiWork Co is hiring a Remote Customer Operations Coordinator. You will manage customer communications, track operational metrics, and ensure smooth day-to-day workflow. Prior experience with project management and SaaS tools is a plus.\n\nRequirements:\n- Excellent written and verbal communication\n- Experience with CRM and project management tools\n- Detail-oriented and organized\n- Comfortable working independently"
        }
    ];
}

function isEntryLevel(job) {
    const text = ((job.title || '') + ' ' + (job.description || '')).toLowerCase();
    const juniorKeywords = ['junior', 'jr', 'associate', 'entry', 'entry-level', 'entry level', 'l1', 'l2', 'help desk', 'helpdesk', 'tier 1', 'tier 2', 'graduate', 'intern', 'trainee'];
    const seniorKeywords = ['senior', 'sr', 'lead', 'staff', 'principal', 'director', 'vp', 'head of', 'architect', 'manager', '7+ years', '8+ years', '10+ years'];

    const hasSenior = seniorKeywords.some(k => text.includes(k));
    if (hasSenior) return false;

    const hasJunior = juniorKeywords.some(k => text.includes(k));
    return hasJunior;
}

function renderJobs() {
    const container = document.getElementById('jobs-container');
    const search = (document.getElementById('job-search-input').value || '').toLowerCase().trim();
    const entryOnly = document.getElementById('filter-entry-level').checked;
    const filter = appState.activeFilter;

    let filtered = [...appState.jobs];

    // Category filter
    if (filter !== 'all') {
        filtered = filtered.filter(j => (j.category || '').toLowerCase() === filter);
    }

    // Entry-level filter
    if (entryOnly) {
        filtered = filtered.filter(j => isEntryLevel(j));
    }

    // Search filter
    if (search) {
        filtered = filtered.filter(j => {
            const text = ((j.title || '') + ' ' + (j.company_name || '') + ' ' + (j.description || '')).toLowerCase();
            return text.includes(search);
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="glass-card" style="text-align:center;padding:40px"><p style="color:var(--text-muted)">No jobs found matching your filters. Try adjusting your search or filters.</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((job, idx) => {
        const shortDesc = (job.description || '').slice(0, 350).trim();
        const hasMore = (job.description || '').length > 350;
        const date = job.publication_date ? new Date(job.publication_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        const catLabel = { it_support: 'IT Support', frontend: 'Web Dev', customer_support: 'Operations', digital_growth: 'Growth & AI' }[job.category] || job.category || 'General';

        return `
            <div class="job-card" data-job-id="${job.id || idx}">
                <div class="job-badge-row">
                    <span class="badge badge-category">${escapeHTML(catLabel)}</span>
                    <span class="badge badge-source">${escapeHTML(job.source || 'Remote')}</span>
                    ${date ? `<span class="badge badge-date">${date}</span>` : ''}
                </div>
                <h3>${escapeHTML(job.title || 'Untitled Position')}</h3>
                <p class="job-company">${escapeHTML(job.company_name || 'Company')}</p>
                <p class="job-desc-short">${escapeHTML(shortDesc)}${hasMore ? '...' : ''}</p>
                ${hasMore ? `<div class="job-desc-full" id="job-full-${job.id || idx}">${escapeHTML(job.description || '')}</div>
                <button class="btn-read-more" onclick="toggleJobDesc(${job.id || idx})">Read More</button>` : ''}
                <div class="job-actions">
                    <a href="${escapeHTML(job.link || job.url || '#')}" target="_blank" class="btn-primary" style="background: linear-gradient(135deg, var(--secondary), var(--accent)); color: white;"><i data-lucide="external-link"></i> Apply Now</a>
                    <button class="btn-secondary" onclick="tailorFromJob(${job.id || idx})"><i data-lucide="sparkles"></i> Tailor &amp; RezPass</button>
                </div>
            </div>
        `;
    }).join('');

    safeCreateIcons();
}

function toggleJobDesc(jobId) {
    const full = document.getElementById('job-full-' + jobId);
    const btn = full ? full.nextElementSibling : null;
    if (full) {
        full.classList.toggle('expanded');
        if (btn) btn.textContent = full.classList.contains('expanded') ? 'Read Less' : 'Read More';
    }
}

function tailorFromJob(jobId) {
    const job = appState.jobs.find(j => (j.id || 0) === jobId) || appState.jobs[jobId] || {};
    document.getElementById('job-title').value = job.title || '';
    document.getElementById('job-company').value = job.company_name || '';
    document.getElementById('job-url').value = job.link || job.url || '';
    document.getElementById('job-desc').value = job.description || '';

    // Set source board
    const sourceSelect = document.getElementById('job-source-board');
    const sourceOptions = Array.from(sourceSelect.options).map(o => o.value);
    if (sourceOptions.includes(job.source)) {
        sourceSelect.value = job.source;
    } else {
        sourceSelect.value = 'Other';
    }

    // Detect career track from category
    const trackMap = { it_support: 'it_support', frontend: 'frontend', digital_growth: 'digital_growth', customer_support: 'it_support' };
    document.getElementById('profile-select').value = trackMap[job.category] || 'it_support';

    switchTab('tailor-tab');

    // Auto-trigger ATS analysis
    setTimeout(() => triggerATSAnalysis(), 200);
}

// ────────────────────────────────────────────
// 10. ATS ANALYSIS
// ────────────────────────────────────────────
function triggerATSAnalysis() {
    const jobDesc = (document.getElementById('job-desc').value || '').toLowerCase();
    const track = document.getElementById('profile-select').value;
    const prof = appState.profile[track] || {};
    const profileText = ((prof.summary || '') + ' ' + (prof.skills || '') + ' ' + (prof.experience || '')).toLowerCase();

    if (!jobDesc.trim()) {
        updateATSUI(0, [], []);
        return;
    }

    // Find keywords from job description that are in our dictionary
    const jobKeywords = [];
    ATS_SKILLS_DICTIONARY.forEach(skill => {
        const regex = new RegExp('\\b' + skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
        if (regex.test(jobDesc)) {
            jobKeywords.push(skill);
        }
    });

    // Check which ones are in profile
    const matched = [];
    const missing = [];
    jobKeywords.forEach(kw => {
        const regex = new RegExp('\\b' + kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
        if (regex.test(profileText)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    });

    const total = matched.length + missing.length;
    const score = total > 0 ? Math.round((matched.length / total) * 100) : 0;

    updateATSUI(score, matched, missing);
    return { score, matched, missing };
}

function updateATSUI(score, matched, missing) {
    // Progress circle
    const circle = document.getElementById('ats-progress-circle');
    const scoreText = document.getElementById('ats-score-text');
    const circumference = 263.89;
    const offset = circumference - (score / 100) * circumference;

    circle.style.strokeDashoffset = offset;

    let color = '#00f5d4'; // teal for >= 75
    if (score < 50) color = '#ef4444'; // red
    else if (score < 75) color = '#f59e0b'; // amber

    circle.style.stroke = color;
    scoreText.textContent = score > 0 ? score : '—';

    // Matched pills
    const matchedContainer = document.getElementById('ats-matched-pills');
    matchedContainer.innerHTML = matched.map(k => `<span class="pill pill-matched">${escapeHTML(k)}</span>`).join('');

    // Missing pills
    const missingContainer = document.getElementById('ats-missing-pills');
    missingContainer.innerHTML = missing.map(k => `<span class="pill pill-missing">${escapeHTML(k)}</span>`).join('');
}

// ────────────────────────────────────────────
// 11. AI GENERATION
// ────────────────────────────────────────────
async function generateTailoredAssets() {
    const title = document.getElementById('job-title').value.trim();
    const company = document.getElementById('job-company').value.trim();
    const url = document.getElementById('job-url').value.trim();
    const source = document.getElementById('job-source-board').value;
    const jobDesc = document.getElementById('job-desc').value.trim();
    const track = document.getElementById('profile-select').value;
    const prof = appState.profile[track] || {};
    const warning = document.getElementById('api-key-warning');

    if (!title) {
        showToast('Please enter a job title.', true);
        return;
    }

    // Run ATS analysis
    const atsResult = triggerATSAnalysis() || { score: 0, matched: [], missing: [] };

    const apiKey = appState.settings.geminiKey;

    if (apiKey) {
        warning.classList.add('hidden');
        showToast('Generating AI-tailored assets...');

        try {
            // Resume prompt
            const resumePrompt = `You are a professional resume writer specializing in ATS-optimized resumes. Create a tailored resume for the following candidate applying for this specific position.

CANDIDATE: Suraj Burkul
PHONE: +919156388838
EMAIL: surajburkul@gmail.com
LOCATION: Pune, Maharashtra, India

EDUCATION:
- Bachelor of Computer Applications (BCA) — Vivekananda Global University (2024 - Present)
- HSC — 2014

CERTIFICATIONS: AWS Certified, GCP Associate, Azure Fundamentals, Docker Certified, DevOps Professional, Linux Admin

CAREER TRACK PROFILE:
Summary: ${prof.summary || ''}
Skills: ${prof.skills || ''}
Experience: ${prof.experience || ''}

TARGET POSITION: ${title} at ${company}

JOB DESCRIPTION:
${jobDesc}

INSTRUCTIONS:
- Write a complete, ATS-friendly resume in plain text format
- Emphasize matching keywords: ${atsResult.matched.join(', ')}
- Try to incorporate missing keywords naturally: ${atsResult.missing.join(', ')}
- Focus on quantifiable achievements
- Keep it clean and professional, 1-2 pages worth of content
- Use clear section headers: CONTACT, SUMMARY, SKILLS, EXPERIENCE, EDUCATION, CERTIFICATIONS`;

            const letterPrompt = `Write a professional cover letter for the following candidate applying for this specific position.

CANDIDATE: Suraj Burkul
EMAIL: surajburkul@gmail.com
PHONE: +919156388838
LOCATION: Pune, Maharashtra, India

CAREER PROFILE:
${prof.summary || ''}

TARGET POSITION: ${title} at ${company}

JOB DESCRIPTION:
${jobDesc}

INSTRUCTIONS:
- Write a compelling, professional cover letter
- Address why the candidate is a strong fit for this specific role
- Reference relevant skills and experience
- Keep it concise (3-4 paragraphs)
- Use a professional but warm tone
- Include proper greeting and closing`;

            // Call Gemini API for resume
            const resumeResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: resumePrompt }] }]
                })
            });

            const resumeData = await resumeResp.json();
            const resumeText = resumeData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: Could not generate resume. Check your API key.';

            // Call Gemini API for cover letter
            const letterResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: letterPrompt }] }]
                })
            });

            const letterData = await letterResp.json();
            const letterText = letterData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: Could not generate cover letter. Check your API key.';

            document.getElementById('tailored-resume-pre').textContent = resumeText;
            document.getElementById('tailored-letter-pre').textContent = letterText;
            showToast('AI-tailored assets generated successfully!');

        } catch (e) {
            console.error('Gemini API error:', e);
            showToast('API error. Falling back to heuristic templates.', true);
            generateFallback(title, company, prof, atsResult);
        }
    } else {
        warning.classList.remove('hidden');
        generateFallback(title, company, prof, atsResult);
    }

    // Add tracker entry
    addTrackerEntry(title, company, url, track, 'optimized', source, atsResult.score);
}

function generateFallback(title, company, prof, atsResult) {
    document.getElementById('tailored-resume-pre').textContent = generateHeuristicResume(title, company, prof);
    document.getElementById('tailored-letter-pre').textContent = generateHeuristicLetter(title, company, prof);
    showToast('Heuristic resume & letter generated. Add Gemini API key for AI-powered results.');
}

// ────────────────────────────────────────────
// 12. HEURISTIC TEMPLATES
// ────────────────────────────────────────────
function generateHeuristicResume(title, company, profile) {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `═══════════════════════════════════════════
SURAJ BURKUL
═══════════════════════════════════════════
+91 9156388838 | surajburkul@gmail.com
Pune, Maharashtra, India
LinkedIn: linkedin.com/in/surajburkul

═══════════════════════════════════════════
PROFESSIONAL SUMMARY
═══════════════════════════════════════════
${profile.summary || 'Motivated technical professional seeking new opportunities.'}

Tailored for: ${title} at ${company}

═══════════════════════════════════════════
TECHNICAL SKILLS
═══════════════════════════════════════════
${profile.skills || 'Technical skills not specified.'}

═══════════════════════════════════════════
PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════
${profile.experience || 'Experience details not specified.'}

═══════════════════════════════════════════
EDUCATION
═══════════════════════════════════════════
Bachelor of Computer Applications (BCA)
Vivekananda Global University | 2024 — Present

Higher Secondary Certificate (HSC)
Completed 2014

═══════════════════════════════════════════
CERTIFICATIONS
═══════════════════════════════════════════
• AWS Certified Cloud Practitioner
• Google Cloud Platform (GCP) Associate
• Microsoft Azure Fundamentals (AZ-900)
• Docker Certified Associate
• DevOps Professional Certificate
• Linux System Administration

═══════════════════════════════════════════
Generated on ${today} for application to ${company}
Optimized by ApexJob RezPass™`;
}

function generateHeuristicLetter(title, company, profile) {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `${today}

Dear Hiring Manager,

I am writing to express my strong interest in the ${title} position at ${company}. With my background in technical support engineering and hands-on experience with cloud technologies, I am confident I can make a meaningful contribution to your team.

${profile.summary || ''}

In my previous role as a Technical Support Engineer, I developed expertise in incident management, root cause analysis, and cross-functional collaboration. I maintained 99.5%+ SLA compliance while managing 50+ monthly tickets and reduced repeat incidents by approximately 30% through proactive preventive measures. My technical toolkit spans AWS, Docker, Kubernetes, Linux administration, and scripting with Python and Bash.

I am particularly drawn to ${company} because of the opportunity to apply my skills in a challenging, growth-oriented environment. I am a quick learner with strong analytical abilities and a genuine passion for technology. I hold certifications in AWS, GCP, Azure, Docker, and DevOps, demonstrating my commitment to continuous professional development.

I would welcome the opportunity to discuss how my skills and experience align with the needs of your team. Thank you for considering my application. I look forward to hearing from you.

Warm regards,
Suraj Burkul
+91 9156388838
surajburkul@gmail.com
Pune, Maharashtra, India`;
}

// ────────────────────────────────────────────
// 13. TRACKER / KANBAN
// ────────────────────────────────────────────
function addTrackerEntry(title, company, url, track, status, source, atsScore) {
    const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        title: title || 'Untitled',
        company: company || '',
        url: url || '',
        track: track || 'it_support',
        status: status || 'saved',
        source: source || 'Other',
        atsScore: atsScore || 0,
        date: new Date().toISOString()
    };
    appState.tracker.push(entry);
    saveTracker();
    updateTrackerUI();
    updateDashboardStats();
}

function updateTrackerUI() {
    const statuses = ['saved', 'optimized', 'applied', 'interview', 'offer'];

    statuses.forEach(status => {
        const col = document.getElementById('col-' + status);
        const count = document.getElementById('count-' + status);
        const entries = appState.tracker.filter(e => e.status === status);

        count.textContent = entries.length;
        col.innerHTML = entries.map(entry => {
            let atsColor = 'var(--text-muted)';
            let atsBg = 'rgba(255,255,255,0.04)';
            if (entry.atsScore >= 75) { atsColor = 'var(--accent)'; atsBg = 'rgba(0,245,212,0.1)'; }
            else if (entry.atsScore >= 50) { atsColor = 'var(--amber)'; atsBg = 'rgba(245,158,11,0.1)'; }
            else if (entry.atsScore > 0) { atsColor = 'var(--danger)'; atsBg = 'rgba(239,68,68,0.1)'; }

            const titleHtml = entry.url 
                ? `<a href="${escapeHTML(entry.url)}" target="_blank" class="tracker-card-link-title" style="color:var(--text-primary);text-decoration:none;transition:var(--transition);" title="Open Job Posting">${escapeHTML(entry.title)} <i data-lucide="external-link" class="inline-icon" style="width:11px;height:11px;display:inline-block;opacity:0.6;margin-left:2px;vertical-align:middle;"></i></a>`
                : `<span class="tracker-card-title-text">${escapeHTML(entry.title)}</span>`;

            return `
                <div class="tracker-card" draggable="true" data-id="${entry.id}">
                    <div class="tracker-card-title">${titleHtml}</div>
                    <div class="tracker-card-company">${escapeHTML(entry.company)}</div>
                    <div class="tracker-card-source">${escapeHTML(entry.source || '')}</div>
                    ${entry.atsScore > 0 ? `<span class="tracker-card-ats" style="color:${atsColor};background:${atsBg}">ATS: ${entry.atsScore}%</span>` : ''}
                    <div class="tracker-card-actions">
                        ${entry.url ? `<a href="${escapeHTML(entry.url)}" target="_blank" class="btn-url-link" title="Apply Now" style="text-decoration:none;"><i data-lucide="external-link"></i></a>` : ''}
                        <button class="btn-advance" onclick="advanceTrackerStatus('${entry.id}')" title="Advance"><i data-lucide="arrow-right"></i></button>
                        <button class="btn-delete" onclick="deleteTrackerEntry('${entry.id}')" title="Delete"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    });

    safeCreateIcons();
    initKanbanDragAndDrop();
}

function advanceTrackerStatus(id) {
    const flow = ['saved', 'optimized', 'applied', 'interview', 'offer'];
    const entry = appState.tracker.find(e => e.id === id);
    if (!entry) return;
    const idx = flow.indexOf(entry.status);
    if (idx < flow.length - 1) {
        entry.status = flow[idx + 1];
        if (entry.status === 'applied') entry.date = new Date().toISOString();
        saveTracker();
        updateTrackerUI();
        updateDashboardStats();
        showToast(`Moved "${entry.title}" to ${entry.status}`);
    }
}

function deleteTrackerEntry(id) {
    appState.tracker = appState.tracker.filter(e => e.id !== id);
    saveTracker();
    updateTrackerUI();
    updateDashboardStats();
    showToast('Application removed.');
}

function moveTrackerEntry(id, newStatus) {
    const entry = appState.tracker.find(e => e.id === id);
    if (!entry) return;
    entry.status = newStatus;
    if (newStatus === 'applied' && !entry.date) entry.date = new Date().toISOString();
    saveTracker();
    updateTrackerUI();
    updateDashboardStats();
}

// ────────────────────────────────────────────
// 14. KANBAN DRAG & DROP
// ────────────────────────────────────────────
function initKanbanDragAndDrop() {
    // Cards
    document.querySelectorAll('.tracker-card[draggable]').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            document.querySelectorAll('.kanban-cards').forEach(c => c.classList.remove('drag-over'));
        });
    });

    // Drop zones
    document.querySelectorAll('.kanban-cards').forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            container.classList.add('drag-over');
        });
        container.addEventListener('dragleave', () => {
            container.classList.remove('drag-over');
        });
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');
            const id = e.dataTransfer.getData('text/plain');
            const col = container.closest('.kanban-column');
            if (col) {
                const newStatus = col.dataset.status;
                moveTrackerEntry(id, newStatus);
            }
        });
    });
}

// ────────────────────────────────────────────
// 15. BOARD HUB QUICK LOG
// ────────────────────────────────────────────
function initBoardHub() {
    document.querySelectorAll('.btn-quick-log').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.board-card');
            const titleInput = card.querySelector('.quick-log-title');
            const companyInput = card.querySelector('.quick-log-company');
            const urlInput = card.querySelector('.quick-log-url');
            const source = card.dataset.source || 'Other';
            const title = titleInput.value.trim();
            const company = companyInput.value.trim();
            const url = urlInput ? urlInput.value.trim() : '';

            if (!title) {
                showToast('Please enter a job title.', true);
                return;
            }

            addTrackerEntry(title, company, url, 'it_support', 'applied', source, 80);
            showToast(`Logged "${title}" from ${source} as Applied!`);
            titleInput.value = '';
            companyInput.value = '';
            if (urlInput) urlInput.value = '';
        });
    });
}

// ────────────────────────────────────────────
// 16. MODAL
// ────────────────────────────────────────────
function initModal() {
    const modal = document.getElementById('add-job-modal');
    const openBtn = document.getElementById('btn-add-tracker');
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel-modal');
    const submitBtn = document.getElementById('btn-submit-modal');

    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    submitBtn.addEventListener('click', () => {
        const title = document.getElementById('modal-title').value.trim();
        const company = document.getElementById('modal-company').value.trim();
        const source = document.getElementById('modal-source').value;
        const url = document.getElementById('modal-url').value.trim();
        const track = document.getElementById('modal-track').value;
        const status = document.getElementById('modal-status').value;

        if (!title) {
            showToast('Please enter a job title.', true);
            return;
        }

        addTrackerEntry(title, company, url, track, status, source, 0);
        showToast(`"${title}" added to pipeline!`);
        modal.classList.add('hidden');

        // Clear form
        document.getElementById('modal-title').value = '';
        document.getElementById('modal-company').value = '';
        document.getElementById('modal-url').value = '';
    });
}

// ────────────────────────────────────────────
// 17. COPY UTILITY
// ────────────────────────────────────────────
function initCopyUtility() {
    document.getElementById('btn-copy-output').addEventListener('click', () => {
        const resumePane = document.getElementById('output-resume-pane');
        const letterPane = document.getElementById('output-cover-letter-pane');

        let text = '';
        if (resumePane.classList.contains('active')) {
            text = document.getElementById('tailored-resume-pre').textContent;
        } else {
            text = document.getElementById('tailored-letter-pre').textContent;
        }

        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        }).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Copied to clipboard!');
        });
    });

    // Output tab switching
    document.querySelectorAll('.output-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.output-pane').forEach(p => p.classList.remove('active'));
            const paneId = tab.dataset.output === 'resume' ? 'output-resume-pane' : 'output-cover-letter-pane';
            document.getElementById(paneId).classList.add('active');
        });
    });
}

// ────────────────────────────────────────────
// 18. TOAST NOTIFICATIONS
// ────────────────────────────────────────────
function showToast(message, isError) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast ' + (isError ? 'error' : 'success');
    toast.innerHTML = `<i data-lucide="${isError ? 'alert-circle' : 'check-circle'}"></i><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);
    safeCreateIcons();

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ────────────────────────────────────────────
// 19. UTILITY
// ────────────────────────────────────────────
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ────────────────────────────────────────────
// 20. INIT ON DOM LOAD
// ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    loadLocalStorage();

    // Init features
    initTabs();
    initModal();
    initCopyUtility();
    initKanbanDragAndDrop();
    initBoardHub();

    // Fetch jobs
    fetchJobs();

    // Update dashboard
    updateDashboardStats();

    // ─── Wire up event listeners ───

    // Refresh jobs
    document.getElementById('btn-refresh-jobs').addEventListener('click', () => {
        fetchJobs();
        showToast('Refreshing job feed...');
    });

    // Search input
    document.getElementById('job-search-input').addEventListener('input', () => renderJobs());

    // Entry-level checkbox
    document.getElementById('filter-entry-level').addEventListener('change', () => renderJobs());

    // Filter buttons
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.activeFilter = btn.dataset.filter;
            renderJobs();
        });
    });

    // Settings save
    document.getElementById('btn-save-settings').addEventListener('click', saveSettings);

    // Profile save
    document.getElementById('btn-save-profile').addEventListener('click', saveProfile);

    // Profile tab switching
    document.querySelectorAll('.profile-tab[data-prof-track]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.profile-pane').forEach(p => p.classList.remove('active'));
            const paneId = 'prof-' + tab.dataset.profTrack + '-pane';
            const pane = document.getElementById(paneId);
            if (pane) pane.classList.add('active');
        });
    });

    // Generate AI button
    document.getElementById('btn-generate-ai').addEventListener('click', generateTailoredAssets);

    // ATS score manual override
    document.getElementById('ats-score-override').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            updateATSUI(val,
                Array.from(document.getElementById('ats-matched-pills').querySelectorAll('.pill')).map(p => p.textContent),
                Array.from(document.getElementById('ats-missing-pills').querySelectorAll('.pill')).map(p => p.textContent)
            );
        }
    });

    // Job desc input triggers ATS analysis on change
    document.getElementById('job-desc').addEventListener('input', debounce(() => triggerATSAnalysis(), 500));

    // Profile select triggers ATS re-analysis
    document.getElementById('profile-select').addEventListener('change', () => triggerATSAnalysis());

    // Toggle API key visibility
    document.getElementById('btn-toggle-key-visibility').addEventListener('click', () => {
        const input = document.getElementById('setting-gemini-key');
        const btn = document.getElementById('btn-toggle-key-visibility');
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = '<i data-lucide="eye-off"></i>';
        } else {
            input.type = 'password';
            btn.innerHTML = '<i data-lucide="eye"></i>';
        }
        safeCreateIcons();
    });

    // Quick fill master data
    document.getElementById('btn-quick-fill-master').addEventListener('click', () => {
        appState.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
        populateProfileUI();
        showToast('Master profile data loaded!');
    });

    // Initialize Lucide icons
    safeCreateIcons();
});

// ── Debounce utility ──
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
