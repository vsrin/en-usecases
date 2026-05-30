#!/usr/bin/env python3
"""
ElevateNow Insights — Access Grant Manager

Usage:
  python scripts/manage_access.py grant   <email> <artifact> [first] [last] [org]
  python scripts/manage_access.py revoke  <email> <artifact>
  python scripts/manage_access.py list    [artifact]
  python scripts/manage_access.py seed

Examples:
  python scripts/manage_access.py grant naveena.spitz@afgroup.com semantic-hub Naveena Spitz "AF Group"
  python scripts/manage_access.py grant vinod.srinivasan@elevatenow.tech ocr-benchmark Vinod Srinivasan "ElevateNow"
  python scripts/manage_access.py revoke naveena.spitz@afgroup.com semantic-hub
  python scripts/manage_access.py list
  python scripts/manage_access.py list semantic-hub
  python scripts/manage_access.py seed   # seeds all current grantees

Valid artifacts:
  ocr-benchmark | six-tier-stack | extraction-benchmark | semantic-hub
"""

import sys
from datetime import datetime, timezone
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://artifi:root@artifi.2vi2m.mongodb.net/?retryWrites=true&w=majority&appName=Artifi"
DB = "insights_access"
COL = "access_grants"

ARTIFACTS = ["ocr-benchmark", "six-tier-stack", "extraction-benchmark", "semantic-hub"]

SEED_GRANTS = [
    # email, artifact, first, last, org
    ("vinod.srinivasan@elevatenow.tech", "ocr-benchmark",         "Vinod",   "Srinivasan", "ElevateNow"),
    ("vinod.srinivasan@elevatenow.tech", "six-tier-stack",        "Vinod",   "Srinivasan", "ElevateNow"),
    ("vinod.srinivasan@elevatenow.tech", "extraction-benchmark",  "Vinod",   "Srinivasan", "ElevateNow"),
    ("naveena.spitz@afgroup.com",        "semantic-hub",          "Naveena", "Spitz",      "AF Group"),
    ("kumar@elevatenow.tech",            "semantic-hub",          "Kumar",   "",           "ElevateNow"),
]


def get_col():
    client = MongoClient(MONGO_URI)
    return client[DB][COL]


def grant(email, artifact, first="", last="", org=""):
    email = email.lower().strip()
    if artifact not in ARTIFACTS:
        print(f"Unknown artifact: '{artifact}'. Valid: {', '.join(ARTIFACTS)}")
        sys.exit(1)
    col = get_col()
    col.update_one(
        {"email": email, "artifact": artifact},
        {"$set": {
            "email": email,
            "first_name": first,
            "last_name": last,
            "organization": org,
            "artifact": artifact,
            "active": True,
            "date_provisioned": datetime.now(timezone.utc),
            "duration_days": None,
            "date_decommissioned": None,
        }},
        upsert=True,
    )
    print(f"  ✓  Granted: {email} → {artifact}")


def revoke(email, artifact):
    email = email.lower().strip()
    col = get_col()
    result = col.update_one(
        {"email": email, "artifact": artifact},
        {"$set": {"active": False, "date_decommissioned": datetime.now(timezone.utc)}},
    )
    if result.matched_count:
        print(f"  ✓  Revoked: {email} → {artifact}")
    else:
        print(f"  !  No grant found for: {email} → {artifact}")


def list_grants(artifact=None):
    col = get_col()
    query = {"artifact": artifact} if artifact else {}
    grants = list(col.find(query, {"_id": 0}).sort("date_provisioned", -1))
    if not grants:
        print("  (no grants found)")
        return
    fmt = "  {:<42} {:<22} {:<8} {}"
    print(fmt.format("EMAIL", "ARTIFACT", "ACTIVE", "PROVISIONED"))
    print("  " + "-" * 85)
    for g in grants:
        prov = g.get("date_provisioned")
        prov_str = prov.strftime("%Y-%m-%d") if prov else "—"
        active = "✓" if g.get("active") else "✗"
        print(fmt.format(g["email"], g["artifact"], active, prov_str))


def seed():
    print("Seeding initial access grants…")
    for (email, artifact, first, last, org) in SEED_GRANTS:
        grant(email, artifact, first, last, org)
    print("Done.")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "grant":
        if len(sys.argv) < 4:
            print("Usage: manage_access.py grant <email> <artifact> [first] [last] [org]")
            sys.exit(1)
        email, artifact = sys.argv[2], sys.argv[3]
        first = sys.argv[4] if len(sys.argv) > 4 else ""
        last  = sys.argv[5] if len(sys.argv) > 5 else ""
        org   = sys.argv[6] if len(sys.argv) > 6 else ""
        grant(email, artifact, first, last, org)

    elif cmd == "revoke":
        if len(sys.argv) < 4:
            print("Usage: manage_access.py revoke <email> <artifact>")
            sys.exit(1)
        revoke(sys.argv[2], sys.argv[3])

    elif cmd == "list":
        artifact = sys.argv[2] if len(sys.argv) > 2 else None
        list_grants(artifact)

    elif cmd == "seed":
        seed()

    else:
        print(f"Unknown command: '{cmd}'")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
