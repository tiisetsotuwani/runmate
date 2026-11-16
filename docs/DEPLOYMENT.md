# Environment and release setup

## Available configuration
.devcontainer/devcontainer.json installs Node 22 dependencies and checks. It is not a provisioned Codespace or a native iOS build machine.
Mobile checks run on pushes/PRs using a read-only token, timeout and concurrency control. No Expo credentials are used in PR checks.
The native preview workflow is manual and disabled unless ENABLE_EAS_BUILDS=true on main. No store-submission workflow exists yet.

## Owner setup before native previews
1. Generate and commit a real package-lock.json; verify npm ci and the full check suite.
2. Link the app to the owner's Expo project.
3. Confirm provisional identifiers com.tiisetsotuwani.apprunmate.
4. Configure a GitHub preview environment with appropriate restrictions.
5. Set EXPO_OWNER and EAS_PROJECT_ID variables from the actual project.
6. Store EXPO_TOKEN as an environment secret, never in source or chat.
7. Complete initial Expo signing setup for the intended profiles.
8. Approve build spending before setting ENABLE_EAS_BUILDS=true.
9. Pin EAS CLI and Actions to reviewed versions/SHAs before unattended operation.

## Build profiles
development: native development client.
preview: Android APK plus iOS simulator app. A simulator app does not install on a physical iPhone.
production: future store-build configuration, not a production-readiness claim. No submission is configured.

## Launch gates
Finish the real backend, auth, authorization, blocks, invitations, chat, reporting/moderation and deletion.
Test physical Android/iPhone devices, including offline behaviour, accessibility and denied permissions.
Configure Apple/Google developer accounts, signing, support/privacy pages, store assets and disclosures.
Implement monitoring, database migrations, backups and an actual restore drill. Store review and submission are different stages.
Keep backward-compatible APIs and staged releases: native installs cannot always be immediately rolled back.
No production data or service is deployed by this foundation.
