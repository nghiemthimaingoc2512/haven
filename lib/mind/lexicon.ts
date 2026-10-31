import type { Lang } from "@/lib/i18n";
import type { EmotionKey } from "@/lib/emotions";
import { stripDiacritics } from "@/lib/mind/normalize";

/**
 * The engine's vocabulary, written with full tone marks. Matching lives in
 * lib/mind/normalize.ts: marked input must match exactly, unmarked input
 * ("buon", "met moi") falls back to the bare form.
 *
 * Weights are rough: 1 = a clear signal, 0.6 = a hint that needs company.
 */

export type TopicKey =
  | "work"
  | "study"
  | "family"
  | "love"
  | "friends"
  | "health"
  | "sleep"
  | "money"
  | "future"
  | "self"
  | "loneliness"
  | "loss"
  | "change"
  | "procrastination"
  | "daily";

export type IntentKey =
  | "greeting"
  | "thanks"
  | "closing"
  | "crisis"
  | "ask_advice"
  | "ask_opinion"
  | "question"
  | "decision"
  | "good_news"
  | "venting"
  | "about_haven"
  | "feel_better";

interface Entry<K extends string> {
  key: K;
  terms: string[];
  weight?: number;
}

function table<K extends string>(rows: Array<[K, string[], number?]>): Entry<K>[] {
  return rows.map(([key, terms, weight]) => ({ key, terms, weight }));
}

const n = (terms: string[]): string[] => terms;

// ---------------------------------------------------------------- emotions

