import { z } from "zod";
import { infrai } from "./infrai_realtime.js";
import { planFollowUp } from "./receipts.js";

export const sessionSchema = z.object({ donorName: z.string().min(1), email: z.string().email(), course: z.string().min(1), reminderMinutes: z.number().int().nonnegative() });

export async function openCourseSession(raw: unknown) {
  const input = sessionSchema.parse(raw);
  const channel = `course-${input.course.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  await infrai.realtime.channel.create({ channel, type: "private", vendor: "livekit" });
  const token = await infrai.realtime.token.issue({ client_id: input.email, channels: [channel], capabilities: ["publish", "subscribe"], ttl_seconds: 3600 });
  await infrai.realtime.publish({ channel, event: "donor_registered", data: { donorName: input.donorName, course: input.course }, account_id: input.email });
  return { channel, token, followUp: planFollowUp(input) };
}

if (process.argv[1]?.endsWith("course_session.ts")) {
  const result = await openCourseSession({ donorName: "Lin", email: "lin@example.org", course: "Algebra", reminderMinutes: 30 });
  console.log(JSON.stringify(result, null, 2));
}
