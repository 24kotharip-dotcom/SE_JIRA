def calculate_trust_score(user_data):
    score = 0
    email = user_data.get("email", "")
    website = user_data.get("website", "")
    followers = int(user_data.get("followers", 0))

    if "@" in email and "." in email:
        score += 30

    if website.startswith("http"):
        score += 30

    if followers >= 1000:
        score += 40
    elif followers >= 100:
        score += 20

    is_verified = score >= 60

    return score, is_verified
