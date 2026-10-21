# Module 1: User Profile & Credibility Verification
# Run: pip install flask  ->  python module1_profile_verification.py

from flask import Flask, request, jsonify

app = Flask(__name__)
users = {}  # in-memory storage (use a DB later)

# ---------- Operation 1: create profile ----------
@app.route("/register", methods=["POST"])
def register():
    d = request.json
    if not d.get("name") or not d.get("email") or d.get("role") not in ("creator", "brand", "business"):
        return jsonify({"error": "name, email and valid role required"}), 400

    uid = len(users) + 1
    users[uid] = {
        "id": uid,
        "name": d["name"],
        "email": d["email"],
        "role": d["role"],
        "niche": d.get("niche", ""),
        "followers": int(d.get("followers", 0)),
        "website": d.get("website", ""),
        "verified": False,
        "trust_score": 0,
    }
    return jsonify(users[uid]), 201

# ---------- Operation 2: verify + trust score ----------
@app.route("/verify/<int:uid>", methods=["POST"])
def verify(uid):
    u = users.get(uid)
    if not u:
        return jsonify({"error": "user not found"}), 404

    score = 0
    if "@" in u["email"] and "." in u["email"]:
        score += 30                      # valid email
    if u["website"].startswith("http"):
        score += 30                      # has website / portfolio
    if u["followers"] >= 1000:
        score += 40                      # audience proof
    elif u["followers"] >= 100:
        score += 20

    u["trust_score"] = score
    u["verified"] = score >= 60
    return jsonify(u)

@app.route("/profiles", methods=["GET"])
def profiles():
    return jsonify(list(users.values()))

if __name__ == "__main__":
    app.run(debug=True)
