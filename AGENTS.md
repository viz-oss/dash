# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and task-focused unless the user asks for more detail.
- State assumptions, blockers, and next steps explicitly.
- Do not ask unnecessary clarifying questions when the requested change is local and unambiguous.

## INVESTIGATION

- Start from the most concrete anchor available: the current file, a named symbol, a failing test, or an error message.
- Gather only enough context to form one local, falsifiable hypothesis before making the first edit.
- Prefer targeted reads and searches over broad repository exploration.

## CHANGE / EDIT MODE

- Make the smallest change that can validate the current hypothesis.
- Fix the root cause when it is clear, but do not widen scope unnecessarily.
- Do not modify unrelated files or revert user changes unless explicitly asked.
- Use sub-agents only when the task benefits from parallel exploration or isolated implementation.
- Handle small, local changes directly instead of delegating by default.

## VALIDATION

- After the first substantive edit, run the narrowest useful validation immediately.
- Prefer this order: relevant test, targeted type check, targeted lint, broader project validation.
- Use project scripts when available:
  - `npm run test:unit`
  - `npm run type-check`
  - `npm run lint`
  - `npm run test:e2e`
- If validation cannot be run, state that clearly and explain why.

## TESTING

- Never assume changes work without verification.
- Add or update tests when behavior changes and the surrounding test setup supports it.
- If no test or validation path exists, say so explicitly instead of implying confidence.
