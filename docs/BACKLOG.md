# Delivery backlog

| ID | Task | Acceptance evidence | Dependency |
| --- | --- | --- | --- |
| F01 | Mobile demo and environment | Domain tests, TypeScript, Expo compatibility, two-platform bundle export | Initial foundation |
| F02 | Lock dependencies | Generated committed lock and npm ci pass | Working runtime or CI artifact |
| F03 | Native preview | Android APK and iOS simulator launch | Expo and build budget |
| A01 | Persistent AI workers | Bounded task, independent review, durable queue and spending enforcement | Provider/budget/credential decision |
| B01 | Backend and auth | Separate staging and secure identity | Owner hosting account |
| B02 | Profiles/discovery | Owner-only writes, approximate areas, consent | B01 |
| B03 | Blocks/privacy | API tests prevent cross-user access and discovery | B02 |
| B04 | Invitations | Future time/timezone/meeting point; server transitions | B03 |
| B05 | Chat | Nonparticipants denied, blocks revoke access | B04 |
| B06 | Notifications | Idempotency and retry/denied-permission tests | B04 |
| B07 | Moderation | Reports, staff controls and audit records | B03 |
| B08 | Deletion | In-app and external requests, retention tests | B01 |
| Q01 | Real device journey | Two real users complete journey on Android/iPhone | B04-B08 |
| R01 | Production | Backups/restore, monitoring, disclosures, signed beta | Q01 |

Missing owner inputs: Expo project, hosting/provider choice, operating ceiling and developer-store setup. Chat execution environment was unavailable during authoring; remote CI is the verification route.
Proposed pilot: 50-100 runners in 2-3 nearby areas. Targets are not achieved recruitment or validated demand.
