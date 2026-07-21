# Team-Code-Challenge-Ruby

## Commit message convention

This repo enforces [Conventional Commits](https://www.conventionalcommits.org/) via a Husky
`commit-msg` hook, checked with commitlint. It applies to every commit, regardless of whether
you're working in `backend/` or `frontend/`.

**Setup (once per clone):**

```bash
npm install
```

This runs the `prepare` script, which registers the git hook. Node must be available on your
machine for the hook to run.

**Format:**

```
type(optional-scope): short description
```

**Allowed types:**

| Type       | Use for                                             |
| ---------- | ---------------------------------------------------- |
| `feat`     | A new feature                                        |
| `fix`      | A bug fix                                            |
| `chore`    | Maintenance, tooling, dependencies                    |
| `docs`     | Documentation only                                    |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or updating tests                              |
| `style`    | Formatting, whitespace, no logic change               |

**Examples:**

```
feat: add support request creation form
fix(backend): correct database credential loading
chore: update husky and commitlint dependencies
docs: document commit message rules
refactor(frontend): extract badge status mapping into a helper
test(backend): cover support request validations
style: apply prettier formatting to Button
```

**Other rules inherited from Conventional Commits:**

- Subject can't be empty and shouldn't end with a period.
- Subject shouldn't be Sentence-case, Start Case, PascalCase, or UPPERCASE — lowercase is safest.
- The first line (header) must be 100 characters or fewer.

**Merge commits are exempt** — e.g. `Merge pull request #12 from ...` is allowed through
unchanged, so merging/updating branches isn't blocked by this rule.

This hook runs locally only (no CI check). It can still be bypassed with `git commit --no-verify`,
so please don't unless you have a good reason.

**Skipping the check locally:**

If you really need to bypass the hook for a specific commit, use `--no-verify` (alias `-n`):

```bash
git commit --no-verify -m "message without the conventional format"
```

Keep in mind `--no-verify` skips *all* local git hooks, not just this one, so use it sparingly —
there's no server-side check backing this up, so a badly formatted message that skips the hook
will stay in history unnoticed.
