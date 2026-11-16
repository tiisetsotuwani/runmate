# AppRunmate working agreement
Build an installable Android/iPhone running companion. Current code is an explicitly labelled fictional-data demo, not a real service.
Use a coordinator, mobile/backend developers, independent QA/security reviewers and release operator when useful. Independent tasks may be delegated in parallel; one writer per branch.
Read docs/BACKLOG.md, select an unblocked task, define acceptance criteria, implement on an isolated branch, run meaningful checks and attach evidence to the PR. Persist work in Git and record concrete blockers.
Routine coding, research, necessary dependencies and tests are authorized. Do not repeatedly ask for permission already granted.
Do not create paid workers, buy hosting, submit to stores, change broad account permissions or perform destructive migrations without the required owner setup and spending authority.
Keep credentials out of source, logs and EXPO_PUBLIC variables. The repository is public.
No real person should appear in sample data. Never imply demo invitations were sent or accepted. No location permissions are necessary for the demo.
Production discovery, messages, blocks and invitation transitions require server-side authorization.
Checks: npm test; npm run typecheck; npx expo install --check; npm run bundle:android; npm run bundle:ios.
Bundle export is not a signed native build or a device test. Do not invent test results or lockfiles. No production release while launch criteria remain unmet.
Do not remove tests, widen permissions or bypass gates to make a release pass. Escalate the specific blocker and continue independent work.
Agent role descriptions are not persistent agents. Do not claim background execution unless a hosted runner is configured and verified.