export const EMOTION_LEXICON: Record<Lang, Entry<EmotionKey>[]> = {
  vi: table<EmotionKey>([
    ["sad", ["buồn", "buồn bã", "tủi thân", "khóc", "muốn khóc", "chán nản", "hụt hẫng", "thất vọng", "nặng lòng", "đau lòng", "nhớ", "trống rỗng", "trống trải", "chán", "ủ rũ", "xuống tinh thần", "down", "sụp đổ", "tan nát"]],
    ["anxious", ["lo", "lo lắng", "lo âu", "bồn chồn", "hồi hộp", "căng thẳng", "stress", "bất an", "sợ", "sợ hãi", "hoảng", "hoang mang", "run", "áp lực", "không yên", "nơm nớp", "lo sợ", "ngại", "không dám", "nghĩ mãi", "cứ nghĩ", "ám ảnh"]],
    ["worried", ["băn khoăn", "phân vân", "không biết phải làm sao", "không biết nên", "rối", "rối bời", "mông lung", "mơ hồ", "lấn cấn", "do dự", "lưỡng lự"]],
    ["frustrated", ["bực", "bực mình", "khó chịu", "ức chế", "phát điên", "chịu không nổi", "bức xúc", "phiền", "ngán", "ngán ngẩm", "hết chịu nổi", "điên lên", "cay", "cay cú", "bất lực", "nản"]],
    ["angry", ["tức", "giận", "tức giận", "cáu", "nổi điên", "điên tiết", "ghét", "căm", "uất", "uất ức", "mắng", "bị mắng", "mắng oan", "bị la", "chửi", "đổ lỗi", "đổ oan", "không phải do mình", "không phải lỗi của mình", "bất công", "vô lý"]],
    ["overwhelmed", ["mệt", "mệt mỏi", "kiệt sức", "quá tải", "quá sức", "không thở nổi", "ngộp", "ngộp thở", "đuối", "rã rời", "không còn sức", "nhiều việc quá", "không kịp", "ngập", "burn out", "burnout", "cạn kiệt"]],
    ["happy", ["vui", "vui vẻ", "hạnh phúc", "sướng", "thích", "thích quá", "tuyệt", "tuyệt vời", "yêu quá", "đáng yêu", "dễ thương", "ngon", "phê", "tự hào", "hãnh diện", "thành công", "đậu", "được nhận", "trúng tuyển", "mừng", "mừng quá", "hào hứng", "thú vị", "cười", "buồn cười", "hài", "vui lắm", "tốt đẹp", "may mắn", "lâng lâng"]],
    ["calm", ["nhẹ nhõm", "thở phào", "thoải mái", "dễ chịu", "ổn", "ổn rồi", "tạm ổn", "bình thường", "không sao", "đỡ hơn", "đỡ rồi", "khá hơn", "ok", "okay"]],
    ["peaceful", ["bình yên", "yên bình", "thanh thản", "an yên", "tĩnh lặng", "nhẹ lòng", "thảnh thơi", "chill", "thư giãn"]],
    ["hopeful", ["hy vọng", "mong", "hi vọng", "tin là", "sẽ ổn", "cố gắng", "quyết tâm", "sẽ tốt hơn", "muốn thử", "háo hức", "mong chờ", "chờ đợi"]],
    ["inspired", ["cảm hứng", "có động lực", "động lực", "muốn làm", "ý tưởng", "bùng nổ", "truyền cảm hứng", "nhen nhóm", "thôi thúc"]],
  ]),
  en: table<EmotionKey>([
    ["sad", ["sad", "down", "upset", "cried", "crying", "tearful", "heartbroken", "hurt", "disappointed", "miserable", "empty", "hopeless", "blue", "gloomy", "miss", "grief", "low"]],
    ["anxious", ["anxious", "anxiety", "nervous", "worried", "scared", "afraid", "panic", "panicking", "stressed", "stress", "on edge", "uneasy", "tense", "pressure", "dread", "freaking out", "overthinking"]],
    ["worried", ["unsure", "torn", "confused", "don't know what to do", "not sure", "conflicted", "hesitant", "second-guessing", "lost"]],
    ["frustrated", ["frustrated", "annoyed", "irritated", "fed up", "sick of", "can't stand", "stuck", "helpless", "ugh", "so done", "exhausting"]],
    ["angry", ["angry", "mad", "furious", "pissed", "livid", "hate", "unfair", "blamed", "yelled at", "resent", "outraged"]],
    ["overwhelmed", ["overwhelmed", "exhausted", "drained", "burned out", "burnt out", "burnout", "too much", "can't keep up", "swamped", "tired", "worn out", "running on empty", "no energy"]],
    ["happy", ["happy", "glad", "excited", "thrilled", "love", "loved", "amazing", "awesome", "great", "wonderful", "delicious", "cute", "adorable", "proud", "nailed it", "passed", "got the job", "got in", "fun", "funny", "hilarious", "lol", "yay", "best day", "lucky"]],
    ["calm", ["relieved", "relief", "okay", "ok", "fine", "alright", "better", "settled", "comfortable", "at ease", "feel better"]],
    ["peaceful", ["peaceful", "calm", "serene", "content", "quiet", "relaxed", "chill", "still"]],
    ["hopeful", ["hopeful", "hope", "looking forward", "optimistic", "will be okay", "determined", "motivated to try", "can't wait"]],
    ["inspired", ["inspired", "motivated", "energized", "idea", "fired up", "creative", "driven"]],
  ]),
};

export const INTENSIFIERS: Record<Lang, string[]> = {
  vi: n(["rất", "quá", "lắm", "cực", "cực kỳ", "vô cùng", "siêu", "kinh khủng", "khủng khiếp", "thật sự", "thực sự", "hết sức", "muốn chết", "không chịu nổi", "vãi", "ghê", "dã man", "tột độ", "nhiều"]),
  en: n(["very", "so", "really", "extremely", "incredibly", "super", "totally", "completely", "absolutely", "terribly", "awfully", "insanely", "deeply"]),
};

export const DIMINISHERS: Record<Lang, string[]> = {
  vi: n(["hơi", "một chút", "chút", "tí", "một tí", "chút xíu", "nhẹ", "đôi khi", "thỉnh thoảng", "tạm"]),
  en: n(["a bit", "a little", "slightly", "kind of", "kinda", "sort of", "somewhat", "sometimes", "a tad"]),
};

