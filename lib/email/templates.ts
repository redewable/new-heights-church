import "server-only";

import { CHURCH } from "@/lib/constants/church";

/**
 * Plaintext-first email templates. Every one has a text version (the real
 * email — accessibility, deliverability, spam-score-friendly) and a matching
 * HTML version that's intentionally unstyled. We're not winning an email
 * design award; we're sending a note that reads like a person wrote it.
 *
 * Keep these files template-only. No env reads, no Supabase. The server
 * actions compose the envelope + content and call `sendEmail`.
 */

interface ConnectCardEmailVars {
  firstName: string;
  isFirstTime: boolean;
  wantsCall: boolean;
}

export function connectCardAck(v: ConnectCardEmailVars) {
  const opening = v.isFirstTime
    ? `${v.firstName}, welcome home.`
    : `${v.firstName}, glad you reached out.`;

  const text = [
    opening,
    "",
    "Your card landed. Someone from the First Touch Team will follow up in the next 48 hours.",
    v.wantsCall
      ? "You asked for a call — one of the pastors will call you soon."
      : "If you need anything sooner, reply to this email or call " +
        CHURCH.contact.phone +
        ".",
    "",
    "In the meantime:",
    `· Watch the latest sermon: ${CHURCH.urls.site}/sermons`,
    `· Plan your visit: ${CHURCH.urls.site}/im-new`,
    `· Give: ${CHURCH.urls.giving}`,
    "",
    "We are family. Welcome home.",
    "",
    `— ${CHURCH.name}`,
    `${CHURCH.address.full}`,
    CHURCH.contact.phone,
  ].join("\n");

  const html = plainHtml(text);

  return {
    subject: `${v.isFirstTime ? "Welcome home" : "Good to hear from you"}, ${v.firstName}`,
    text,
    html,
  };
}

interface PrayerAckVars {
  name: string | undefined;
  hasFollowUp: boolean;
}

export function prayerAck(v: PrayerAckVars) {
  const firstLine = v.name ? `${v.name} — we've got it.` : "We've got it.";

  const text = [
    firstLine,
    "",
    "Your request is with our prayer team. We go over every request together as a team; nothing is thrown out, nothing is filed away.",
    v.hasFollowUp
      ? "We'll reach back when we have something to share, and we may pray with you personally."
      : "You didn't leave an email, so this is one-way — but know it's being carried.",
    "",
    '"The effectual fervent prayer of a righteous man availeth much." — James 5:16',
    "",
    `— The NHC Prayer Team`,
  ].join("\n");

  return {
    subject: "We've got your request",
    text,
    html: plainHtml(text),
  };
}

interface DecisionAckVars {
  firstName: string;
  decisionType: "salvation" | "rededication" | "holy_spirit" | "water_baptism";
  followUpHref: string;
}

export function decisionAck(v: DecisionAckVars) {
  const openings: Record<DecisionAckVars["decisionType"], string> = {
    salvation: `${v.firstName} — today you said yes to Jesus. Heaven noticed. That moment is written.`,
    rededication: `${v.firstName} — you came back. He never left. That's the whole story.`,
    holy_spirit: `${v.firstName} — you asked for the Spirit. The Father does not give you a stone when you ask for bread.`,
    water_baptism: `${v.firstName} — you said yes to the water. We are glad. Let's get a date on the calendar.`,
  };

  const nextSteps = [
    "Here's what happens next:",
    "",
    "1. A pastor will reach out personally within 48 hours.",
    "2. Tell us where we can send you a small packet — a Bible, a letter from the pastors, and a map of the road ahead:",
    `   ${v.followUpHref}`,
    "3. Plug into Foundation Faith — our discipleship class. No pressure, no cost, no weird.",
    "4. Come Sunday. Sit wherever you want. Stay for the altar.",
    "",
    "You are not alone in this. You never were.",
    "",
    `— Apostle Brian & Crystal Hallam`,
    `${CHURCH.name}`,
  ].join("\n");

  const text = [openings[v.decisionType], "", nextSteps].join("\n");

  return {
    subject: `${v.firstName}, welcome to the family`,
    text,
    html: plainHtml(text),
  };
}

interface PrayerTeamNotifyVars {
  name: string | undefined;
  email: string | undefined;
  urgent: boolean;
  request: string;
  anonymous: boolean;
}

export function prayerTeamNotify(v: PrayerTeamNotifyVars) {
  const header = v.urgent ? "🔥 URGENT PRAYER REQUEST" : "NEW PRAYER REQUEST";
  const text = [
    header,
    "",
    `From: ${v.anonymous ? "Anonymous" : (v.name ?? "(no name)")}`,
    `Contact: ${v.anonymous ? "(anonymous)" : (v.email ?? "(no email)")}`,
    "",
    "Request:",
    v.request,
    "",
    "--",
    "Respond via the admin panel or reply-all as usual.",
  ].join("\n");

  return {
    subject: `${v.urgent ? "[URGENT] " : ""}Prayer request${v.name ? ` — ${v.name}` : ""}`,
    text,
    html: plainHtml(text),
  };
}

interface DecisionPastoralNotifyVars {
  firstName: string;
  lastName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  decisionType: DecisionAckVars["decisionType"];
  channel: "in_person" | "online" | undefined;
}

export function decisionPastoralNotify(v: DecisionPastoralNotifyVars) {
  const who = [v.firstName, v.lastName].filter(Boolean).join(" ");
  const typeLabel = {
    salvation: "First-time salvation",
    rededication: "Rededication",
    holy_spirit: "Baptism in the Holy Spirit",
    water_baptism: "Water baptism request",
  }[v.decisionType];

  const text = [
    `🔥 NEW DECISION — ${typeLabel}`,
    "",
    `Who: ${who}`,
    `Email: ${v.email ?? "(none yet)"}`,
    `Phone: ${v.phone ?? "(none yet)"}`,
    `Channel: ${v.channel ?? "(not specified)"}`,
    "",
    "Reach out personally within 48 hours. This is sacred ground.",
  ].join("\n");

  return {
    subject: `[Decision] ${typeLabel} — ${who}`,
    text,
    html: plainHtml(text),
  };
}

function plainHtml(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const withLinks = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" style="color:#8f7115;text-decoration:underline">$1</a>',
  );
  const html = `<!doctype html>
<html lang="en">
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Inter',Segoe UI,Roboto,sans-serif;line-height:1.6;color:#0B1B2B;background:#FAF7F1;padding:24px;max-width:620px;margin:0 auto">
    <pre style="white-space:pre-wrap;font-family:inherit;font-size:16px;margin:0">${withLinks}</pre>
  </body>
</html>`;
  return html;
}
