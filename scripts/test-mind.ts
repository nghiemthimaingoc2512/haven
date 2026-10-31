/**
 * Golden conversations for the local engine: `npm run test:mind`.
 * A rule-based engine regresses silently when a new lexicon term collides
 * with an old one, so each bug that has bitten it gets a line here.
 */
import assert from "node:assert/strict";
import { analyze } from "../lib/mind/analyze";
import { whisperReply, type Turn } from "../lib/mind/whisper";
import { auroraReply, auroraSummary } from "../lib/mind/aurora";
import { generateMemory } from "../lib/mind/memory";
import { KNOWLEDGE } from "../lib/mind/knowledge";

let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.log(`FAIL  ${name}\n      ${(err as Error).message.split("\n").slice(0, 6).join("\n      ")}`);
  }
}

function talk(lines: string[], reply: (h: Turn[]) => string): string[] {
  const history: Turn[] = [];
  const out: string[] = [];
  for (const line of lines) {
    history.push({ role: "user", content: line });
    const r = reply(history);
    history.push({ role: "assistant", content: r });
    out.push(r);
  }
  return out;
}
const vi = (h: Turn[]) => whisperReply(h, "vi");

console.log("analysis");
test("rồi is not rối, nhỏ is not nhớ, mà is not má", () => {
  const a = analyze("Chuyện nhỏ thôi mà, mình làm xong rồi", "vi");
  assert.equal(a.emotions.some((e) => e.key === "sad" || e.key === "worried"), false);
  assert.equal(a.people.includes("mẹ"), false);
});
test("trước mặt / bắt đầu do not read as loss or pain", () => {
  const a = analyze("Sếp nói trước mặt mọi người, rồi bắt đầu họp", "vi");
  assert.equal(a.topics.some((t) => t.key === "loss"), false);
  assert.equal(a.primaryTopic, "work");
});
test("untoned typing still works", () => {
  const a = analyze("hom nay minh buon qua, sep mang minh", "vi");
  assert.equal(a.primaryEmotion, "sad");
  assert.equal(a.people.includes("sếp"), true);
});
test("negation flips", () => {
  assert.notEqual(analyze("mình không buồn đâu", "vi").primaryEmotion, "sad");
  assert.notEqual(analyze("I'm not happy about this", "en").primaryEmotion, "happy");
});
test("longest term wins: mất ngủ is sleep, not loss", () => {
  assert.equal(analyze("mấy hôm nay mình mất ngủ", "vi").primaryTopic, "sleep");
});
test("pronouns as people: 'bạn', 'em' are not family or friends", () => {
  const a = analyze("bạn nghĩ sao về chuyện này", "vi");
  assert.equal(a.topics.some((t) => t.key === "friends" || t.key === "family"), false);
});
test("decision split", () => {
  const a = analyze("Mình nên ở lại công việc hiện tại hay chuyển việc mới?", "vi");
  assert.deepEqual(a.decision, { a: "ở lại công việc hiện tại", b: "chuyển việc mới" });
  assert.equal(analyze("Mình hay trì hoãn công việc quan trọng.", "vi").decision, null);
});

console.log("safety");
test("crisis phrases trigger the crisis reply", () => {
  for (const line of ["mình muốn chết", "minh muon chet", "Mình không muốn sống nữa", "buồn muốn chết", "tôi muốn tự tử"]) {
    assert.equal(whisperReply([{ role: "user", content: line }], "vi"), KNOWLEDGE.vi.general.crisis, line);
  }
  assert.equal(whisperReply([{ role: "user", content: "I want to kill myself" }], "en"), KNOWLEDGE.en.general.crisis);
});
test("everyday hyperbole does not", () => {
  for (const line of ["mệt muốn chết luôn", "hôm nay nóng muốn chết", "đói muốn chết"]) {
    assert.notEqual(whisperReply([{ role: "user", content: line }], "vi"), KNOWLEDGE.vi.general.crisis, line);
  }
});
test("Aurora also stops for a crisis", () => {
  assert.equal(auroraReply([{ role: "user", content: "mình muốn chết" }], "vi"), KNOWLEDGE.vi.general.crisis);
});
test("turn after a crisis stays gentle", () => {
  const [, second] = talk(["mình muốn chết", "ừ mình đang ở nhà"], vi);
  assert.notEqual(second, KNOWLEDGE.vi.general.crisis);
  assert.ok(second.length > 0);
});

