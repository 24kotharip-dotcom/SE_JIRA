from flask import Flask, request, jsonify, render_template
try:
    from flask_cors import CORS
except ImportError:
    CORS = None

from seed_data import INITIAL_PROFILES
from verifier import calculate_trust_score

app = Flask(__name__)
if CORS:
    CORS(app)

users = {profile["id"]: dict(profile) for profile in INITIAL_PROFILES}


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "CollabConnect API", "profiles_count": len(users)}), 200


@app.route("/register", methods=["POST"])
def register():
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    role = payload.get("role", "").strip().lower()

    if not name or not email or role not in ("creator", "brand", "business"):
        return jsonify({"error": "name, email and valid role ('creator', 'brand', 'business') are required"}), 400

    new_id = max(users.keys(), default=0) + 1
    new_user = {
        "id": new_id,
        "name": name,
        "email": email,
        "role": role,
        "niche": payload.get("niche", "").strip(),
        "followers": int(payload.get("followers", 0)),
        "website": payload.get("website", "").strip(),
        "verified": False,
        "trust_score": 0,
    }

    users[new_id] = new_user
    return jsonify(new_user), 201


@app.route("/verify/<int:uid>", methods=["POST"])
def verify(uid):
    user = users.get(uid)
    if not user:
        return jsonify({"error": "user not found"}), 404

    score, is_verified = calculate_trust_score(user)
    user["trust_score"] = score
    user["verified"] = is_verified

    return jsonify(user), 200


@app.route("/profiles", methods=["GET"])
def get_profiles():
    return jsonify(list(users.values())), 200


@app.route("/profiles/<int:uid>", methods=["GET"])
def get_profile(uid):
    user = users.get(uid)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify(user), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
