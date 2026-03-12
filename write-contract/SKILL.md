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
        self.owner = gl.message.sender_account

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

```python
@gl.public.write
def analyze_sentiment(self, text: str) -> None:
    # Call LLM — non-deterministic, runs on all validators
    result = gl.nondet.exec_prompt(f"""
        Analyze the sentiment of this text: "{text}"
        Respond with only: positive, negative, or neutral
    """)

    # Use equivalence principle for consensus
    final = gl.eq_principle.prompt_non_comparative(
        result,
        "Is the sentiment label one of: positive, negative, neutral?",
    )
    self.last_sentiment = final
```

## Web Data Access

Fetch real-time data from the internet:

```python
@gl.public.write
def fetch_price(self, token: str) -> None:
    # Fetch web data — non-deterministic
    response = gl.nondet.web.get(
        f"https://api.coingecko.com/api/v3/simple/price?ids={token}&vs_currencies=usd"
    )

    # Extract with LLM
    price_str = gl.nondet.exec_prompt(
        f"Extract the USD price of {token} from this JSON: {response.text}. Return only the number."
    )

    # Reach consensus with tolerance
    gl.eq_principle.prompt_non_comparative(
        price_str,
        "Is this a valid USD price number?",
    )
    self.price = Price(token=token, usd=float(price_str))
```

## Equivalence Principle

The equivalence principle allows validators to reach consensus on non-deterministic outputs:

```python
# Non-comparative: each validator independently checks its own result
gl.eq_principle.prompt_non_comparative(
    result,                              # The non-deterministic result
    "Is this a valid sentiment label?",  # Validation criteria
)

# Comparative: validators compare their results against the leader's
gl.eq_principle.prompt_comparative(
    result,
    "Do these two results convey the same meaning?",
    tolerance=0.1,                       # 10% tolerance for numeric values
)
```

## Message Context

```python
gl.message.sender_account   # Address of the caller
gl.message.value            # Native token sent with transaction
gl.message.contract_account # This contract's address
```

## Access Control Pattern

```python
@gl.public.write
def admin_only_action(self) -> None:
    if gl.message.sender_account != self.owner:
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
        self.owner = gl.message.sender_account

    @gl.public.view
    def get(self) -> str:
        return self.stored_value

    @gl.public.write
    def set(self, value: str) -> None:
        if gl.message.sender_account != self.owner:
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

## Workflow

1. Write contract → `skills/write-contract/SKILL.md` (this file)
2. Lint → `skills/genvm-lint/SKILL.md`
3. Test (fast) → `skills/direct-tests/SKILL.md`
4. Test (full) → `skills/integration-tests/SKILL.md`
