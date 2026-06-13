---
name: data-analysis
description: "Structured scientific data analysis with pandas, reproducible notebooks, statistical reporting, and figure generation."
version: 1.0.0
author: Nautilus Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Science, Data, Analysis, Pandas, Statistics, Visualization]
    related_skills: [protocol-automation, literature-review]
---

# Data Analysis

Perform structured scientific data analysis: load data from CSV/Excel/JSON, clean and transform with pandas, run descriptive statistics, fit models, generate publication-ready figures, and export reproducible notebooks.

## When to Use

- After collecting experimental data and need analysis + figures
- Re-analyzing published data (supplementary tables, GitHub repos)
- Preparing a paper's Results section with statistics and plots
- Teaching data analysis workflows

## Quick Reference

| Action | Command |
|--------|---------|
| Load CSV | `pandas.read_csv("data.csv")` |
| Summary stats | `df.describe()` |
| Group-by | `df.groupby("condition").agg({"value": ["mean", "std", "count"]})` |
| Correlation | `df[["x", "y"]].corr()` |
| T-test / ANOVA | `scipy.stats.ttest_ind` / `scipy.stats.f_oneway` |
| Plot | `matplotlib.pyplot` or `seaborn` |
| Save figure | `plt.savefig("figure.png", dpi=300, bbox_inches="tight")` |
| Export notebook | `nbformat` or `jupytext` |

## Procedure

### 1. Load and Inspect

```python
import pandas as pd
import numpy as np

df = pd.read_csv("data.csv")
print(df.shape)
print(df.dtypes)
print(df.head())
print(df.isnull().sum())
```

Document data provenance at the top of the notebook/script:

```markdown
## Data Provenance
- Source: <lab notebook / paper supplementary / public dataset URL>
- Collected: YYYY-MM-DD
- N = <count>
- Conditions: <list>
```

### 2. Clean and Transform

Common operations:

```python
# Drop missing
df = df.dropna(subset=["value"])

# Convert types
df["date"] = pd.to_datetime(df["date"])

# Create derived columns
df["normalized"] = df["raw"] / df["control"]

# Filter outliers (IQR method)
Q1 = df["value"].quantile(0.25)
Q3 = df["value"].quantile(0.75)
IQR = Q3 - Q1
df = df[(df["value"] >= Q1 - 1.5*IQR) & (df["value"] <= Q3 + 1.5*IQR)]
```

### 3. Descriptive Statistics

```python
summary = df.groupby("condition").agg(
    mean=("value", "mean"),
    std=("value", "std"),
    n=("value", "count"),
    sem=("value", lambda x: x.std() / np.sqrt(len(x)))
).reset_index()
print(summary)
```

### 4. Inferential Statistics

```python
from scipy import stats

# Two-sample t-test (independent)
group_a = df[df["condition"] == "A"]["value"]
group_b = df[df["condition"] == "B"]["value"]
t_stat, p_value = stats.ttest_ind(group_a, group_b)
print(f"t = {t_stat:.3f}, p = {p_value:.4f}")

# One-way ANOVA
groups = [g["value"].values for _, g in df.groupby("condition")]
f_stat, p_value = stats.f_oneway(*groups)
print(f"F = {f_stat:.3f}, p = {p_value:.4f}")

# Effect size (Cohen's d)
def cohens_d(a, b):
    pooled_std = np.sqrt(((len(a)-1)*a.std()**2 + (len(b)-1)*b.std()**2) / (len(a)+len(b)-2))
    return (a.mean() - b.mean()) / pooled_std

print(f"Cohen's d = {cohens_d(group_a, group_b):.3f}")
```

### 5. Visualization

Standard scientific figures:

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Boxplot with individual points
plt.figure(figsize=(6,4))
sns.boxplot(data=df, x="condition", y="value")
sns.stripplot(data=df, x="condition", y="value", color="black", alpha=0.3)
plt.ylabel("Measurement (units)")
plt.xlabel("Condition")
plt.title("Effect of Condition on Measurement")
plt.tight_layout()
plt.savefig("figure_boxplot.png", dpi=300, bbox_inches="tight")
```

Heatmap for correlation matrices:

```python
plt.figure(figsize=(8,6))
sns.heatmap(df.corr(numeric_only=True), annot=True, fmt=".2f", cmap="RdBu_r", vmin=-1, vmax=1)
plt.tight_layout()
plt.savefig("figure_correlation.png", dpi=300, bbox_inches="tight")
```

### 6. Reproducible Export

Save the analysis as a dated notebook or script:

```bash
mkdir -p analyses/
# Save notebook as .ipynb or .py
```

Generate a reproducibility checklist:

```markdown
## Reproducibility Checklist
- [ ] Raw data: `data/raw_YYYY-MM-DD.csv`
- [ ] Cleaning script: `scripts/clean_data.py`
- [ ] Analysis script: `scripts/analyze.py`
- [ ] Figure outputs: `figures/`
- [ ] Environment: `requirements-analysis.txt`
- [ ] Random seed set: `np.random.seed(42)`
- [ ] All statistics reported with units and precision
```

## Pitfalls

- **P-hacking.** Avoid cherry-picking conditions after seeing data. Pre-register hypotheses when possible.
- **Small sample sizes.** t-tests assume normality; use Mann-Whitney U for n < 30 and skewed data.
- **Multiple comparisons.** Bonferroni or FDR correction if running many tests.
- **Figure resolution.** Journals require 300 dpi minimum. Use `dpi=300` in `savefig`.
- **Colorblind palettes.** Use `colorblind` palette in seaborn; avoid red-green combos.

## Verification

- All statistics have units and sample sizes reported.
- Figures are 300 dpi and follow journal guidelines.
- Data provenance is documented (source, date, conditions).
- Analysis script runs end-to-end without errors on a clean environment.
- Results are discussed in context (biological/physical significance, not just p-values).

## Related Skills

- `protocol-automation` — to capture the experimental protocol that produced the data.
- `literature-review` — to compare results with published benchmarks.
