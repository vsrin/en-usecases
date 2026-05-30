#!/usr/bin/env python3
"""
ElevateNow Evidence Lab — Access Token Generator

Usage:
  python scripts/generate_access_token.py <paper-slug> <email>

Examples:
  python scripts/generate_access_token.py ocr-benchmark naveena.spitz@afgroup.com
  python scripts/generate_access_token.py six-tier-stack kumar@elevatenow.tech

After generating a token:
  1. Copy the token printed below
  2. Add it to the VALID set inside the gate <script> in the corresponding HTML file
  3. git add + commit + push — Cloudflare Pages auto-deploys
  4. Send the shareable URL to the contact

Paper slugs:
  ocr-benchmark     → public/evidence-lab/ocr-benchmark.html
  six-tier-stack    → public/evidence-lab/six-tier-stack.html
"""

import hmac
import hashlib
import sys

# Secret used to sign tokens. Keep this private.
# To revoke all existing tokens: change this value, regenerate all active tokens,
# update the VALID sets in each HTML file, and redeploy.
SECRET = "en-el-2026-xK9mPvQ8rT5nLj3"

PAPERS = {
    "ocr-benchmark":         "OCR & Extraction Benchmark Framework",
    "six-tier-stack":        "Six-Tier Extraction Stack Architecture",
    "extraction-benchmark":  "The Extraction Intelligence Benchmark",
}

BASE_URL = "https://insights.elevatenow.tech"


def generate_token(paper_slug: str, email: str) -> str:
    msg = f"{paper_slug}:{email.lower().strip()}"
    return hmac.new(SECRET.encode(), msg.encode(), hashlib.sha256).hexdigest()[:40]


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    paper_slug = sys.argv[1].strip()
    email = sys.argv[2].lower().strip()

    if paper_slug not in PAPERS:
        print(f"\nUnknown paper slug: '{paper_slug}'")
        print(f"Valid slugs: {', '.join(PAPERS.keys())}\n")
        sys.exit(1)

    token = generate_token(paper_slug, email)
    url = f"{BASE_URL}/evidence-lab/{paper_slug}?access={token}"
    html_file = f"public/evidence-lab/{paper_slug}.html"

    print(f"""
  ─────────────────────────────────────────────────────────
  Paper : {PAPERS[paper_slug]}
  Email : {email}
  Token : {token}
  URL   : {url}
  ─────────────────────────────────────────────────────────

  Next steps:
    1. Open {html_file}
    2. Find:  var VALID=new Set([
    3. Add:   '{token}',
    4. Save, then:
       git add {html_file}
       git commit -m "[Insights] access: grant {email} → {paper_slug}"
       git push
  ─────────────────────────────────────────────────────────
""")


if __name__ == "__main__":
    main()
