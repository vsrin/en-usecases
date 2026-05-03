# Extraction & OCR Benchmark Framework

The standard OCR benchmarks — DocVQA, FUNSD, CORD, SROIE, IAM, MDPBench, OCRBench — measure general document understanding. None of them are designed for insurance. Insurance extraction has requirements that generic benchmarks don't surface:

A hallucinated VIN or policy number isn't an accuracy loss, it's a liability event. Field-level Exact Match — not approximate — is the right metric for structured fields. The same document run twice must produce identical output; LLM temperature variance is a compliance failure for Cat 1-3 fields, not an acceptable trade-off. "The model extracted X" doesn't satisfy a regulator; "X was extracted from character offset 4,521–4,528 in this document, version 2.3" does. And a 99% accurate extraction that routes PHI to an external API is a regulatory violation regardless of the accuracy number.

This framework was built around a real client objection, not a theoretical one. AMICA came to us because LLM-based extraction was a blocker — data sovereignty, explainability, and variance, in that order. Token cost was a distant fifth. This framework defines how we evaluate every extraction approach against the actual requirements, not the ones that look good in vendor demos.

---

## The Five Benchmark Groups

### Group 1 — Text Accuracy

| Metric | Definition | Threshold (Production) |
|--------|-----------|----------------------|
| **CER** (Character Error Rate) | Edit distance / reference length | ≤ 2% (digital), ≤ 5% (scanned) |
| **WER** (Word Error Rate) | Word-level edit distance | ≤ 3% (digital), ≤ 8% (scanned) |
| **Field-level EM** (Exact Match) | % of Cat 1 fields extracted without any character error | ≥ 95% |
| **Recall on Key Fields** | % of target fields successfully extracted (not blank) | ≥ 90% |

