# Product canvas

| Element | Proposed direction |
| --- | --- |
| Problem | Runners struggle to find nearby partners with compatible pace and available times. |
| Early users | Adult recreational and beginner runners in a few Gauteng neighbourhoods. |
| Value | Find compatible company and arrange an actual run with clear expectations. |
| Solution | Approximate-area discovery, pace/distance filters, dated invitations, mutual chat and small groups. |
| Alternatives | Clubs, WhatsApp groups, friends and other running-partner apps. |
| Channels | Local clubs, running shops, ambassadors and referrals. |
| Revenue | Free core matching during validation; test paid convenience and club tools later. |
| Costs | Development, hosting, maps, authentication, moderation, builds and acquisition. |
| Metrics | Accepted invitations, completed runs, repeat runs, retention and resolved reports. |
| Advantage to earn | Local density, reliable communities and trusted relationships. |

These are hypotheses, not validated demand or revenue forecasts.

## Demo
Search by selected area, distance within 2 km, pace within 60 seconds/km and availability. Unknown pace supports beginners. Invitations are local and cancellable. No GPS or personal data is collected.

## Production
React Native/Expo mobile client; proposed Node/TypeScript API and PostgreSQL/PostGIS. Provider choice awaits account and budget setup.
Keep private identity separate from approximate public discovery. Enforce ownership, mutual blocks and conversation membership on the server.
Invitations must have a future date, timezone, public meeting point, pace and distance before sending.
Real flows need authentication, accept/decline/cancel/expire, notifications, reporting/moderation and account deletion.
Pilot 18+ runners, including beginners. No dating, unrelated marketplace or safety guarantees.
Live tracking, emergency response, subscriptions, watches and training plans are deferred.