console.log("whisper");
const LEAK = /\{\w+\}|\[if:|undefined|null/;
test("the reported conversation reads sensibly", () => {
  const replies = talk(
    [
      "Hôm nay sếp mắng mình trước mặt cả team vì một lỗi không phải do mình. Mình không dám nói gì cả, giờ về nhà vẫn cứ nghĩ mãi.",
      "Mình có nên nói chuyện thẳng với sếp không? Hay là cứ im lặng cho qua?",
      "ok cảm ơn nha, mình thấy đỡ hơn rồi",
    ],
    vi,
  );
  for (const r of replies) console.log(`        > ${r}`);
  assert.doesNotMatch(replies[0], /"trước"/);
  assert.match(replies[1], /riêng tư/); // advice about the person they asked about
  assert.equal(KNOWLEDGE.vi.general.feelBetter.includes(replies[2]), true);
});
test("nothing is ever said twice, and no slot leaks", () => {
  const replies = talk(
    ["mình mệt quá", "công việc nhiều lắm", "sếp cứ giao thêm", "mình không biết nữa", "ừ", "chắc vậy", "deadline dồn hết", "mệt thật", "thôi kệ"],
    vi,
  );
  for (const r of replies) {
    console.log(`        > ${r}`);
    assert.doesNotMatch(r, LEAK);
    assert.ok(r.trim().length > 0);
  }
  assert.equal(new Set(replies).size, replies.length);
});
test("light news stays light", () => {
  const [r] = talk(["Hôm nay mình đậu phỏng vấn rồi, vui quá!"], vi);
  console.log(`        > ${r}`);
  assert.doesNotMatch(r, /nặng|khó khăn|không dễ/);
});
test("asserts nothing the user didn't say", () => {
  const [r] = talk(["Dạo này công việc nhiều, mình hơi mệt"], vi);
  console.log(`        > ${r}`);
  assert.doesNotMatch(r, /trước mặt người khác/);
});
test("remembers an earlier conversation", () => {
  const r = whisperReply([{ role: "user", content: "Hôm nay sếp lại giao thêm việc" }], "vi", { pastTopics: ["công việc"] });
  console.log(`        > ${r}`);
  assert.match(r, /công việc/);
});
test("answers who it is honestly", () => {
  assert.match(whisperReply([{ role: "user", content: "bạn là ai vậy" }], "vi"), /chương trình|không phải/);
});
test("English conversation", () => {
  const replies = talk(
    ["My boss yelled at me in front of everyone today", "Should I talk to him or just let it go?", "thanks, I feel better now"],
    (h) => whisperReply(h, "en"),
  );
  for (const r of replies) {
    console.log(`        > ${r}`);
    assert.doesNotMatch(r, LEAK);
  }
});

console.log("aurora");
test("the career decision moves through its stages", () => {
  const replies = talk(
    [
      "Mình nên nghỉ việc để đi du học hay ở lại công ty hiện tại?",
      "Mình muốn đi nhưng sợ tốn tiền và xa gia đình",
      "Tiền là thứ cản mình nhất",
      "Mình đã để dành được một ít",
      "Chắc mình sợ thất bại hơn là sợ hết tiền",
      "Mình sẽ hỏi một người đã đi du học",
      "Ừ",
    ],
    (h) => auroraReply(h, "vi"),
  );
  for (const r of replies) {
    console.log(`        > ${r}`);
    assert.doesNotMatch(r, LEAK);
    assert.ok(r.trim().length > 0);
  }
  assert.match(replies[0], /nghỉ việc/);
  assert.equal(new Set(replies).size, replies.length);
  assert.doesNotMatch(replies.join(" "), /Bạn nói "phải"/); // they never said it
});
test("summary has all three parts and no markdown", () => {
  const h: Turn[] = [
    { role: "user", content: "Mình hay trì hoãn việc quan trọng" },
    { role: "assistant", content: "..." },
    { role: "user", content: "Mình sợ làm không tốt nên cứ lùi lại" },
  ];
  const s = auroraSummary(h, "vi");
  console.log(`        > ${s.replace(/\n+/g, " / ")}`);
  assert.equal(s.split("\n\n").length, 3);
  assert.doesNotMatch(s, /\*\*|\{\w+\}/);
  const unsure: Turn[] = [
    { role: "user", content: "Mình muốn chuyển việc nhưng sợ lương thấp hơn" },
    { role: "assistant", content: "..." },
    { role: "user", content: "không biết nữa" },
  ];
  const quoted = auroraSummary(unsure, "vi");
  assert.match(quoted, /sợ lương thấp hơn/);
  assert.doesNotMatch(quoted, /"không biết nữa"/);
});

console.log("memory");
test("a memory is grounded and well-formed", () => {
  const m = generateMemory(["Hôm nay sếp mắng mình trước mặt cả team", "Mình buồn lắm, không dám nói gì"], "vi");
  console.log(`        > ${m.reflection} | ${m.standout} | ${m.emotionKey} ${m.confidence.toFixed(2)} | ${m.topics} | ${m.people}`);
  assert.equal(m.topics[0], "công việc");
  assert.ok(m.people.includes("sếp"));
  assert.equal(m.emotionKey, "sad"); // "buồn lắm" is what they said; "lắm" must not boost the next clause
  assert.doesNotMatch(m.reflection, LEAK);
});
test("a closing thank-you doesn't relabel a hard conversation", () => {
  const m = generateMemory(
    ["Hôm nay sếp mắng mình trước mặt cả team vì một lỗi không phải do mình.", "Mình có nên nói thẳng với sếp không?", "ok cảm ơn nha, mình thấy đỡ hơn rồi"],
    "vi",
  );
  console.log(`        > ${m.reflection} | ${m.emotionKey}`);
  assert.notEqual(m.emotionKey, "calm");
  assert.doesNotMatch(m.reflection, /món quà/);
  assert.match(m.reflection, /nhẹ hơn/);
});
test("no content still yields a usable memory", () => {
  const m = generateMemory(["ừm"], "vi");
  assert.ok(m.reflection.length > 0);
  assert.equal(m.emotionKey, "neutral");
});

console.log(failed ? `\n${failed} failed` : "\nall passed");
process.exitCode = failed ? 1 : 0;
