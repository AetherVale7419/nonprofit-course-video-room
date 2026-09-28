export type SessionRequest = {
  donorName: string;
  email: string;
  course: string;
  reminderMinutes: number;
};

export function planFollowUp(input: SessionRequest) {
  const receipt = `Receipt for ${input.donorName}: ${input.course}`;
  const reminder = input.reminderMinutes > 0 ? `Reminder in ${input.reminderMinutes} minutes` : "No reminder";
  const campaignReport = `${input.course}: 1 registration recorded`;
  return { receipt, reminder, campaignReport };
}
