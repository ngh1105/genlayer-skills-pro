# GenLayer Skills Pro

**GenLayer Skills Pro** (`genlayer-skills-pro`) is a command-line tool and collection of AI-agnostic skills that empowers AI coding assistants (Cursor, Windsurf, Claude Code, GitHub Copilot, Roo Code, etc.) to write, lint, test, and commit Intelligent Contracts for the [GenLayer](https://genlayer.com/) ecosystem.

> **Acknowledgments:** This project is heavily inspired by and adapted from the official [genlayerlabs/skills](https://github.com/genlayerlabs/skills) repository. It takes the excellent foundational work done for Claude Code and restructures it into a universal CLI package compatible with any major AI IDE.

## 🚀 Quick Install (Recommended)

Install the skills directly into your IDE using our CLI tool:

```bash
# Provide global installation via npm
npm install -g genlayer-skills-pro

# Auto-detect your AI assistant in your current project
glskills init

# Or install for a specific AI assistant:
glskills init --ai cursor       # Cursor IDE
glskills init --ai windsurf     # Windsurf IDE
glskills init --ai claude       # Claude Code
glskills init --ai antigravity  # Antigravity
glskills init --ai copilot      # GitHub Copilot
glskills init --ai kiro         # Kiro IDE
glskills init --ai roocode      # Roo Code
glskills init --ai gemini       # Gemini CLI
glskills init --ai codex        # Codex CLI
glskills init --ai all          # Install for ALL AI assistants
```

---

## 🛠️ Available Skills

Once installed, your AI assistant will automatically understand how to assist you with GenLayer development:

| Skill | Description |
|-------|-------------|
| `write-contract` | Write GenLayer intelligent contracts following equivalence principles and best practices. |
| `genvm-lint` | Validate contracts with the GenVM linter and understand common anti-patterns. |
| `direct-tests` | Write and run fast, in-memory direct mode tests for rapid iteration. |
| `integration-tests` | Write and run integration tests against full GenLayer consensus environments. |
| `commit` | Git commit utility with AI-generated conventional commit messages and safety checks. |

---

## 📖 How to Use (Manual Method)

If you prefer not to use the CLI, you can simply point your AI assistant at the relevant `SKILL.md` file locally or paste its contents into your prompt.

**Example Prompts:**
- *"Read `write-contract/SKILL.md` then help me write a new storage contract."*
- *"Based on `genvm-lint/SKILL.md`, lint my current `contract.py`."*
- *"Use `direct-tests/SKILL.md` to write tests for this intelligent contract."*

---

## 🏗️ Architecture & Differences from Original

### The Original (`genlayerlabs/skills`)
The original [genlayerlabs/skills](https://github.com/genlayerlabs/skills) was specifically designed for **Claude Code** (`.claude/skills/`). It relies on Claude-specific hooks, `allowed-tools` frontmatter, and the Claude plugin installation workflow.

### This Project (`genlayer-skills-pro`)
This repository takes the core knowledge from the original skills and makes them **AI-Agnostic**:
- Remade into a universal CLI node package (`glskills-cli / genlayer-skills-pro`).
- Separates markdown instructions from platform-specific execution hooks.
- Deploys the rules explicitly to the required folders for Cursor (`.cursor/rules`), Windsurf (`.windsurf`), Copilot (`.github`), Roo Code (`.roo`), etc.

## 📄 License
MIT License. Based on the open-source efforts of the GenLayer community.
