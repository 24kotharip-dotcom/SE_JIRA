# CollabConnect

A professional networking and collaboration platform engineered for creators, brands, and modern businesses to discover partners, verify credibility, and initiate collaboration workflows.

---

## Authors & Acknowledgments

- **Palak Kothari** &bull; Original Creator, Lead Software Architect & Developer
- **Prarthna Aggrawal** &bull; Product Design, UI/UX & Creative Strategy Contributor
- **Featured Profiles** &bull; Virat Kohli, Rohit Sharma, Aman Gupta (boAt), Zomato India, Sundar Pichai

---

## Platform Architecture

```
SE_JIRA/
├── module1_profile_verification/        # Module 1: Backend API & Verification Engine
│   ├── app.py                           # Flask RESTful API & Server Controller
│   ├── verifier.py                      # Trust score calculation & verification rules
│   ├── seed_data.py                     # Initial seed profile registry
│   ├── requirements.txt                 # Python dependencies (Flask, Flask-CORS)
│   ├── templates/
│   │   └── index.html                   # Interactive Verification Dashboard
│   └── static/
│       ├── style.css                    # Dashboard stylesheet
│       └── app.js                       # Verification UI controller
│
├── module2_discover_collaborate/        # Module 2: Discovery & Collaboration Client
│   ├── index.html                       # Semantic Discovery UI
│   ├── style.css                        # Stylesheet bundle entry
│   ├── script.js                        # Consolidated script fallback
│   ├── css/
│   │   ├── variables.css                # Design tokens & color system
│   │   ├── base.css                     # Reset, base typography & element rules
│   │   ├── components.css               # Cards, badges, search, buttons & toasts
│   │   └── layout.css                   # Header, grid layout & responsive sidebar
│   └── js/
│       ├── data.js                      # Default profile directory
│       ├── api.js                       # Module 1 API connector with offline fallback
│       ├── requests.js                  # Collaboration requests state & localStorage
│       ├── notifications.js             # Toast feedback system
│       └── app.js                       # Search, filter, render & event orchestration
│
└── README.md                            # Project documentation
```

---

## Module 1 &mdash; Profile Creation & Credibility Verification

Module 1 manages profile registration, identity verification, and algorithmic trust score calculation.

### Credibility & Trust Score Algorithm

A profile receives credibility points based on verified credentials:

| Credential Factor | Condition | Score Awarded |
| :--- | :--- | :--- |
| **Email Validity** | Contains `@` and `.` | `+30 points` |
| **Portfolio / Web Presence** | URL begins with `http://` or `https://` | `+30 points` |
| **Audience Proof** | Followers count &ge; 1,000 | `+40 points` |
| **Audience Proof (Starter)** | Followers count &ge; 100 and &lt; 1,000 | `+20 points` |
| **Verification Threshold** | Total Trust Score &ge; 60 | **Verified (`verified: true`)** |

### API Endpoints

- `POST /register`
  - Creates a new unverified profile.
  - **Payload**:
    ```json
    {
      "name": "Palak Kothari",
      "email": "palak.kothari@collabconnect.dev",
      "role": "creator",
      "niche": "Full Stack & AI Development",
      "followers": 145000,
      "website": "https://palakkothari.dev"
    }
    ```
  - **Response Status**: `201 Created`

- `POST /verify/<id>`
  - Evaluates credibility, calculates `trust_score`, and updates `verified` status.
  - **Response Status**: `200 OK`

- `GET /profiles`
  - Returns a list of all registered profiles.
  - **Response Status**: `200 OK`

- `GET /profiles/<id>`
  - Returns a single profile by numeric ID.
  - **Response Status**: `200 OK` (or `404 Not Found`)

### Running Module 1

1. Navigate to the module directory:
   ```bash
   cd module1_profile_verification
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask application:
   ```bash
   python app.py
   ```

4. Access the verification dashboard in your browser:
   ```
   http://127.0.0.1:5000
   ```

---

## Module 2 &mdash; Discovery & Collaboration Requests

Module 2 provides an interactive client interface for discovering verified partners and managing collaboration requests.

### Key Capabilities

1. **Dual Data Sourcing**:
   - Connects to Module 1's REST API (`http://127.0.0.1:5000/profiles`) when the backend service is running.
   - Automatically switches to standalone mode with pre-seeded profiles when running offline.

2. **Real-time Discovery**:
   - Search filter across profile names and niches.
   - Role dropdown filter (`Creator`, `Brand`, `Business`).
   - Verified credentials toggle (`Verified only`).

3. **Collaboration Workflow**:
   - Send collaboration requests with duplicate request prevention.
   - Real-time status tracking (`Pending`).
   - Withdrawal and bulk clearance of sent requests.
   - Non-volatile storage backed by browser `localStorage`.
   - Toast feedback notifications.

### Running Module 2

Simply open the client file in any modern web browser:
```bash
# Windows
start module2_discover_collaborate/index.html

# macOS
open module2_discover_collaborate/index.html

# Linux
xdg-open module2_discover_collaborate/index.html
```

---

## Verification & Testing

To execute automated tests on the Module 1 verification backend:

```bash
cd module1_profile_verification
python -c "import app; c = app.app.test_client(); res = c.get('/profiles'); print('Profiles count:', len(res.get_json())); assert res.status_code == 200; print('Backend healthy!')"
```
