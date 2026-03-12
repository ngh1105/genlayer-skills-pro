---
name: genvm-lint
description: Validate GenLayer intelligent contracts with the GenVM linter. Use when user asks to lint, validate, or check a contract.
---

# GenVM Lint

Validate intelligent contracts for safety, correctness, and SDK compliance before running tests.

## Setup

```bash
pip install genvm-linter
```

## Recommended Workflow

**Always lint before testing.** Run after writing or modifying any contract.

```bash
# Run both lint + validate in one pass (recommended)
genvm-lint check contracts/my_contract.py

# Machine-readable output for AI parsing
genvm-lint check contracts/my_contract.py --json
```

## Commands

### `check` — Full validation (recommended)
```bash
genvm-lint check contracts/my_contract.py
genvm-lint check contracts/my_contract.py --json
```
Runs both `lint` and `validate` in one pass. Start here.

### `lint` — Fast AST checks (~50ms)
```bash
genvm-lint lint contracts/my_contract.py
```
Catches:
- Forbidden imports (`os`, `sys`, `subprocess`, `random`)
- Non-deterministic patterns (bare `float` usage)
- Contract header structure issues

### `validate` — SDK semantic checks (~200ms)
```bash
genvm-lint validate contracts/my_contract.py
```
Validates:
- Types exist in SDK (`TreeMap`, `DynArray`, `Address`, etc.)
- Decorators correctly applied (`@gl.public.view`, `@gl.public.write`)
- Storage fields have valid types (no bare `dict` / `list`)
- Method signatures are correct

### `schema` — Extract ABI
```bash
genvm-lint schema contracts/my_contract.py
genvm-lint schema contracts/my_contract.py --json
genvm-lint schema contracts/my_contract.py --output abi.json
```

### `typecheck` — Static type analysis (Pyright)
```bash
genvm-lint typecheck contracts/my_contract.py
genvm-lint typecheck contracts/my_contract.py --strict
```

### `download` — Pre-download GenVM artifacts
```bash
genvm-lint download                    # Latest
genvm-lint download --version v0.2.12  # Specific version
genvm-lint download --list             # Show cached versions
```

## Output Formats

### Human-readable (default)
```
✓ Lint passed (3 checks)
✓ Validation passed
  Contract: MyContract
  Methods: 8 (5 view, 3 write)
```

### JSON (`--json`)
```json
{
  "ok": true,
  "lint": { "ok": true, "passed": 3 },
  "validate": {
    "ok": true,
    "contract": "MyContract",
    "methods": 8,
    "view_methods": 5,
    "write_methods": 3,
    "ctor_params": 2
  }
}
```

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | All checks passed |
| `1` | Lint or validation errors found |
| `2` | Contract file not found |
| `3` | SDK download failed |

## Iterative Fix Workflow (for AI assistants)

When fixing errors iteratively:

```bash
# Step 1: Get JSON output for parsing
genvm-lint check contracts/my_contract.py --json

# Step 2: Parse "errors" array for specific issues
# Step 3: Fix each error in the contract
# Step 4: Re-run check
# Repeat until "ok": true
```

## Common Errors and Fixes

| Error | Fix |
|---|---|
| `Forbidden import: os` | Remove `import os`, use gl SDK instead |
| `Forbidden import: random` | Use `gl.nondet` for randomness |
| `Non-deterministic: float` | Use `u256` or string for storage |
| `Invalid storage type: dict` | Replace with `TreeMap[K, V]` |
| `Invalid storage type: list` | Replace with `DynArray[T]` |
| `Missing decorator` | Add `@gl.public.view` or `@gl.public.write` |
| `Unknown SDK type: X` | Check type spelling, import from `genlayer` |

## Next Steps After Clean Lint

→ Run fast unit tests: see `skills/direct-tests/SKILL.md`
