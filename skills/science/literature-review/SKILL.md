---
name: literature-review
description: "Systematic literature review automation. Search sources, deduplicate, extract key findings, and synthesize review tables."
version: 1.0.0
author: Nautilus Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Science, Literature, Review, Synthesis, Research]
    related_skills: [arxiv, protocol-automation]
---

# Literature Review

Automate systematic literature review workflows: search across arXiv, Semantic Scholar, PubMed, and bioRxiv; deduplicate results; extract structured metadata; and synthesize findings into markdown review tables.

## When to Use

- Writing a Related Work or Background section for a manuscript
- Entering a new research subfield and need a paper map
- Preparing a seminar or thesis chapter
- Keeping up with a fast-moving field (e.g., "weekly survey")

## Quick Reference

| Action | Command |
|--------|---------|
| Search arXiv | Use `arxiv` skill helper script |
| Search Semantic Scholar | `curl` API (see `arxiv` skill) |
| Search PubMed | `curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=QUERY&retmode=json"` |
| Search bioRxiv | `curl "https://api.biorxiv.org/covid19/0"` (or topic-specific endpoints) |
| Deduplicate | Use script in this skill |
| Extract metadata | Python + regex / json.tool |
| Synthesize table | Markdown generation via script |

## Procedure

### 1. Search Phase

Run searches across multiple engines for the same query. Capture results as JSON.

```bash
mkdir -p review_raw

# arXiv
python skills/research/arxiv/scripts/search_arxiv.py "quantum error correction" --max 20 --sort date > review_raw/arxiv.json

# Semantic Scholar
curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=quantum+error+correction&limit=20&fields=title,authors,year,abstract,citationCount,externalIds" > review_raw/semantic.json

# PubMed
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=quantum+error+correction&retmode=json&retmax=20" > review_raw/pubmed.json
```

### 2. Deduplicate and Merge

Run the deduplication script:

```bash
python skills/science/literature-review/scripts/deduplicate.py review_raw/ arxiv semantic pubmed > review_raw/merged.json
```

A minimal deduplication approach:

```python
import json, pathlib, re

def normalize(title: str) -> str:
    return re.sub(r'\W+', '', title.lower())

seen = {}
for f in pathlib.Path('review_raw').glob('*.json'):
    data = json.loads(f.read_text())
    for item in data.get('results', []):
        key = normalize(item['title'])
        if key not in seen:
            seen[key] = {**item, 'sources': [f.stem]}
        else:
            seen[key]['sources'].append(f.stem)

merged = list(seen.values())
pathlib.Path('review_raw/merged.json').write_text(json.dumps(merged, indent=2))
```

### 3. Extract and Score

For each unique paper, extract:

| Field | Source |
|-------|--------|
| Title | Any source |
| Authors | Any source |
| Year | Any source |
| Venue/Journal | arXiv category or S2 venue |
| Citations | S2 `citationCount` |
| Abstract | Longest available |
| Key claims | Manual / LLM extraction |
| Methods used | Manual / LLM extraction |
| Data availability | PDF scan for "data available" |
| Code availability | PDF scan for GitHub links |

### 4. Synthesize Review Table

Generate a markdown table:

```markdown
| Paper | Year | Venue | Citations | Key Claim | Methods | Code/Data |
|-------|------|-------|-----------|-----------|---------|-----------|
| ... | 2024 | arXiv | 12 | ... | ... | ... |
```

Generate thematic summary sections:

```markdown
## Theme 1: Surface Code Architectures
Papers A, B, C all explore...

## Theme 2: ML-Assisted Decoding
Papers D, E use neural decoders...

## Gaps
- No study compares X and Y under realistic noise.
- Limited experimental validation.
```

### 5. Store and Version

Save the review as `literature-reviews/<topic>/YYYY-MM-DD-<topic>.md`:

```bash
mkdir -p literature-reviews/quantum-error-correction
git add literature-reviews/quantum-error-correction/2024-06-14-survey.md
git commit -m "lit-review: initial survey of quantum error correction landscape"
```

## Pitfalls

- **Result quality varies across APIs.** PubMed is medical-biased; arXiv is physics/CS-biased; S2 covers both but has gaps. Cross-search compensates.
- **Citation counts lag.** Preprints may show 0 citations until published.
- **Abstract quality.** bioRxiv / medRxiv abstracts are sometimes missing or low-quality. Fall back to PDF extraction.
- **Deduplication.** arXiv and S2 often share the same paper but with slightly different titles; fuzzy string matching (`difflib.SequenceMatcher` or `rapidfuzz`) is safer than exact match.

## Verification

- Review table is sortable (each paper has year, venue, citations).
- Themes are backed by specific paper references.
- Gaps are stated as falsifiable claims, not hand-waving.
- Saved as a dated markdown file with source search queries in the header.

## Related Skills

- `arxiv` — core arXiv search and BibTeX.
- `protocol-automation` — to operationalize methods from reviewed papers.
