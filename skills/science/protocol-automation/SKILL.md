---
name: protocol-automation
description: "Automate laboratory protocols from academic papers. Extract methods, convert to step-wise instructions, and generate reproducible lab notebooks."
version: 1.0.0
author: Nautilus Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Science, Protocol, Lab, Reproducibility, Methods]
    related_skills: [arxiv, data-analysis]
---

# Protocol Automation

Convert scientific methods from papers into actionable, step-by-step lab protocols and generate reproducible Jupyter notebooks or markdown lab notebooks.

## When to Use

- After finding a paper with an experimental protocol you want to replicate
- Preparing a Methods section for a manuscript
- Teaching a lab course and need clean, numbered steps
- Need to version-control a wet-lab protocol alongside code

## Quick Reference

| Action | Command |
|--------|---------|
| Parse arXiv paper method | `web_extract(urls=["https://arxiv.org/pdf/ID"])` then apply this skill |
| Generate step list | Follow the Procedure below |
| Create Jupyter template | Save as `.ipynb` with the generated structure |
| Version protocol | Commit protocol markdown to git with parameters frontmatter |

## Procedure

### 1. Extract Methods Section

- Use `web_extract` on the paper PDF or HTML.
- Copy-paste the Methods section into a scratchpad, or use `read_file` if already saved locally.

### 2. Structure the Protocol

Break the extracted text into a standard protocol format:

```markdown
---
protocol: "Protocol Name"
source: "arXiv:2402.03300 (or DOI)"
date_extracted: "YYYY-MM-DD"
author: "Original Paper Authors"
reagents: ["Reagent A (catalog #)", "Reagent B (catalog #)"]
equipment: ["Centrifuge (model)", "Spectrophotometer (model)"]
---

# Protocol: <Name>

## Objective
One-sentence goal.

## Reagents and Materials
- Reagent A — concentration, vendor, catalog number
- Reagent B — concentration, vendor, catalog number
- Buffer recipe if custom

## Equipment
- Equipment name (model, settings)

## Safety Notes
- Any hazards, PPE, waste disposal.

## Procedure

### Step 1: <Title>
**Action:** What to do.
**Parameters:** Time, temperature, speed, volume.
**Tips:** Common failure points.

### Step 2: <Title>
...repeat...

## Expected Results
- Yield, purity, appearance.
- QC checkpoints.

## Troubleshooting
| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Low yield | Wrong pH | Recalibrate pH meter |

## Data Recording
- Suggest a CSV or spreadsheet template for recording runs.
```

### 3. Generate Jupyter Notebook Skeleton (optional)

Generate a `.ipynb` with:

- Markdown cell: Protocol header (reagents, objective).
- Code cell: Parameter definitions (constants for concentrations, volumes).
- Code cell: Empty data-recording DataFrame template.
- Markdown cell: Step checklist with checkboxes.
- Code cell: Analysis stub (e.g., plot yield vs. condition).

Use `execute_code` to generate the JSON structure:

```python
import json, pathlib

notebook = {
    "cells": [
        {"cell_type": "markdown", "metadata": {}, "source": ["# Protocol: ..."]},
        {"cell_type": "code", "metadata": {}, "source": ["# Parameters\nCONC_X = 0.1  # M\n"]}
    ],
    "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}},
    "nbformat": 4, "nbformat_minor": 4
}
pathlib.Path("protocol.ipynb").write_text(json.dumps(notebook, indent=2))
```

### 4. Version Control

Save the protocol as a markdown file in a `protocols/` directory inside the project repo. Commit with a message referencing the source paper:

```bash
git add protocols/2024-01-15_GRPO-expression.md
git commit -m "protocol: add GRPO expression protocol from arXiv:2402.03300"
```

## Pitfalls

- **Methods are incomplete.** Papers often omit "obvious" steps (e.g., "cells were washed" but not with what). Flag missing parameters explicitly.
- **Unit inconsistencies.** Watch for mg/mL vs. g/L, °C vs. K.
- **Vendor-specific reagents.** Catalog numbers change; include descriptive specs.
- **Protocol drift.** If adapting the protocol, version it (`protocol_v2.md`) rather than overwriting.

## Verification

- The protocol can be read and understood by someone who hasn't read the paper.
- All reagents are listed with concentrations.
- Each step has an estimated duration.
- Safety notes are included for hazardous reagents.

## Related Skills

- `arxiv` — to find and read source papers.
- `data-analysis` — to analyze results from protocol runs.
