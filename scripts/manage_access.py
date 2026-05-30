#!/usr/bin/env python3
"""
ElevateNow Insights — Access Grant Manager

Run with no arguments for interactive mode (recommended):
  python scripts/manage_access.py

Or pass arguments directly:
  python scripts/manage_access.py grant   <email> <artifact> [first] [last] [org]
  python scripts/manage_access.py revoke  <email> <artifact>
  python scripts/manage_access.py list    [artifact]
  python scripts/manage_access.py seed

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

COMMANDS = ["grant", "revoke", "list", "seed"]


# ── helpers ────────────────────────────────────────────────────────────────────

def get_col():
    client = MongoClient(MONGO_URI)
    return client[DB][COL]


def ask(prompt, required=True, default="", choices=None):
    """Prompt the user for a value, re-asking if required and blank."""
    if choices:
        choices_str = " / ".join(choices)
        full_prompt = f"  {prompt} [{choices_str}]: "
    elif default:
        full_prompt = f"  {prompt} (default: {default}): "
    else:
        full_prompt = f"  {prompt}: "

    while True:
        value = input(full_prompt).strip()
        if not value and default:
            return default
        if not value and required:
            print(f"    ↳ Required. Please enter a value.")
            continue
        if choices and value not in choices:
            print(f"    ↳ Must be one of: {', '.join(choices)}")
            continue
        return value


def confirm(prompt):
    """Ask yes/no, return True if yes."""
    answer = input(f"  {prompt} [y/N]: ").strip().lower()
    return answer in ("y", "yes")


def divider():
    print("  " + "─" * 60)


# ── core operations ────────────────────────────────────────────────────────────

def grant(email, artifact, first="", last="", org=""):
    email = email.lower().strip()
    if artifact not in ARTIFACTS:
        print(f"\n  ✗  Unknown artifact: '{artifact}'")
        print(f"     Valid: {', '.join(ARTIFACTS)}\n")
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
    print(f"\n  ✓  Granted: {email} → {artifact}\n")


def revoke(email, artifact):
    email = email.lower().strip()
    col = get_col()
    result = col.update_one(
        {"email": email, "artifact": artifact},
        {"$set": {"active": False, "date_decommissioned": datetime.now(timezone.utc)}},
    )
    if result.matched_count:
        print(f"\n  ✓  Revoked: {email} → {artifact}\n")
    else:
        print(f"\n  !  No active grant found for: {email} → {artifact}\n")


def list_grants(artifact=None):
    col = get_col()
    query = {"artifact": artifact} if artifact else {}
    grants = list(col.find(query, {"_id": 0}).sort("date_provisioned", -1))
    print()
    if not grants:
        print("  (no grants found)\n")
        return
    fmt = "  {:<42} {:<24} {:<8} {}"
    print(fmt.format("EMAIL", "ARTIFACT", "ACTIVE", "PROVISIONED"))
    print("  " + "-" * 87)
    for g in grants:
        prov = g.get("date_provisioned")
        prov_str = prov.strftime("%Y-%m-%d") if prov else "—"
        active = "✓" if g.get("active") else "✗"
        print(fmt.format(g["email"], g["artifact"], active, prov_str))
    print()


def seed():
    print("\n  Seeding initial access grants…\n")
    for (email, artifact, first, last, org) in SEED_GRANTS:
        grant(email, artifact, first, last, org)
    print("  Done.\n")


# ── interactive flows ──────────────────────────────────────────────────────────

def interactive_grant():
    print("\n  — Grant Access —")
    divider()
    email    = ask("Email address", required=True)
    artifact = ask("Artifact", required=True, choices=ARTIFACTS)
    first    = ask("First name (optional)", required=False)
    last     = ask("Last name (optional)", required=False)
    org      = ask("Organization (optional)", required=False)
    divider()
    print(f"  Email    : {email}")
    print(f"  Artifact : {artifact}")
    if first or last:
        print(f"  Name     : {first} {last}".strip())
    if org:
        print(f"  Org      : {org}")
    divider()
    if confirm("Grant this access?"):
        grant(email, artifact, first, last, org)
    else:
        print("\n  Cancelled.\n")


def interactive_revoke():
    print("\n  — Revoke Access —")
    divider()
    email    = ask("Email address", required=True)
    artifact = ask("Artifact", required=True, choices=ARTIFACTS)
    divider()
    print(f"  Email    : {email}")
    print(f"  Artifact : {artifact}")
    divider()
    if confirm("Revoke this access?"):
        revoke(email, artifact)
    else:
        print("\n  Cancelled.\n")


def interactive_list():
    print("\n  — List Grants —")
    divider()
    filter_choice = ask("Filter by artifact? (leave blank for all)", required=False)
    artifact = filter_choice if filter_choice in ARTIFACTS else None
    if filter_choice and not artifact:
        print(f"  Note: '{filter_choice}' is not a known artifact — showing all grants.")
    list_grants(artifact)


def interactive():
    print()
    print("  ElevateNow Insights — Access Manager")
    divider()
    cmd = ask("Command", required=True, choices=COMMANDS)

    if cmd == "grant":
        interactive_grant()
    elif cmd == "revoke":
        interactive_revoke()
    elif cmd == "list":
        interactive_list()
    elif cmd == "seed":
        seed()


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    # No arguments → fully interactive
    if len(sys.argv) < 2:
        interactive()
        return

    cmd = sys.argv[1]

    if cmd == "grant":
        # Prompt for any missing arguments
        email    = sys.argv[2] if len(sys.argv) > 2 else ask("Email address", required=True)
        artifact = sys.argv[3] if len(sys.argv) > 3 else ask("Artifact", required=True, choices=ARTIFACTS)
        first    = sys.argv[4] if len(sys.argv) > 4 else ask("First name (optional)", required=False)
        last     = sys.argv[5] if len(sys.argv) > 5 else ask("Last name (optional)", required=False)
        org      = sys.argv[6] if len(sys.argv) > 6 else ask("Organization (optional)", required=False)
        grant(email, artifact, first, last, org)

    elif cmd == "revoke":
        email    = sys.argv[2] if len(sys.argv) > 2 else ask("Email address", required=True)
        artifact = sys.argv[3] if len(sys.argv) > 3 else ask("Artifact", required=True, choices=ARTIFACTS)
        revoke(email, artifact)

    elif cmd == "list":
        artifact = sys.argv[2] if len(sys.argv) > 2 else None
        list_grants(artifact)

    elif cmd == "seed":
        seed()

    else:
        print(f"\n  Unknown command: '{cmd}'")
        print(f"  Valid commands: {', '.join(COMMANDS)}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