**Insurance note:** CER/WER measure overall text quality. For insurance, what matters is **Field-level EM on Cat 1 fields** (dates, dollar amounts, policy numbers, VINs, DL#, ICD-10). A tool that achieves 99% CER but drops the last digit of a policy number fails the insurance test regardless of aggregate score.

### Group 2 — Structure Fidelity

| Metric | Definition | Threshold |
|--------|-----------|-----------|
| **Table TEDS** (Tree Edit Distance Score) | Tree edit distance between extracted and ground-truth table structure. Score 0–1. | ≥ 0.90 (structured forms), ≥ 0.85 (scanned tables) |
| **Column/Row Precision** | % of table cells in correct grid position | ≥ 92% |
| **Form Field Detection** | % of labeled form fields detected (checkbox state, field label + value pairs) | ≥ 90% |

**Insurance note:** Loss run tables, ACORD form schedules, bordereaux, and IA report tables are the primary stress test. Multi-row merged cells and split-page tables are common failure modes.

### Group 3 — Robustness

| Test | Method | Pass Threshold |
|------|--------|----------------|
| **DPI Degradation Curve** | Extract same document at 300 / 200 / 150 / 75 DPI; measure CER at each | < 10% CER increase from 300→150 DPI (Tier 2.5 target); < 25% degradation is acceptable for Tier 1 |
| **Scan Quality Classes** | Class A (clean digital), B (clean scan), C (degraded/fax), D (handwritten) | Report accuracy by class; target: A≥98%, B≥94%, C≥85%, D: document and escalate |
| **Rotation/Skew** | ±5°, ±10°, ±20° rotation | < 15% CER increase at ±10° |
| **Multi-Column Layout** | Two and three-column documents (common in IA reports) | Correct reading order maintained |

### Group 4 — Operational Performance

| Metric | Target | Context |
|--------|--------|---------|
| **Throughput** | ≥ 200 pages/minute (digital), ≥ 50 pages/minute (scanned with OCR) | AMICA police reports: ~88/day = low volume; throughput is not the constraint |
| **P95 Latency** | ≤ 2 seconds/page (digital), ≤ 8 seconds/page (OCR pipeline) | For real-time FNOL workflows |
| **Cold Start** | ≤ 10 seconds | For batch processing initialization |
| **Memory Footprint** | T0-T2: < 1 GB RAM; T2.5: < 12 GB VRAM; T4: < 48 GB VRAM | Determines hardware tier |

### Group 5 — Audit and Compliance (Most Critical for Insurance)

| Metric | Definition | Insurance Threshold |
|--------|-----------|---------------------|
| **Grounding Rate** | % of extracted fields accompanied by a char offset or bounding box citation pointing to the source location in the document | ≥ 95% in production |
| **Hallucination Rate** | % of extracted field values that appear in the output but have no textual basis in the source document | **0.00% for production** — a hallucinated policy number or VIN is a production disqualifier |
| **Run Variance** | Standard deviation of extracted field values across 10 identical runs of the same document | **0.00 for Cat 1-3** — any variance is a compliance failure for regulated fields |
| **Data Sovereignty Posture** | Where extracted data travels during processing | T5 (external API) = prohibited for PHI/PII under posture B/C |

**Group 5 is the compliance gate.** A tool can score perfectly on Groups 1-4 and still be disqualified if it has non-zero hallucination rate, non-zero run variance for Cat 1 fields, or violates data sovereignty posture.

---

## Extraction Taxonomy (Five Categories)

The fundamental error in most extraction frameworks is treating extraction as one problem. It is five distinct categories requiring different tools and different compliance standards.

| Category | Description | LLM Required? | Best Non-LLM Approach | Run Variance Allowed? |
|----------|-----------|--------------|----------------------|----------------------|
| **Cat 1 — Deterministic structured fields** | Dates, dollar amounts, policy/claim numbers, VIN, license plate, DOB, DL#, ICD-10, SIC codes, state codes | No | pdfplumber + compiled regex | No — must be 0.00 |
| **Cat 2 — Ontology-anchored categoricals** | Body part, cause of loss, accident type, occupation class, coverage type | No (with training data) | spaCy custom NER + classifier trained on labeled examples | No for production classification |
| **Cat 3 — Verbatim narrative capture** | Injury description as stated, officer narrative, IA adjuster summary | No (verbatim = no interpretation) | Section boundary detection + text extraction | No — verbatim extraction is deterministic |
| **Cat 4 — Interpretation and synthesis** | Subrogation indicators, red flag analysis, coverage applicability determination, employer defense screening | **Yes — LLM required** | No viable non-LLM substitute | Acceptable within guardrails |
| **Cat 5 — Form structure understanding** | Form type identification, table extraction from scanned docs, handwritten field detection, checkbox state | No (CV/ML tools) | Docling, PaddleOCR, Granite-Docling-258M; Azure DI in carrier tenant | No for field detection |

**The AMICA implication:** AMICA's three use cases map as follows:
- UC1 (FNOL web form data): Entirely Cat 1 and Cat 3 — non-LLM coverage ≥ 95%
- UC2 (Police reports): Cat 1 (80%+), Cat 3 (15%), Cat 5 for scanned docs — non-LLM coverage ≥ 85%
- UC3 (IA reports): Cat 1-3 (70-80%), Cat 4 (subrogation = only LLM-necessary field) — non-LLM coverage ≥ 70%

---

## Six-Tier Technology Stack

Each tier represents a distinct capability level. Tools at higher tiers are more capable but carry higher cost, sovereignty risk, and variance.

| Tier | Label | What It Is | LLM? | GPU Required? | Data Sovereignty |
|------|-------|-----------|------|--------------|-----------------|
| **T0** | Document parsing substrate | pdfplumber, PyMuPDF — text layer extraction from digital PDFs | No | No | Posture A/B/C safe |
| **T1** | Traditional OCR | Tesseract 5.x (Apache 2.0), PaddleOCR v4 (Apache 2.0) — pixel → text for scanned documents | No | Optional (GPU accelerates PaddleOCR) | Posture A/B/C safe |
| **T2** | Rule-based extraction | Compiled regex patterns, spaCy custom NER, jurisdiction lookup tables | No | No | Posture A/B/C safe |
| **T2.5** | Tiny specialized VLM | IBM Granite-Docling-258M (Apache 2.0, 258M params) — document-native vision encoder, table TEDS 0.97, bounding box grounding | No* | 8 GB VRAM | Posture A/B/C safe |
| **T4** | Local LLM inference | Ollama + Llama 3.3 70B — Cat 4 only, runs within carrier VPC, no external API | Yes | 24–48 GB VRAM | Posture B/C safe |
| **T5** | External LLM API | Groq, OpenAI — current primary approach; fast and capable but external | Yes | None | **Posture A only** — prohibited for PHI under posture B/C |

*T2.5 (Granite-Docling) uses a vision encoder, not an autoregressive language model. It does not generate text probabilistically — it performs structured document conversion with location-based grounding. Client framing: "intelligent OCR, not a language model."

### Data Posture Classification

| Posture | Description | Permitted Tiers |
|---------|-------------|----------------|
| **A** — Cloud-permissive | No PHI in documents, or carrier has signed data processing agreements with API vendors | T0 through T5 |
| **B** — Carrier cloud only | PHI/PII present; carrier requires data stays within their cloud tenant (AWS/Azure/GCP) | T0, T1, T2, T2.5, T4 only — T5 prohibited |
| **C** — Air-gapped | Sensitive documents that must never leave on-premises infrastructure | T0, T1, T2, T2.5, T4 only — T5 prohibited |

**AMICA is almost certainly Posture B** — police reports and IA reports contain PII (DL#, DOB, SSN fragments). T5 is off-limits for production processing of UC2/UC3 at AMICA.

---

## Tool Evaluation — Go / No-Go Decisions

### Approved Tools

| Tool | Tier | License | Decision | Reason |
|------|------|---------|----------|--------|
| **pdfplumber** | T0 | MIT | GO | Already in production; digital PDF text + table extraction |
| **PyMuPDF** | T0 | AGPL 2.0 | GO | Already in production; faster than pdfplumber for page extraction |
| **Tesseract 5.x** | T1 | Apache 2.0 | GO | Already in production; CPU-only, strong on printed text |
| **PaddleOCR v4** | T1 | Apache 2.0 | GO | Best open-source table structure; GPU accelerated; bounding boxes |
| **spaCy** | T2 | MIT | GO | Custom NER for Cat 2; fast CPU inference; requires labeled training data (500–2K examples) |
| **Compiled regex** | T2 | N/A | GO | Cat 1 extraction; zero cost, zero variance, zero hallucination by definition |
| **IBM Granite-Docling-258M** | T2.5 | Apache 2.0 | GO | 258M params; table TEDS 0.97; bounding box grounding; purpose-built for document conversion; not a general LLM |
| **Ollama + Llama 3.3 70B** | T4 | MIT | GO | Cat 4 only (subrogation, red flags); runs in carrier VPC; no external API |

### Rejected Tools

| Tool | Reason |
|------|--------|
| **GOT-OCR 2.0** | Data license is CC BY-NC 4.0 — prohibits commercial use. Model code is Apache 2.0 but was trained on CC BY-NC data. Commercial risk unacceptable for insurance use without legal clearance. |
| **Nanonets-OCR-s** | License unverified as of benchmark date. Do not use until license confirmed as commercially permissible. |
| **Unstract** | AGPL-3.0 license creates commercial distribution problem. LLMWhisperer is their preprocessing layer but the orchestration platform can't be commercially deployed without a commercial license. |
| **LangExtract (Google)** | Gemini-native, external API dependency. Solves grounding (CharInterval) but doesn't solve data sovereignty for PHI posture B/C. Use the grounding pattern, not the tool. |
| **Qwen2.5-VL (full)** | Mixed license with restrictions; heavy VRAM requirements. Wait for Apache 2.0 clarification. |

---

## Current ElevateNow Stack Audit

### The Universal Pattern (Critical Finding)

**Across every production ElevateNow extraction component, the pattern is identical: T0/T1 → T5 (external LLM). No T2 extraction layer exists anywhere in production.**

| Component | Tiers Used | Group 5 (Audit) Status |
|-----------|-----------|----------------------|
| AutoFNOLExtractor (all LOBs) | T0 (pdfplumber) + T5 (Groq llama-3.3-70b) | ✗ 0% grounding, non-zero hallucination, non-deterministic, external API |
| CurationStudio Pipeline | T0 (PyMuPDF) + T1 (pytesseract, OpenCV-enhanced) + T5 | ✗ 0% grounding, OpenCV preprocessing is above-average T1 but feeds T5 |
| ACORDFormPreprocessor | T1 (pytesseract.image_to_data with bounding boxes) + T5 | ⚠ Bboxes computed via `pytesseract.Output.DICT` but discarded — free grounding evidence thrown away |
| DocumentExtractionTool | T0 + T5 (LLM multi-pass with retry) | ✗ 0% grounding |
| LangExtract POC | T5 + CharInterval grounding | ✓ Grounding fixed / ✗ External API remains / ✗ POC only, not production |
| GKR (Knowledge Retrieval) | Deterministic chunk lookup — NOT an extraction system | ✓ Fully governed — GKR consumes already-extracted fields |

### Key Individual Findings

**Missed grounding opportunity in ACORDFormPreprocessor:**
`pytesseract.image_to_data(img, output_type=Output.DICT)` returns `left`, `top`, `width`, `height` per word — word-level bounding boxes are computed but immediately discarded. This is free provenance evidence that could become Group 5 grounding with a one-week refactor.

**OpenCV preprocessing is above-average T1:**
`kcs_cv_preprocessor.py` implements: deskew (Hough transform), CLAHE contrast enhancement, Gaussian denoising, Otsu binarization, and table line removal. This is a meaningful competitive advantage on degraded scans but its value is entirely squandered when the output feeds an ungrounded T5 call.

**GKR is not in the extraction stack:**
GKR evaluates rules against already-extracted fields (`{ sic, naics, state, coverages }`). It does not perform document extraction. The correct framing for prospects: "GKR is already deterministic and zero-LLM. We're extending that same architecture philosophy to the extraction layer."

---

## Gap Analysis

### Gap 1 (BLOCKING): No T2 Extraction Layer

**What's missing:** Compiled regex patterns for Cat 1 fields, spaCy NER for Cat 2 categoricals, section boundary detection for Cat 3 narrative capture.

**Impact:** Every Cat 1 field (dates, amounts, policy numbers, VINs, ICD-10 codes) is currently routed through T5 LLM — introducing hallucination risk, run variance, data sovereignty risk, and cost for fields that have deterministic solutions.

**Fix:** Build T2 regex library and spaCy NER for the top 20-30 Cat 1 fields per LOB (police report, IA report, ACORD forms). 2-3 weeks. Zero infrastructure cost.

### Gap 2 (HIGH): No Data Sovereignty Path for PHI Documents

**What's missing:** Any T4 local LLM capability for Cat 4 fields. T5 is the only LLM path and it routes PHI to external APIs.

**Impact:** Cannot accept AMICA UC2/UC3 in production without violating carrier data sovereignty requirements. T5 is off-limits for police reports and IA reports under Posture B.

**Fix:** Deploy Ollama + Llama 3.3 70B in carrier VPC. Scope to Cat 4 only (subrogation indicators, red flags). A T2 trigger pre-filter limits T4 invocations to ≤20% of IA reports (only reports containing subrogation trigger keywords).

### Gap 3 (MEDIUM): No Production Grounding

**What's missing:** Field-level provenance — character offset or bounding box per extracted value.

**Impact:** Zero audit defensibility. Regulator asks "where did this value come from?" and the answer is "the LLM said so." This is currently a non-starter for regulated extractions.

**Fix (Part A):** Retain Tesseract bboxes already computed in ACORDFormPreprocessor — 1 week, zero new libraries.
**Fix (Part B):** Apply LangExtract grounding pattern (CharInterval) to existing T5 calls — 1-2 week refactor.

---

## Build Roadmap

Ordered by impact × implementation speed. Each item must be completed before the next is built.

### P0 — Build T2 Extraction Layer (2–3 weeks, zero infra cost)

**What to build:**
- Compiled regex patterns for the top 25 Cat 1 fields per LOB:
  - Dates (8 format variants), dollar amounts, policy numbers, claim numbers, VIN, license plate, DOB, DL#, SSN (masked), ICD-10, SIC/NAICS, zip code, phone number, state codes
- spaCy custom NER pipeline for top Cat 2 categoricals (body part, cause of loss, accident type)
- Section boundary detection for Cat 3 narrative capture (injury description, officer narrative)

**Benchmark goal for P0:** F1 ≥ 0.92 on Cat 1 fields, run variance = 0.00, hallucination rate = 0.00, grounding rate = 100% (every value has source char offset).

**The AMICA play:** For UC1 (FNOL form data) and UC2 (police reports), P0 alone achieves the "non-LLM" positioning. UC3 (IA reports) needs P0 + P2 for Cat 1-3, and P2/P3 for subrogation.

### P1a — Attach Grounding to Existing T5 Calls (1–2 weeks)

Apply the LangExtract CharInterval grounding pattern to all production T5 extraction calls. Every LLM-extracted field gets a character interval citation pointing to its source span in the document. This does NOT fix the sovereignty gap but fixes the audit gap for Posture A documents.

### P1b — Retain Tesseract Bounding Boxes (1 week)

In ACORDFormPreprocessor (and anywhere else Tesseract is called), retain the word-level bounding boxes returned by `pytesseract.image_to_data(output_type=Output.DICT)`. Store `left`, `top`, `width`, `height` per extracted word. These become the grounding evidence for T1-extracted fields.

### P2 — Evaluate Granite-Docling-258M (3–4 weeks, 8 GB VRAM)

Stand up a GPU inference instance with IBM Granite-Docling-258M. Benchmark against Tesseract on:
- Table extraction (TEDS score, column/row precision) from scanned IA reports and loss run tables
- DPI degradation curve: compare Granite (<10% CER increase 300→150 DPI expected) vs. Tesseract (25-30% expected)
- Bounding box grounding rate (Granite produces bounding boxes natively)

**Go decision:** If Granite achieves Table TEDS ≥ 0.90 on AMICA-class documents, deploy to replace Tesseract for structured table extraction. Break-even at AMICA volume: 14-18 months on GPU hardware.

### P3 — Deploy T4 Local LLM for Cat 4 (4–6 weeks, 24–48 GB VRAM)

Deploy Ollama + Llama 3.3 70B in carrier VPC (AWS or on-premises depending on posture).

**Scope:** Cat 4 only — subrogation indicators, employer defense screening, red flag synthesis. A T2 trigger pre-filter (keyword detection on IA report text) limits T4 invocations to ≤20% of IA reports. This keeps the compute cost proportional.

**Benchmark goal for P3:** T4 matches T5 on F1 ≥ 0.80 for subrogation indicators; latency ≤ 30 seconds per IA report.

---

## Economic Model (AMICA Volumes)

AMICA annual volume: ~79,908 documents (2,300/mo UC1 + 32,000/yr UC2 + 20,300/yr UC3 + overhead).

| Configuration | Estimated Annual Cost |
|--------------|----------------------|
| T0 + T2 only (P0 completed) | ~$12–24/year (storage + compute only) |
| Add T2.5 Granite-Docling | +~$105/year amortized GPU cost |
| Add T4 Ollama (subrogation only, ≤20% of IA reports) | +$41–$108/year |
| **Total: Full non-LLM stack (T0+T2+T2.5+T4)** | **~$158–$237/year** |
| T5 equivalent (current approach, all docs) | $2,400–$6,384/year |

**GPU hardware break-even:**
- T2.5 (8 GB GPU): 14–18 months at AMICA volume
- T4 (24–48 GB GPU): Justified by combination of data sovereignty requirement + Cat 4 use

**The sales argument for AMICA (and any Posture B client):**
The cost of T5 for PHI documents is not $0.05/doc × 79,908 = $4K/year. The cost is **regulatory non-compliance** — T5 is off the table for Posture B regardless of price. The choice is: build the non-LLM stack ($158-237/year) or don't process PHI documents at all.

---

## Benchmark Execution Plan (Three Phases)

### Phase 1 — Cat 1 Regex vs. LLM
- **Documents:** FNOL forms (UC1) + police report sample (UC2 subset)
- **Hypothesis:** T2 regex achieves Field-level EM ≥ 0.92, run variance = 0.00, hallucination = 0.00 — outperforms T5 on every Group 5 metric
- **Measurement:** Run 50 documents through T2 regex, same 50 through T5 (Groq). Compare on all 5 benchmark groups.

### Phase 2 — T2.5 vs. T1 on Scanned Table Quality
- **Documents:** Scanned IA reports + loss run tables at 300/200/150 DPI
- **Hypothesis:** Granite-Docling Table TEDS ≥ 0.90 vs. Tesseract Table TEDS ~0.70; Granite DPI degradation < 10% vs. Tesseract 25-30%
- **Measurement:** Same 30 scanned documents at 3 DPI levels. Table TEDS, CER, grounding rate.

### Phase 3 — T4 (Local LLM) vs. T5 on Subrogation
- **Documents:** IA reports with known subrogation indicators
- **Hypothesis:** T4 (Ollama Llama 3.3 70B) matches T5 (Groq) on F1 for subrogation indicator detection, with zero external API dependency
- **Measurement:** 30 IA reports with ground-truth subrogation labels. F1, latency, cost per report.

---

## Competitive Position vs. ROOT (Specific to AMICA)

| Dimension | ROOT (assumed LLM-first) | ElevateNow (target state after P0) |
|-----------|--------------------------|-------------------------------------|
| Extraction approach | Full LLM pipeline | T2 regex for 80%+ of Cat 1-3 fields; LLM only for Cat 4 |
| Per-document cost | LLM API call every document | Near-zero for Cat 1-3; LLM only for Cat 4 (~20% of IA reports) |
| Data sovereignty | PHI/PII to external LLM API (Posture B violation) | All processing within customer infrastructure |
| Audit trail | "The model said so" | Every Cat 1-3 value traces to char offset or bounding box |
| Run variance | Non-zero (probabilistic sampling) | Zero for Cat 1-3 (deterministic) |
| Human escalation | Unclear | Built-in: low-confidence fields surface to handler |

**The decisive argument:** For AMICA (Posture B), ROOT's full LLM pipeline is not a viable option for police reports and IA reports. It is structurally prohibited by data sovereignty requirements. The competition is not "better LLM" vs. "cheaper LLM" — it is "runs inside your infrastructure" vs. "doesn't."