export const NEGATORS: Record<Lang, string[]> = {
  vi: n(["không", "chẳng", "chả", "đâu có", "không hề", "không còn", "hết", "chưa", "không phải"]),
  en: n(["not", "no", "never", "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "can't", "hardly", "no longer", "not really"]),
};

// ------------------------------------------------------------------ topics

export const TOPIC_LEXICON: Record<Lang, Entry<TopicKey>[]> = {
  vi: table<TopicKey>([
    ["work", ["công việc", "việc làm", "đi làm", "sếp", "đồng nghiệp", "team", "deadline", "dự án", "công ty", "văn phòng", "họp", "khách hàng", "lương", "tăng ca", "ot", "kpi", "báo cáo", "nghỉ việc", "xin việc", "phỏng vấn", "thử việc", "cv", "nhân viên", "quản lý", "leader", "task", "job", "làm việc", "chuyển việc", "sa thải", "thất nghiệp", "mất việc", "nghề"]],
    ["study", ["học", "bài tập", "thi", "kỳ thi", "điểm", "trường", "lớp", "giảng viên", "thầy", "cô giáo", "đồ án", "luận văn", "tốt nghiệp", "đại học", "cao học", "thạc sĩ", "du học", "học bổng", "ôn thi", "thi lại", "môn", "deadline bài", "bài kiểm tra", "sinh viên", "học sinh"]],
    ["family", ["gia đình", "bố", "mẹ", "má", "cha", "ba mẹ", "ba má", "ba mình", "ba tôi", "bố mẹ", "cha mẹ", "phụ huynh", "ông bà", "họ hàng", "về quê", "con cái", "con mình", "chồng", "vợ", "anh trai", "chị gái", "em trai", "em gái"]],
    ["love", ["người yêu", "bạn trai", "bạn gái", "crush", "tình yêu", "yêu", "chia tay", "hẹn hò", "tỏ tình", "thích ai", "người ấy", "ny", "người cũ", "tình cảm", "cưới", "kết hôn", "mối quan hệ", "ghen", "nhắn tin", "seen", "bơ", "ex", "yêu xa", "cãi nhau với người yêu"]],
    ["friends", ["bạn bè", "bạn thân", "đứa bạn", "thằng bạn", "con bạn", "nhóm bạn", "hội bạn", "đi chơi", "tụ tập", "bạn cùng phòng", "roommate", "cãi nhau với bạn", "nói xấu", "bị bỏ rơi", "không rủ"]],
    ["health", ["sức khỏe", "ốm", "bệnh", "đau", "đau đầu", "đau bụng", "sốt", "bác sĩ", "bệnh viện", "khám", "thuốc", "xét nghiệm", "cân nặng", "giảm cân", "ăn uống", "tập gym", "tập thể dục", "chạy bộ", "đau lưng", "bị thương"]],
    ["sleep", ["ngủ", "mất ngủ", "thức khuya", "không ngủ được", "khó ngủ", "ngủ không ngon", "ác mộng", "thức trắng", "buồn ngủ", "dậy sớm", "thiếu ngủ"]],
    ["money", ["tiền", "lương", "nợ", "chi tiêu", "tiết kiệm", "hết tiền", "thiếu tiền", "vay", "trả nợ", "tài chính", "giá", "đắt", "mua", "thuê nhà", "tiền nhà", "hóa đơn", "đầu tư", "lỗ", "kinh tế"]],
    ["future", ["tương lai", "dự định", "kế hoạch", "mục tiêu", "định hướng", "sự nghiệp", "lộ trình", "sau này", "năm sau", "ước mơ", "muốn trở thành", "con đường", "lựa chọn", "quyết định", "chọn"]],
    ["self", ["bản thân", "tự ti", "kém cỏi", "vô dụng", "thất bại", "không đủ tốt", "không giỏi", "so sánh", "ghét mình", "tự trách", "giá trị", "tự tin", "ngoại hình", "xấu", "béo", "gầy", "mình là ai", "vô nghĩa", "không xứng đáng", "tội lỗi"]],
    ["loneliness", ["cô đơn", "một mình", "không ai", "không có ai", "lẻ loi", "không ai hiểu", "không ai để nói", "bị bỏ rơi", "trống trải", "xa nhà", "nhớ nhà", "sống một mình", "lạc lõng"]],
    ["loss", ["qua đời", "mất đi", "đã mất", "đám tang", "ra đi", "không còn nữa", "thú cưng chết", "chó chết", "mèo chết", "giỗ", "mãi mãi", "chia ly", "tang"]],
    ["change", ["chuyển nhà", "chuyển đến", "thành phố mới", "bắt đầu lại", "mới chuyển", "thay đổi", "môi trường mới", "lạ lẫm", "đi xa", "định cư", "chỗ mới", "nơi mới"]],
    ["procrastination", ["trì hoãn", "lười", "không làm được gì", "chưa bắt đầu", "để mai", "mất tập trung", "sao nhãng", "lướt điện thoại", "không có động lực", "trốn", "né", "chần chừ", "lần lữa"]],
    ["daily", ["hôm nay", "cà phê", "ăn", "phở", "bún", "trà sữa", "đi dạo", "mưa", "nắng", "trời", "cuối tuần", "phim", "sách", "nhạc", "game", "nấu ăn", "dọn nhà", "đi chợ", "mèo", "chó", "cây", "hoa", "đi bộ", "quán", "ngắm", "chụp ảnh", "du lịch", "chuyến đi"]],
  ]),
  en: table<TopicKey>([
    ["work", ["work", "job", "boss", "manager", "coworker", "colleague", "team", "deadline", "project", "office", "meeting", "client", "salary", "overtime", "kpi", "report", "quit", "interview", "resume", "career", "promotion", "fired", "laid off", "unemployed", "shift", "workload"]],
    ["study", ["study", "studying", "exam", "test", "grade", "grades", "school", "class", "professor", "teacher", "thesis", "assignment", "homework", "graduate", "university", "college", "masters", "scholarship", "semester", "student", "finals"]],
    ["family", ["family", "mom", "mum", "mother", "dad", "father", "parents", "brother", "sister", "sibling", "grandma", "grandpa", "home", "kids", "son", "daughter", "husband", "wife", "aunt", "uncle", "cousin"]],
    ["love", ["boyfriend", "girlfriend", "partner", "crush", "love", "breakup", "broke up", "dating", "date", "relationship", "ex", "married", "wedding", "texting", "ghosted", "jealous", "long distance", "fiancé", "fiancee"]],
    ["friends", ["friend", "friends", "best friend", "roommate", "hang out", "group chat", "left out", "excluded", "fell out", "drama"]],
    ["health", ["health", "sick", "ill", "pain", "headache", "stomach", "fever", "doctor", "hospital", "checkup", "medication", "meds", "diagnosis", "weight", "diet", "gym", "workout", "running", "injury", "back pain"]],
    ["sleep", ["sleep", "insomnia", "can't sleep", "couldn't sleep", "stayed up", "nightmare", "sleepless", "tired all day", "slept badly", "no sleep"]],
    ["money", ["money", "rent", "debt", "bills", "budget", "savings", "broke", "afford", "loan", "paycheck", "expensive", "finances", "invest", "lost money"]],
    ["future", ["future", "plan", "plans", "goal", "goals", "career path", "direction", "next year", "dream", "want to become", "decide", "decision", "choose", "choice", "path"]],
    ["self", ["myself", "worthless", "failure", "not good enough", "useless", "compare", "hate myself", "self-esteem", "confidence", "ugly", "fat", "who i am", "pointless", "don't deserve", "guilty", "guilt", "imposter"]],
    ["loneliness", ["lonely", "alone", "no one", "nobody", "isolated", "no one understands", "no one to talk to", "left out", "homesick", "far from home", "live alone", "disconnected"]],
    ["loss", ["passed away", "died", "death", "funeral", "lost my", "gone forever", "grief", "grieving", "pet died", "dog died", "cat died", "anniversary of"]],
    ["change", ["moved", "moving", "new city", "starting over", "new place", "relocated", "new environment", "unfamiliar", "fresh start"]],
    ["procrastination", ["procrastinate", "procrastinating", "lazy", "can't start", "haven't started", "put off", "putting off", "distracted", "scrolling", "no motivation", "avoiding", "stalling"]],
    ["daily", ["today", "coffee", "lunch", "dinner", "food", "walk", "rain", "sunny", "weather", "weekend", "movie", "book", "music", "game", "cooking", "cleaning", "cat", "dog", "plant", "flowers", "photo", "trip", "travel", "vacation"]],
  ]),
};

// ------------------------------------------------------------------ people

export interface PersonEntry {
  label: string;
  terms: string[];
}

// Kin terms double as pronouns in Vietnamese ("em", "anh", "con" = I/you), so
// those entries list only forms that can't be a pronoun ("em gái", "anh mình").
function people(rows: Array<[string, string[], boolean?]>): PersonEntry[] {
  return rows.map(([label, terms]) => ({ label, terms }));
}

export const PEOPLE_LEXICON: Record<Lang, PersonEntry[]> = {
  vi: people([
    ["sếp", ["sếp", "boss", "quản lý", "leader", "trưởng phòng", "giám đốc"]],
    ["đồng nghiệp", ["đồng nghiệp", "team", "người trong team"]],
    ["mẹ", ["mẹ", "má", "mẹ mình", "mẹ tôi"]],
    ["bố", ["bố", "cha", "bố mình", "ba mình", "ba tôi"]],
    ["bố mẹ", ["bố mẹ", "ba mẹ", "ba má", "phụ huynh", "cha mẹ"]],
    ["người yêu", ["người yêu", "ny", "bạn trai", "bạn gái", "người ấy", "crush", "người cũ", "ex"]],
    ["chồng", ["chồng", "ông xã"]],
    ["vợ", ["vợ", "bà xã"]],
    ["bạn thân", ["bạn thân", "best friend", "đứa bạn thân"]],
    ["bạn", ["bạn bè", "đứa bạn", "thằng bạn", "con bạn", "nhóm bạn", "hội bạn"]],
    ["bạn cùng phòng", ["bạn cùng phòng", "roommate"]],
    ["anh trai", ["anh trai", "anh mình", "ông anh"], true],
    ["chị gái", ["chị gái", "chị mình", "bà chị"], true],
    ["em", ["em trai", "em gái", "em mình", "đứa em"], true],
    ["con", ["con mình", "con tôi", "thằng bé", "con bé", "đứa nhỏ"], true],
    ["thầy cô", ["thầy", "cô giáo", "giảng viên", "giáo viên"]],
    ["khách hàng", ["khách hàng", "khách"]],
    ["bác sĩ", ["bác sĩ"]],
  ]),
  en: people([
    ["your boss", ["boss", "manager", "my lead", "supervisor"]],
    ["your coworkers", ["coworker", "coworkers", "colleague", "colleagues", "my team"]],
    ["your mom", ["mom", "mum", "mother"]],
    ["your dad", ["dad", "father"]],
    ["your parents", ["parents"]],
    ["your partner", ["partner", "boyfriend", "girlfriend", "crush", "my ex", "fiancé", "fiancee"]],
    ["your husband", ["husband"]],
    ["your wife", ["wife"]],
    ["your best friend", ["best friend", "bestie"]],
    ["your friends", ["friend", "friends"]],
    ["your roommate", ["roommate", "flatmate"]],
    ["your brother", ["brother"]],
    ["your sister", ["sister"]],
    ["your kids", ["my son", "my daughter", "my kids", "my child"]],
    ["your teacher", ["teacher", "professor", "prof"]],
    ["a client", ["client", "customer"]],
    ["the doctor", ["doctor"]],
  ]),
};

// ----------------------------------------------------------------- intents

export const INTENT_LEXICON: Record<Lang, Entry<IntentKey>[]> = {
  vi: table<IntentKey>([
    ["greeting", ["xin chào", "chào", "hello", "hi", "hế lô", "alo", "ê", "có ai không", "chào bạn", "hey"]],
    ["thanks", ["cảm ơn", "cám ơn", "thank", "thanks", "cảm ơn nha", "cảm ơn nhé", "biết ơn"]],
    ["closing", ["đi ngủ", "ngủ đây", "thôi mình đi", "tạm biệt", "bye", "bai", "hẹn gặp lại", "mai nói tiếp", "đi làm đây", "đi học đây", "thôi nhé", "vậy thôi", "dừng ở đây", "nói chuyện sau", "đi đây"]],
    ["feel_better", ["đỡ hơn rồi", "đỡ rồi", "nhẹ hơn rồi", "thấy ổn hơn", "khá hơn rồi", "thoải mái hơn", "nhẹ nhõm hơn", "được nói ra", "cảm ơn vì đã nghe"]],
    ["crisis", ["tự tử", "tự sát", "muốn chết", "không muốn sống", "kết thúc tất cả", "muốn biến mất", "tự làm đau", "tự hại", "rạch tay", "cắt tay", "không thiết sống", "chết đi cho xong", "chết cho rồi", "không muốn tồn tại", "uống thuốc cho xong"]],
    ["ask_advice", ["nên làm gì", "phải làm sao", "làm sao bây giờ", "làm thế nào", "có cách nào", "cho mình lời khuyên", "khuyên mình", "gợi ý", "giúp mình với", "mình nên", "tôi nên", "có nên", "nên không", "làm gì bây giờ", "xử lý thế nào", "giải quyết sao"]],
    ["ask_opinion", ["bạn nghĩ sao", "bạn thấy sao", "bạn nghĩ thế nào", "theo bạn", "ý bạn", "bạn thấy thế nào", "có đúng không", "mình có sai không", "mình sai ở đâu", "có phải mình"]],
    ["about_haven", ["bạn là ai", "bạn là gì", "bạn có phải ai", "bạn là ai vậy", "bạn tên gì", "haven là gì", "bạn có thật không", "bạn là robot", "bạn là máy", "bạn là người"]],
    ["good_news", ["tin vui", "mừng quá", "đậu rồi", "được nhận", "trúng tuyển", "thành công rồi", "xong rồi", "làm được rồi", "được tăng lương", "được khen", "thắng", "có tin vui", "tốt lắm", "tuyệt quá"]],
  ]),
  en: table<IntentKey>([
    ["greeting", ["hello", "hi", "hey", "hiya", "yo", "good morning", "good evening", "anyone there"]],
    ["thanks", ["thank you", "thanks", "thank u", "thx", "grateful", "appreciate it"]],
    ["closing", ["going to sleep", "going to bed", "gotta go", "talk later", "bye", "goodnight", "good night", "see you", "that's all", "i'm off", "heading out", "off to work", "off to class"]],
    ["feel_better", ["feel better", "feeling better", "lighter now", "that helped", "needed to say that", "glad i said it", "feel a bit better"]],
    ["crisis", ["suicide", "suicidal", "kill myself", "want to die", "don't want to live", "end it all", "disappear forever", "hurt myself", "self harm", "self-harm", "cut myself", "not worth living", "better off dead", "don't want to exist"]],
    ["ask_advice", ["what should i do", "what do i do", "how do i", "how can i", "any advice", "advise me", "help me", "should i", "what would you do", "how to handle", "how to deal"]],
    ["ask_opinion", ["what do you think", "do you think", "your opinion", "am i wrong", "am i overreacting", "is it just me", "was i wrong", "honest opinion", "thoughts"]],
    ["about_haven", ["who are you", "what are you", "are you real", "are you a bot", "are you human", "are you an ai", "what is haven", "your name"]],
    ["good_news", ["good news", "great news", "i passed", "got the job", "got in", "got accepted", "i did it", "finally did", "got promoted", "got a raise", "we won", "i won", "best news"]],
  ]),
};

/** Markers that make a message a question even without a lexicon hit. */
export const QUESTION_MARKERS: Record<Lang, string[]> = {
  vi: n(["không nhỉ", "được không", "có nên", "nên không", "liệu", "có phải", "tại sao", "vì sao", "thế nào", "làm sao", "bao giờ", "khi nào"]),
  en: n(["should i", "what if", "why", "how do", "is it", "do you", "would you", "could i", "can i"]),
};

/** Flip first-person into second-person so echoed fragments read naturally. */
export const PRONOUN_FLIPS: Record<Lang, Array<[RegExp, string]>> = {
  vi: [
    [/(?<!\p{L})(mình|tôi|tớ|tao|tui)(?!\p{L})/giu, "bạn"],
  ],
  en: [
    [/\bmyself\b/gi, "yourself"],
    [/\bI am\b/g, "you are"],
    [/\bI'm\b/g, "you're"],
    [/\bI've\b/g, "you've"],
    [/\bI'd\b/g, "you'd"],
    [/\bI'll\b/g, "you'll"],
    [/\bI\b/g, "you"],
    [/\bme\b/gi, "you"],
    [/\bmy\b/gi, "your"],
    [/\bmine\b/gi, "yours"],
    [/\bam\b/g, "are"],
  ],
};

// Stopwords compare on the bare form: a function word is one with or without marks.
function bare(terms: string[]): string[] {
  return terms.map((t) => stripDiacritics(t.toLowerCase()));
}

/** Function words skipped when hunting for a key phrase. */
export const STOPWORDS: Record<Lang, Set<string>> = {
  vi: new Set(bare(["và", "là", "của", "có", "không", "một", "những", "cho", "với", "này", "đã", "rất", "mình", "tôi", "bạn", "thì", "cũng", "vậy", "nên", "nữa", "ra", "đi", "lại", "về", "được", "như", "khi", "nếu", "nhưng", "hôm", "nay", "để", "mà", "còn", "sẽ", "đang", "đó", "gì", "ở", "cứ", "thấy", "bị", "làm", "lúc", "nó", "mới", "quá", "lắm", "rồi", "vì", "thế", "cả", "đến", "trong", "ơi", "nha", "nhé", "à", "ừ", "ờ", "hả", "em", "anh", "chị", "các", "người", "chuyện", "điều", "cái", "giờ", "nhiều", "chỉ", "luôn", "hơn", "thôi", "sao", "vẫn", "chưa", "tại", "do", "thật", "ạ", "ơ", "ư", "mãi", "hoài", "bây", "bao", "vừa", "nữa"])),
  en: new Set(bare(["the", "and", "a", "an", "to", "of", "in", "is", "it", "that", "i", "you", "was", "for", "on", "with", "as", "be", "this", "have", "not", "are", "but", "my", "me", "so", "just", "at", "or", "if", "we", "do", "did", "am", "im", "its", "were", "been", "has", "had", "he", "she", "they", "them", "his", "her", "our", "about", "from", "like", "really", "very", "then", "than", "there", "when", "what", "how", "why", "who", "because", "cause", "get", "got", "today", "now", "all", "some", "out", "up", "down", "into", "over", "also", "even", "still", "too", "can", "cant", "dont", "didnt", "doesnt", "will", "would", "could", "should", "feel", "feeling", "felt", "know", "think", "thing", "things", "kind", "lot", "much", "more", "most", "any", "no", "yes", "ok", "okay", "day", "time", "way", "one"])),
};
