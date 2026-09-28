import { strict as assert } from "node:assert";
import { planFollowUp } from "./receipts.js";

const result = planFollowUp({ donorName: "Maya", email: "maya@example.org", course: "Reading club", reminderMinutes: 15 });
assert.deepEqual(result, { receipt: "Receipt for Maya: Reading club", reminder: "Reminder in 15 minutes", campaignReport: "Reading club: 1 registration recorded" });
console.log("course follow-up decision: ok");
