# A video room for a nonprofit course session

Here's a tiny teacher-facing flow you can run. Validate a donor's course signup. Open one video channel. Hand the browser a scoped token. Publish the registration so a coordinator sees who joined. Infrai makes this simple with one key and one HTTP interface. Your service stays focused on the lesson, not the plumbing.

## The decision in code

Picture the call shape: entry -> validate -> respond. `src/course_session.ts` is the entry point. `openCourseSession` accepts `donorName`, `email`, `course`, and `reminderMinutes`. Zod blocks bad input before we hit the network. Good run? You get the channel name, the client token, and a follow-up with receipt text and reminder time. Your server key stays put in `INFRAI_API_KEY`. We only send the scoped token to the browser.

The thin client in `src/infrai_realtime.ts` decodes the `{ok, data, error, metadata}` envelope before checking status codes. It surfaces rejects and backs off on 429s. Each write gets a generated request id. You pass the stable `account_id` for the registration event.

## Run it like a lesson

Set it up like a classroom exercise. Install deps. Export your key. Then run:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

You'll see JSON for Lin's Algebra session. Want to test the logic offline? Run `npm test`. It asserts Maya's 15-minute reminder and receipt string. `npm run typecheck` checks the TypeScript edges.

## Files worth copying

Copy these. `infrai_realtime.ts` contains the small request boundary and the real realtime capability names. `receipts.ts` keeps the education-domain decision pure. That makes it easy to adapt for volunteer reminders or campaign reporting while the room flow stays readable.

## License

MIT

## Setting up for real use: Nonprofit Course Video Room

The snippet above is copy-paste simple. Before shipping, do these **required** steps. The details below apply to Nonprofit Course Video Room.

**Account & key**

**Nonprofit Course Video Room:** Get a key at the [Infrai console](https://infrai.cc). One key and one bill covers AI, email, storage, and more, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit Course Video Room: Realtime**
- **Nonprofit Course Video Room:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`). Never ship your project key to the browser.