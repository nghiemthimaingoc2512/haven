import type { Knowledge } from "@/lib/mind/knowledge";

/** English knowledge base. Same rules as the Vietnamese one: specific, short, never therapist-speak. */
export const KNOWLEDGE_EN: Knowledge = {
  topics: {
    work: {
      label: "work",
      followUps: [
        "Does this happen often with {person}, or was today the first time?",
        "[if:said nothing|didn't say|couldn't say|kept quiet|stayed quiet] What did you want to say in that moment that you held back?",
        "Setting today aside, is there anything about this job that still makes you want to stay?",
        "Is this tiredness about the amount of work, or about the people?",
        "Is there anyone at work you can actually say this to?",
      ],
      observations: [
        "[if:yelled|blamed|in front of|called out] Being called out in front of others always weighs more than whatever was actually said.",
        "It sounds like you've been trying harder than anyone there can see.",
        "Work takes up more than half your day, so of course it reaches your mood.",
      ],
      suggestions: [
        "If you want to raise it with {person}, pick a private moment and talk about one specific thing, not how you felt. People tend to hear that better.",
        "Write down three things you actually want from this job. If two of them aren't here anymore, the answer is already fairly clear.",
        "Before deciding anything big, give it a week: note one good thing and one bad thing each day. A whole week is fairer than one bad day.",
        "[if:deadline|too much|swamped|workload] With deadlines piling up, pick the single most important one and tell {person} plainly what will slip. Saying it early is always easier than apologizing later.",
      ],
      reframes: [
        "[if:yelled|blamed|criticized] You're treating this as being about your ability. But how {person} reacted may say more about {person} than about you.",
        "[if:quit|stay|leave] Maybe the question isn't stay or go, but how you'd stay if you did.",
        "[if:have to|had to|got to] When you say you \"have to\" - who set that rule? Is it a real condition, or a fear of change?",
      ],
      steps: [
        "This week, have a 15-minute private talk with {person} about one specific thing.",
        "Write down three things you want from your next job, wherever it is.",
        "Update your resume - not to send it, just to see clearly what you've done.",
      ],
      auroraOpeners: [
        "If things at work stayed exactly like this for six more months, how would that feel?",
        "What bothers you most here: the work, the people, or the feeling of standing still?",
      ],
    },
    study: {
      label: "study",
      followUps: [
        "Are you worried about the result, or about not having started yet?",
        "If the grade isn't what you hoped, what scares you most: your own disappointment, or someone else's?",
        "The last time studying actually clicked, what was different from today?",
      ],
      observations: [
        "[if:exam|test|finals] Exams make everything look like life and death, when it's one marker among many.",
        "It sounds like you're studying on fear more than curiosity, and fear is exhausting.",
      ],
      suggestions: [
        "Break it down until it's almost funny: not \"review chapter 3\" but \"read the first two pages\". Starting small is easier on your head.",
        "Study for 25 minutes, rest for 5, repeat. You don't need to be brilliant, just seated.",
        "Ask {person} one specific question about the part that's stuck. One good question can save a whole evening.",
      ],
      reframes: [
        "[if:grade|grades|exam|test] You've tied your grade to your worth. Would you judge your friends by theirs?",
      ],
      steps: [
        "Tonight, study the hardest part for exactly 25 minutes, then stop.",
        "Write three specific questions to ask this week.",
        "Plan only the next three days, not the whole term.",
      ],
      auroraOpeners: [
        "What do you want from this: the grade, the understanding, or a door it opens afterward?",
      ],
    },
    family: {
      label: "family",
      followUps: [
        "How much of what you really think have you been able to say to {person}?",
        "What do you most want {person} to understand?",
        "Does your family usually talk things through, or keep them inside?",
        "Does this make you sad, or does it make you feel guilty?",
      ],
      observations: [
        "[if:fight|fighting|argue|argument|yelled] With family, fights usually aren't about the thing itself. Both sides want to be understood.",
        "Family is where we most expect to be understood, so when we aren't, it hurts twice as much.",
        "It sounds like you can love {person} and be worn out by {person} at once. Those two can coexist.",
      ],
      suggestions: [
        "With {person}, talk about yourself rather than them: \"I felt sad when...\" lands better than \"you always...\". One changed sentence makes a difference.",
        "If talking in person is hard, a short text tonight works too. You don't need to solve it, just reopen the door.",
      ],
      reframes: [
        "You're trying to change how {person} thinks. If that can't happen, what could change on your side?",
      ],
      steps: [
        "Send {person} one message that has nothing to do with the argument, just checking in.",
        "Write down what you want to say to {person}, even if you never send it.",
      ],
      auroraOpeners: [
        "If you could choose, what would you want things with {person} to look like?",
      ],
    },
    love: {
      label: "relationship",
      followUps: [
        "[if:broke up|breakup|miss|my ex] Do you miss them, or the feeling of having someone?",
        "Is this new, or was it the last straw?",
        "What do you need from this relationship that you aren't getting?",
        "[if:text|texting|ghosted] Are you waiting for a message, or for an answer to something in yourself?",
      ],
      observations: [
        "[if:broke up|breakup|my ex] Breakups hurt not just because you lose someone, but because you lose the future you'd pictured.",
        "[if:text|texting] It sounds like you want to text and also know you shouldn't. That tug-of-war is more tiring than the sadness.",
        "[if:long distance] Long distance is hard because every time you miss them, you handle it alone.",
      ],
      suggestions: [
        "[if:text|texting] If you want to text {person}, give it 24 hours. If you still want to after a day, go ahead - then it's you choosing, not the feeling.",
        "Write everything you want to say on paper. Don't send it. Most of what we need is to say it, not to be answered.",
        "Ask yourself: does this relationship give you energy, or take it? Answer honestly; you don't have to decide anything yet.",
      ],
      reframes: [
        "[if:get back|come back|back together] You're asking how to get them back. Another question: if they came back, what would be different?",
      ],
      steps: [
        "Tell {person} one thing you need, in one sentence, without a long explanation.",
        "See a friend you've been too busy to see lately.",
      ],
      auroraOpeners: [
        "What do you want from this relationship, in one sentence?",
        "If your best friend were in exactly this situation, what would you tell them?",
      ],
    },
    friends: {
      label: "friend",
      followUps: [
        "Is this with {person} a misunderstanding, or are you actually different now?",
        "How much do you want to keep this friendship?",
        "[if:left out|excluded] That left-out feeling - did it come from this, or was it there before?",
      ],
      observations: [
        "[if:drifted|grew apart|distant] Friends drift apart as they grow, and it hurts because nobody did anything wrong.",
        "[if:left out|excluded] Being left out often hurts more than being told something, because it makes you wonder whether you matter.",
      ],
      suggestions: [
        "Send {person} a short message, no blame: \"I've felt a bit distant lately, are you okay?\" People tend to respond to directness.",
        "Rather than waiting to be invited, invite one person to one small thing.",
      ],
      reframes: [
        "[if:silence|no reply|ignored|ghosted] You're reading {person}'s silence as rejection. Is there another way to read it?",
      ],
      steps: [
        "Message {person} today, just one line.",
        "Invite someone to eat this week without waiting to be asked.",
      ],
      auroraOpeners: [
        "In this friendship, are you giving more or receiving more?",
      ],
    },
    health: {
      label: "health",
      followUps: [
        "Have you seen a doctor, or are you handling it alone?",
        "Is the worry about your body, or about what you'd have to put on hold?",
        "Are you eating and sleeping enough lately?",
      ],
      observations: [
        "When your body is tired, everything else genuinely looks heavier.",
        "[if:test results|results|checkup] Waiting for results is its own kind of worry: nothing to do but wait.",
      ],
      suggestions: [
        "If the pain or tiredness has lasted more than a week, get it checked. Not because it's serious, but so you can stop guessing.",
        "Tonight just do one thing: go to bed 30 minutes earlier. Everything else can wait.",
      ],
      reframes: ["You treat resting as being lazy. But your body is telling you something, and you aren't listening."],
      steps: [
        "Book a checkup this week.",
        "Three nights in a row, sleep before 11. That's all.",
      ],
      auroraOpeners: ["What worries you most: the symptom, or not knowing what it is?"],
    },
    sleep: {
      label: "sleep",
      followUps: [
        "Is it that your mind won't stop, or that your body isn't tired?",
        "When you're lying there, what do you think about most?",
      ],
      observations: [
        "[if:insomnia|can't sleep|couldn't sleep|stayed up] At 2am every problem looks three times its daytime size.",
        "Too little sleep makes everyone sadder and shorter-tempered, so part of today's weight may be last night.",
      ],
      suggestions: [
        "If you've been lying awake for 20 minutes, get up, do something boring in dim light, then go back. Keep the bed for sleep.",
        "Write down whatever is circling before you lie down. A mind lets go more easily once it knows it's been written somewhere.",
      ],
      reframes: [],
      steps: ["Turn off screens 30 minutes before bed tonight.", "Write down three worries on paper and leave them until morning."],
      auroraOpeners: ["When did your sleep get worse, and did anything else start around then?"],
    },
    money: {
      label: "money",
      followUps: [
        "Is this about this month, or the long run?",
        "Do you have anyone you can talk money with, without being judged?",
        "Does this make you worried, or does it make you feel ashamed?",
      ],
      observations: [
        "Money worry is very real. Positive thinking doesn't make it go away.",
        "It sounds like you're carrying this alone, and few people dare to talk about money.",
      ],
      suggestions: [
        "Write every expense on one sheet, even small ones. The real number is usually less frightening than the one in your head.",
        "[if:debt|loan] If you have debt, call the lender before you're late. They nearly always have options, and early is much easier.",
        "Find one fixed cost you can cut this month. Just one, so you feel in control of something.",
      ],
      reframes: ["You've tied money to whether you're okay as a person. Can those two be separated?"],
      steps: ["List this month's income and spending tonight, roughly.", "Pick one cost to cut or delay this week."],
      auroraOpeners: ["If money weren't the issue, what would you choose? That answer shows what you really want."],
    },
    future: {
      label: "future",
      followUps: [
        "Are you torn between real options, or afraid of choosing wrong?",
        "If you chose wrong, what's the worst that could happen, and could it be undone?",
        "Of what you're weighing, which do you want, and which do you think you \"should\"?",
        "Who are you afraid of disappointing if you choose differently?",
      ],
      observations: [
        "Feeling lost about the future usually isn't a lack of options, but too many with no guarantee.",
        "It sounds like you're trying to see the whole road, when you only need the next step.",
      ],
      suggestions: [
        "Imagine it's a year from now and you chose one option. Write a short paragraph about an ordinary day. Then do it for the other. The one that's easier to write is often the one you want.",
        "Shrink the big decision into something you can try for two weeks. Trying teaches more than thinking.",
        "Ask someone who's taken that path what an ordinary day is like for them.",
      ],
      reframes: [
        "You're looking for the right choice. There may be no right choice, only one you'll make right.",
        "You're asking what you should do. The real question sounds more like whether you're allowed to want it.",
      ],
      steps: [
        "Write two paragraphs: an ordinary day a year from now if you chose \"{a}\", and if you chose \"{b}\".",
        "Find one person who's done what you're considering and ask them one question.",
        "Pick one small thing you can try within two weeks to test the direction.",
      ],
      auroraOpeners: [
        "If no one would ever know what you chose, what would you choose?",
        "Is this a decision, or a fear dressed up as one?",
      ],
    },
    self: {
      label: "self",
      followUps: [
        "If a close friend said exactly this about themselves, what would you tell them?",
        "When did you last feel okay about yourself, and what were you doing?",
        "[if:compare|comparing] Who are you comparing yourself to, and can you see their whole life?",
      ],
      observations: [
        "[if:failure] Feeling like a failure usually follows one specific thing, then spreads to your whole self. That specific thing is much smaller than the feeling.",
        "You're grading yourself on a scale you'd never use on anyone else.",
        "It sounds like you're harder on yourself than anyone has ever been on you.",
      ],
      suggestions: [
        "Write three things you did this week, small ones count. Not to praise yourself, but as evidence against that voice.",
        "When the \"I'm not enough\" voice starts, ask it: compared to whom, at what, on which day? It usually can't answer.",
        "Take a few days off social media. Comparing yourself to people's edited selves is a race nobody wins.",
      ],
      reframes: [
        "[if:failure] You say \"failure\" like a verdict. Something not working out is an event, not an identity.",
        "You want confidence before you act. It usually comes the other way around.",
      ],
      steps: [
        "Each evening, note one thing you managed that day.",
        "Do one small thing you're good at this week, just because you're good at it.",
      ],
      auroraOpeners: [
        "Do you feel you failed at something specific, or is it a general feeling?",
        "What does \"good enough\" mean to you - have you ever defined it?",
      ],
    },
    loneliness: {
      label: "loneliness",
      followUps: [
        "Is it having no one around, or having people around and still feeling alone?",
        "When did you last feel understood?",
        "Is there someone you'd like to message but feel shy about?",
      ],
      observations: [
        "Loneliness is hard to talk about, because saying it feels like asking for pity.",
        "[if:live alone|living alone] Living alone, the hard part isn't the evening, it's having no one to tell the small things.",
        "You just said this out loud here, which means you're still reaching out. That matters.",
      ],
      suggestions: [
        "Message someone, anyone, with no reason at all: \"you crossed my mind\". Most people are glad to get it.",
        "Find a place with people where you don't have to talk: a cafe, a class, a running group. Just being near others takes off half of it.",
        "Set a fixed time with someone, like calling home every Thursday. Loneliness hates a schedule.",
      ],
      reframes: [
        "You're waiting for someone to reach out. If you swapped places, would you want them to? They probably would too.",
      ],
      steps: ["Message one person today, no reason needed.", "Go somewhere this week where faces become familiar."],
      auroraOpeners: ["Do you want more people, or one person who understands you better?"],
    },
    loss: {
      label: "loss",
      followUps: [
        "Would you like to tell me about them, even something small?",
        "What reminded you of them today?",
        "Is there anyone you can remember them with?",
      ],
      observations: [
        "There's no right way to hurt after losing someone. However you hurt today is right.",
        "Missing them doesn't shrink; life slowly grows around it.",
        "I'm here. You don't have to say anything else.",
      ],
      suggestions: [
        "If you can, write them a letter and tell them about today. It's fine if nobody reads it.",
        "Allow yourself days that aren't okay, without explaining them to anyone.",
      ],
      reframes: ["[if:should have|my fault|blame myself] You blame yourself for not doing something. But you acted on what you knew then."],
      steps: ["Write a few lines to them tonight.", "Allow yourself one day of not being okay."],
      auroraOpeners: ["I don't think this is a moment for solving anything. Would you like to tell me about them?"],
    },
    change: {
      label: "change",
      followUps: [
        "Is what feels strange the place, the people, or yourself here?",
        "What do you miss most about where you were?",
        "Have you found one spot here that feels comfortable, even a small cafe?",
      ],
      observations: [
        "Anywhere new has a stretch where everything feels slightly off. That's normal, not a sign you chose wrong.",
        "Starting over is tiring because everything takes thought, even where to buy things.",
      ],
      suggestions: [
        "Pick one cafe, one street, to become \"yours\". Get to know one small place first, the city later.",
        "Give yourself three months before concluding anything about this place.",
      ],
      reframes: ["You're comparing a new place after a month with an old one after years. That's unfair to it, and to you."],
      steps: ["Find a cafe nearby and go three times this week.", "Say yes to one invitation here, even if you feel shy."],
      auroraOpeners: ["Do you want this place to feel more like the old one, or do you want to be different here?"],
    },
    procrastination: {
      label: "procrastination",
      followUps: [
        "What's the first step of the thing you're avoiding, specifically?",
        "Are you putting it off because it's boring, or because you're afraid of not doing it well?",
        "When you procrastinate, what do you usually do instead?",
      ],
      observations: [
        "Procrastination is rarely laziness. It's usually fear: of doing it badly, of it being hard.",
        "It's doubly tiring: not doing it, and feeling guilty about not doing it.",
        "It sounds like this task has grown to ten times its real size in your head.",
      ],
      suggestions: [
        "Lower the bar until it's funny: not \"write the report\" but \"open the file and type a title\". Starting is the hard part.",
        "Do exactly 10 minutes, then you're allowed to stop. Permission to stop is what lets you start.",
        "Tell someone \"I'm doing this tonight\". It's harder to dodge when someone knows.",
      ],
      reframes: [
        "You think you need motivation before you act. Motivation usually shows up five minutes after you start.",
        "[if:lazy] You call yourself lazy. Lazy people don't feel guilty, and you do. So what is it really?",
      ],
      steps: [
        "In the next 24 hours, do the first step for 10 minutes.",
        "Split it into three small steps and put them where you can see them.",
      ],
      auroraOpeners: [
        "How long would it really take, and how long have you spent avoiding it?",
        "Are you afraid of starting, or of the result?",
      ],
    },
    daily: {
      label: "life",
      followUps: [
        "Tell me more, where were you?",
        "What made that moment stick with you?",
      ],
      observations: [
        "Small things like this are what make a day worth having.",
        "Noticing something that small is a skill, not everyone has it.",
      ],
      suggestions: [],
      reframes: [],
      steps: [],
      auroraOpeners: [],
    },
  },

  emotions: {
    sad: {
      ack: ["That sounds really sad. {detail} - that's not a small thing.", "{detail}. Reading that felt heavy.", "That doesn't sound easy at all."],
      stay: ["I'm here. You don't have to be okay right away.", "Stay sad a while if you need to. I'm not going anywhere."],
    },
    anxious: {
      ack: ["This worry sounds like it keeps circling in your head.", "{detail} - anyone in your place would be worried.", "It sounds like you've been tense all day."],
      stay: ["Take one long breath with me. It'll still be there, but you don't have to deal with it this minute."],
    },
    worried: {
      ack: ["It sounds like you're stuck between two things that both make sense.", "{detail} - being torn means you care about both sides."],
      stay: ["You don't have to decide right now. Just say it out loud first."],
    },
    frustrated: {
      ack: ["I can hear how annoying that was. {detail}.", "That's a fair thing to be frustrated about.", "The worst is doing it right and it still not working."],
      stay: ["Let it all out, I'm listening. No need to be polite."],
    },
    angry: {
      ack: ["Of course you're angry. {detail} - that isn't fair.", "It sounds like you held back a lot before it got to this point."],
      stay: ["Say all of it. Nobody here needs you to be gentle."],
    },
    overwhelmed: {
      ack: ["[if:too much|exhausted|burned out|burnt out|overwhelmed|drained] It sounds like today was too much, and you carried most of it alone.", "That does sound tiring.", "{detail} - that kind of tired doesn't go away with one night's sleep.", "You've made it this far today, and that's already a lot."],
      stay: ["You don't have to do anything else tonight. Just be here a while."],
    },
    happy: {
      ack: ["Oh that's great! {detail} - I love that!", "Reading that made me happy too.", "Wow, that's wonderful!"],
      stay: [],
    },
    calm: { ack: ["What a relief.", "That sounds okay now, I'm glad.", "That sounds easier to breathe in."], stay: [] },
    peaceful: { ack: ["That sounds really peaceful.", "Moments like this are precious, hold onto it."], stay: [] },
    hopeful: { ack: ["I can hear a little hope in that, and I like it.", "{detail} - it sounds like you're more ready than you think."], stay: [] },
    inspired: { ack: ["You sound fired up! Tell me about the idea.", "This kind of energy is rare, don't let it slip."], stay: [] },
    neutral: { ack: ["Mm, I'm listening.", "I hear you.", "Okay, go on."], stay: ["I'm still here."] },
  },

  general: {
    greeting: ["Hi. How's your day been?", "I'm here. Anything you'd like to tell me?", "Hi, I'm here. Anything new today?"],
    greetingReturning: ["Hi. Last time you told me about {topic} - how's that been?", "I'm here. Anything new with {topic}?"],
    thanks: ["Anytime. I'm here.", "Of course. Whenever you want to talk again, I'll be here.", "I'm glad it helped a bit. Get some rest."],
    closing: ["Go rest. Tell me about tomorrow if you feel like it.", "Good night. I'll keep today safe for you.", "Okay, take care. I'm here whenever."],
    feelBetter: ["I'm glad it feels lighter. Sometimes saying it out loud changes things.", "That's good to hear. A little lighter is enough for today."],
    crisis:
      "I read what you just wrote carefully, and I'm genuinely worried about you. You don't have to carry this alone right now. If you're in danger, please call your local emergency number right away, or 988 in the US, or find someone you trust nearby and tell them. I'm only a program, so I can't replace those people, but I'm still here. Are you safe right now?",
    aboutHaven: [
      "I'm Whisper, part of Haven. I'm a program, not a real person, and I understand things the way I've been taught, so I'll sometimes get it wrong - just correct me. What you tell me stays on your device.",
    ],
    adviceGeneric: [
      "I don't understand enough yet to say what you should do. Tell me a bit more: where did this start?",
      "Before we get to should or shouldn't: setting \"should\" aside, what do you actually want?",
    ],
    adviceLead: ["Here's what I think:", "If it were me:", "Honestly:"],
    opinionLead: ["Honestly, I think", "To me,", "I'd say"],
    groundedFollowUps: [
      "This thing with {phrase} - when did it start?",
      "What about {phrase} is staying with you the most?",
      "Tell me more about {phrase}?",
    ],
    groundedObservations: ["It sounds like {phrase} is taking up a lot of space right now.", "Something about {phrase} sounds like it matters to you."],
    heavyProbes: ["What happened?", "What's making you feel this way?", "How long have you felt like this?"],
    openInvites: ["Tell me more.", "And then?", "I'm listening, keep going.", "Mm. What else?"],
    noticeRecurring: ["You've come back to {topic} a few times now. It seems to be the main thing today.", "I notice {topic} keeps coming up."],
    noticePerson: ["It seems {person} has affected you a lot today."],
    rememberPast: ["You mentioned {topic} last time too. Are the two connected?", "I remember you telling me about {topic}. How has that been?"],
    decisionLead: ["So you're standing between \"{a}\" and \"{b}\".", "Two paths: \"{a}\" or \"{b}\"."],
    lightFollowUps: ["Tell me more!", "And then?", "Who were you with?", "What did you like most about it?"],
    longShareAck: ["I read all of it. That's a lot for one day.", "I read it carefully. Getting it all out already takes some weight off."],
  },

  aurora: {
    understand: ["Let me say it back to check: {detail}. Is that right?", "What I understand is {detail}. Correct me if I'm off."],
    understandDecision: ["So you're weighing \"{a}\" against \"{b}\".", "Two options on the table: \"{a}\" or \"{b}\"."],
    clarifyGoal: [
      "If this worked out well, what specifically would be different in your life?",
      "What do you actually want here - not what you \"should\" want?",
      "When you say \"okay\", what does that look like?",
    ],
    clarifyDecision: [
      "Between \"{a}\" and \"{b}\", which do you want, and which do you think you should?",
      "If you had to pick right now without thinking, \"{a}\" or \"{b}\"? Just say it, you're not deciding yet.",
    ],
    explore: [
      "What's stopping you from doing that, as specifically as you can say?",
      "What have you tried so far, and what happened?",
      "If the biggest obstacle vanished, what would you do tomorrow?",
      "Which part of this is in your hands, and which isn't?",
    ],
    challengeGeneric: [
      "You said \"{quote}\". How sure are you of that - and what if it's only half true?",
      "Is it possible that what you fear won't happen, and you're preparing for it as if it's certain?",
    ],
    reflectLead: ["Listening back, one thing stands out: \"{quote}\".", "Of everything you said, this seems most important: \"{quote}\"."],
    reflectNoQuote: ["Listening back, you seem to know what you want. You just haven't let yourself say it.", "You aren't short of answers. You're short of permission."],
    insightGeneric: [
      "Maybe the issue isn't which to choose, but that you want an option with no risk, and that doesn't exist.",
      "You may not need more information, just one small step to test what you're guessing.",
      "It sounds like you're waiting for certainty before acting. Certainty usually only comes after.",
    ],
    summaryClear: "What became clear",
    summaryOpen: "What's still open",
    summaryStep: "One small next step",
    clearQuote: ["You managed to say it: \"{quote}\"."],
    reactFear: ["If what you fear actually happened, what would you do next?", "Looking at it fairly, how likely is that fear to come true?", "What is this fear protecting you from?"],
    reactUnknown: ["Not knowing is fine. If you had to guess, what would you guess?", "That's hard to answer. Try the opposite: what do you definitely NOT want?"],
    reactAnswer: ["\"{quote}\" - I think that's worth pausing on.", "This line caught my attention: \"{quote}\"."],
    clearGeneric: ["You've named what's keeping you stuck.", "This is clearer than when you started telling it."],
    stillOpenGeneric: [
      "You haven't said what you fear most if you choose wrong.",
      "It isn't clear yet who else has a say in this.",
      "What you want is clearer; when you'll act isn't.",
    ],
    stepGeneric: [
      "This week, do one small thing that tests your biggest assumption.",
      "Tell someone you trust about this, the way you told me.",
      "Write your decision in one sentence, put it somewhere visible, and look at it for three days.",
    ],
    wantToBeHeard: ["It seems you don't need to solve anything right now, just to be heard. I'm listening."],
    starters: [
      "I keep procrastinating on something important.",
      "Should I stay at my job or find a new one?",
      "I feel like a failure.",
      "I don't know whether to continue this relationship.",
    ],
  },

  reflect: {
    heavy: [
      "{detail}. You said it out loud instead of keeping it in, and I think that was the right thing.",
      "A hard day: {detail}. I'm keeping this so you can look back and see you got through it.",
    ],
    light: ["Something worth keeping today: {detail}. Things like that slip away easily, so I wrote it down.", "{detail} - a small moment, and it's what made today different."],
    neutral: ["You told me that {detail}. I've written it down so you can come back to it.", "What stayed after today's talk: {detail}."],
    heavyPlain: ["Today wasn't light, and you said it out loud rather than holding it alone. I'm keeping this conversation for you."],
    lightPlain: ["There was something gentle in your story today. I'm keeping it so it still makes you smile later."],
    neutralPlain: ["An ordinary conversation on an ordinary day. Those are worth remembering too."],
    endedLighter: ["By the end, you said you felt a little lighter."],
    standoutRepeat: ["You mentioned \"{phrase}\" a few times. That may be worth noticing.", "\"{phrase}\" keeps coming back in what you say."],
    standoutPerson: ["{person} came up more than anyone else today."],
    standoutQuote: ["The line that stayed with me: \"{quote}\"."],
    fallbackTopic: "life",
  },
};
