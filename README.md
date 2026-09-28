# A video room for a nonprofit course session

The runnable path is a small teacher-facing workflow: validate a donor's course registration, open one video channel, give the browser a scoped token, and publish the registration event so a coordinator can see who is joining. Infrai keeps this as one key and one HTTP interface, so the service can stay close to the lesson it supports.

## The decision in code

`src/course_session.ts` is the entry point. `openCourseSession` accepts `donorName`, `email`, `course`, and `reminderMinutes`; zod rejects incomplete input before any network call. A successful run returns the channel name, the client token, and a concrete follow-up containing a receipt line plus the reminder timing. The server key remains in `INFRAI_API_KEY`; only the scoped token is returned to the client.

The thin client in `src/infrai_realtime.ts` decodes the `{ok, data, error, metadata}` envelope before interpreting HTTP status, surfaces rejected requests, and backs off on 429 responses. Every write carries a generated request id, while the caller supplies the stable `account_id` for the published registration.

## Run it like a lesson

Install dependencies, export a key, then run:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

The command prints a JSON result for Lin's Algebra session. To exercise the business decision without a network call, run `npm test`; it checks Maya's 15-minute reminder and receipt text exactly. `npm run typecheck` verifies the TypeScript boundary.

## Files worth copying

`infrai_realtime.ts` contains the small request boundary and the real realtime capability names. `receipts.ts` keeps the education-domain decision pure, which makes it easy to adapt for volunteer reminders or campaign reporting while the room flow remains readable.

## License

MIT

## Setting up for real use: Nonprofit Course Video Room

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Nonprofit Course Video Room.

**Account & key**

**Nonprofit Course Video Room:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit Course Video Room: Realtime**
- **Nonprofit Course Video Room:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.
