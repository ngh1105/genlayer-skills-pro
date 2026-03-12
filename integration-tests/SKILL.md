---
name: integration-tests
description: Write and run integration tests against a real GenLayer environment (GLSim, Studio, testnet). Use when user asks to write integration tests or run tests with full consensus.
---

# Integration Tests

Run contracts against a real GenLayer environment with full leader + validator consensus validation.
Use after direct mode tests pass, before deploying to testnet.

## Setup

```bash
# Lightweight simulator (recommended for CI and fast iteration)
pip install genlayer-test[sim]

# Or full Studio (Docker required)
genlayer up
```

## Running Tests

```bash
# Against default network (from gltest.config.yaml)
gltest tests/integration/ -v -s

# Against specific network
gltest tests/integration/ -v -s --network localnet
gltest tests/integration/ -v -s --network studionet
gltest tests/integration/ -v -s --network testnet_bradbury

# Single test during development
gltest tests/integration/test_file.py::test_specific -v -s
```

Always use `-v -s` to see output during development.

## Basic Test Pattern

```python
from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded

def test_full_flow():
    # Deploy the contract
    factory = get_contract_factory("MyContract")
    contract = factory.deploy(args=[])

    # Write methods — submit transaction, wait for consensus
    tx_receipt = contract.set_data(args=["hello"]).transact()
    assert tx_execution_succeeded(tx_receipt)

    # Read methods — call directly, no transaction
    result = contract.get_data(args=[contract.address]).call()
    assert result == "hello"
```

## Key Differences vs Direct Mode

| | Direct Mode | Integration Tests |
|---|---|---|
| Speed | ~30ms | Seconds to minutes |
| Server required | No | Yes |
| Consensus | Leader only | Full (leader + validators) |
| Write methods | Return values | Return `tx_receipt` |
| Read methods | Return values | Use `.call()` |
| Web/LLM mocking | `mock_web()` / `mock_llm()` | Real calls |

## Write vs Read Calls

```python
# Write method — state-changing
tx_receipt = contract.create_item(args=["item_1", "description"]).transact()
assert tx_execution_succeeded(tx_receipt)

# Read method — view only
item = contract.get_item(args=["item_1"]).call()
assert item["status"] == "active"
```

## Configuration (`gltest.config.yaml`)

```yaml
contract_path: contracts/

networks:
  localnet:
    # GenLayer Studio running locally on port 4000

  studionet:
    # studio.genlayer.com — hosted, no setup

  testnet_bradbury:
    accounts:
      - "${ACCOUNT_PRIVATE_KEY_1}"
      - "${ACCOUNT_PRIVATE_KEY_2}"
```

## Test Markers

```python
import pytest

@pytest.mark.slow
def test_expensive_operation():
    """Excluded by default. Run with: gltest -m slow"""
    pass
```

## Available Environments

| Environment | Command | Notes |
|---|---|---|
| **GLSim** | `glsim --port 4000 --validators 5` | Lightweight, no Docker, ~1s startup. Runs Python natively. Best for fast iteration. |
| **Studio local** | `genlayer up` | Full GenVM, Docker required. Validates runtime compatibility. |
| **Studio cloud** | Use `--network studionet` | Hosted, no setup, rate-limited. |
| **Testnet Bradbury** | Use `--network testnet_bradbury` | Real network, requires funded accounts. |

## When to Use Integration Tests

- Validating consensus (leaders + validators agree)
- Testing real web requests and LLM calls (no mocks)
- Pre-deployment smoke tests
- Verifying contract runs correctly in actual GenVM (not just Python runner)

> **Rule of thumb**: Direct mode should cover all logic testing. Use integration tests only for final validation before deploying.

## Test Organization

```
tests/
├── direct/           # Fast in-memory tests (no server)
│   ├── conftest.py
│   └── test_*.py
└── integration/      # Full consensus tests (server required)
    ├── conftest.py
    └── test_*.py
```

## Common Issues

### "Transaction not found" errors
```bash
rm -rf .gltest_cache
```

### Test timing out
Increase timeout in `gltest.config.yaml` or run single test to isolate:
```bash
gltest tests/integration/test_file.py::test_specific -v -s
```

### JSON serialization errors
When working with mock validators, convert objects to dicts:
```python
transaction_context = {"validators": [v.to_dict() for v in mock_validators]}
```

### Contract deploy fails
1. Check lint: `genvm-lint check contracts/my_contract.py`
2. Check direct tests pass first
3. Verify environment is running: `glsim --port 4000 --validators 5`
