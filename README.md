# CollabConnect

Professional networking and collaboration platform for creators, brands and businesses.

## Structure
```
CollabConnect/
├── module1_profile_verification/   (Python + Flask)
│   ├── app.py
│   └── requirements.txt
├── module2_discover_collaborate/   (HTML + CSS + JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Module 1 - Profile Creation & Credibility Verification
- `POST /register` creates a profile
- `POST /verify/<id>` calculates trust score and verified status
- `GET /profiles` lists all profiles

Run:
```
cd module1_profile_verification
pip install -r requirements.txt
python app.py
```

## Module 2 - Discovery & Collaboration Request
- Search and filter profiles (name/niche, role, verified only)
- Send collaboration request (status: Pending)

Run: open `module2_discover_collaborate/index.html` in a browser.
