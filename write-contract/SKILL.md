---
name: write-contract
description: Write GenLayer intelligent contracts following best practices. Use when user asks to create, write, or modify a GenLayer contract.
---

# Write Contract

Write GenLayer intelligent contracts (Python-based smart contracts with AI capabilities).

## Contract Structure

```python
# Standard imports — always include these
from genlayer import *

# Contract class must inherit from gl.Contract
class MyContract(gl.Contract):
    # Storage fields — typed, persistent on-chain
    field_name: str
    counter: u256
    owner: Address

    # Constructor — runs once at deploy time
    def __init__(self, initial_value: str) -> None:
        self.field_name = initial_value
        self.owner = gl.message.sender_address

    # Read-only method — free to call, no state change
    @gl.public.view
    def get_value(self) -> str:
        return self.field_name

    # State-changing method — costs gas, modifies storage
    @gl.public.write
    def set_value(self, new_value: str) -> None:
        self.field_name = new_value
```

## Storage Types

Use GenLayer SDK types, **not** bare Python types, for storage fields:

| Use this | NOT this | Notes |
|---|---|---|
| `str` | ✅ OK | Strings are fine |
| `u256`, `u8`, `i256` | `int` | Use SDK integer types |
| `bool` | ✅ OK | Booleans are fine |
| `Address` | `str` | For Ethereum addresses |
| `DynArray[T]` | `list` | Dynamic array |
| `TreeMap[K, V]` | `dict` | Key-value map |

> **Critical**: Never use bare `dict` or `list` in storage. Use `TreeMap` and `DynArray` instead.

## Decorators

| Decorator | Use when |
|---|---|
| `@gl.public.view` | Reading state, no side effects |
| `@gl.public.write` | Modifying state |

## LLM Integration

For methods requiring AI reasoning:

Example storage field:

```python
last_sentiment: str
```

```python
@gl.public.write
def analyze_sentiment(self, text: str) -> None:
    def classify_sentiment() -> str:
        return gl.nondet.exec_prompt(f"""
            Analyze the sentiment of this text: "{text}"
            Respond with only: positive, negative, or neutral
        """)

    final = gl.eq_principle.prompt_non_comparative(
        classify_sentiment,
        task="Classify the text sentiment as positive, negative, or neutral.",
        criteria="The result must be exactly one of: positive, negative, neutral.",
    )
    self.last_sentiment = final
```

## Web Data Access

Fetch real-time data from the internet:

Example storage field:

```python
prices: TreeMap[str, str]
```

```python
@gl.public.write
def fetch_price(self, token: str) -> None:
    def fetch_and_extract_price() -> str:
        response = gl.nondet.web.get(
            f"https://api.coingecko.com/api/v3/simple/price?ids={token}&vs_currencies=usd"
        )
        return gl.nondet.exec_prompt(
            f"Extract the USD price of {token} from this JSON: {response.text}. Return only the number."
        )

    price_str = gl.eq_principle.prompt_non_comparative(
        fetch_and_extract_price,
        task=f"Fetch the USD price for {token} and extract only the numeric value.",
        criteria="The result must be a valid USD price number.",
    )
    self.prices[token] = price_str
```

## Equivalence Principle

The equivalence principle allows validators to reach consensus on non-deterministic outputs:

```python
# Non-comparative: each validator independently checks its own result
def generate_summary() -> str:
    return gl.nondet.exec_prompt("Summarize the current market news in one sentence.")

gl.eq_principle.prompt_non_comparative(
    generate_summary,
    task="Summarize the current market news in one sentence.",
    criteria="The summary must be concise and must not include unsupported claims.",
)

# Comparative: validators compare their results against the leader's
def fetch_exchange_rate() -> str:
    response = gl.nondet.web.get("https://api.example.com/rate")
    return gl.nondet.exec_prompt(
        f"Extract the exchange rate from this response: {response.text}. Return only the number."
    )

gl.eq_principle.prompt_comparative(
    fetch_exchange_rate,
    principle="The numeric exchange rate must match the leader's result.",
)
```

## Message Context

```python
gl.message.sender_address   # Address of the immediate caller
gl.message.value            # Native token sent with transaction
gl.message.contract_address # This contract's address
```

## Access Control Pattern

```python
@gl.public.write
def admin_only_action(self) -> None:
    if gl.message.sender_address != self.owner:
        raise Exception("Only owner can call this")
    # ... proceed
```

## Full Example: Simple Storage Contract

```python
from genlayer import *

class SimpleStorage(gl.Contract):
    stored_value: str
    owner: Address

    def __init__(self, initial: str) -> None:
        self.stored_value = initial
        self.owner = gl.message.sender_address

    @gl.public.view
    def get(self) -> str:
        return self.stored_value

    @gl.public.write
    def set(self, value: str) -> None:
        if gl.message.sender_address != self.owner:
            raise Exception("Not authorized")
        self.stored_value = value
```

## Anti-Patterns to Avoid

| ❌ Don't do this | ✅ Do this instead |
|---|---|
| `import os`, `import sys` | No system imports |
| `import random` | Use `gl.nondet` for randomness |
| `list` in storage | `DynArray[T]` |
| `dict` in storage | `TreeMap[K, V]` |
| `float` in storage | `u256` or string representation |
| Bare `int` in storage | `u256`, `i256`, etc. |
| LLM call without eq_principle | Always wrap with equivalence principle |

## Lint-Clean Demo Contract

Use this minimal contract to verify the installed authoring workflow produces a lint-clean contract:

```python
# { "Depends": "py-genlayer:test" }
from genlayer import *

class Notes(gl.Contract):
    notes: TreeMap[Address, str]

    def __init__(self) -> None:
        self.notes = TreeMap()

    @gl.public.write
    def set_note(self, note: str) -> None:
        self.notes[gl.message.sender_address] = note

    @gl.public.view
    def get_note(self, owner: Address) -> str:
        return self.notes.get(owner, "")
```

Save it as `contracts/notes.py`, then run:

```bash
genvm-lint check contracts/notes.py
```

Expected result: the command completes without lint errors.

## Workflow

1. Write contract → `skills/write-contract/SKILL.md` (this file)
2. Lint → `skills/genvm-lint/SKILL.md`
3. Test (fast) → `skills/direct-tests/SKILL.md`
4. Test (full) → `skills/integration-tests/SKILL.md`
