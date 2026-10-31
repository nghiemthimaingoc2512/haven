import type { Knowledge } from "@/lib/mind/knowledge";

/**
 * Vietnamese knowledge base. Voice: a close friend texting - "mình/bạn",
 * short, specific, no therapist-speak. Rules from docs/15: never "cảm ơn
 * bạn đã chia sẻ", never "mình hiểu cảm giác của bạn", never a line that
 * could be pasted onto anyone.
 */
export const KNOWLEDGE_VI: Knowledge = {
  topics: {
    work: {
      label: "công việc",
      followUps: [
        "Chuyện với {person} như vậy có hay xảy ra không, hay hôm nay là lần đầu?",
        "[if:không nói|không dám|im lặng|nhịn] Lúc đó bạn đã muốn nói gì mà rồi lại thôi?",
        "Nếu bỏ qua chuyện hôm nay, công việc này còn điều gì khiến bạn muốn ở lại không?",
        "Cái mệt này là mệt vì khối lượng việc, hay mệt vì người ta?",
        "Có ai ở chỗ làm mà bạn nói được chuyện này không?",
        "Nếu ngày mai {phrase} vẫn y như vậy, điều gì sẽ khó chịu nhất với bạn?",
      ],
      observations: [
        "[if:mắng|chửi|nói trước|trước mặt|trước cả] Bị nói trước mặt người khác bao giờ cũng nặng hơn nội dung bị nói rất nhiều.",
        "Nghe như bạn đã cố gắng nhiều hơn mức người ta nhìn thấy.",
        "[if:công nhận|ghi nhận|không ai thấy|không được khen|chê] Có vẻ cái khó không phải là việc, mà là cảm giác không được công nhận.",
        "Công việc chiếm hơn nửa ngày của mình, nên nó chạm vào tâm trạng là đúng rồi.",
      ],
      suggestions: [
        "Nếu muốn nói lại với {person}, chọn lúc riêng tư và nói về việc cụ thể, kiểu \"em muốn làm rõ chuyện hôm nay\", thay vì về cảm xúc. Thường người ta nghe được hơn.",
        "Thử viết ra ba điều bạn thật sự muốn từ công việc này. Nếu hai trong ba không còn ở đây nữa thì câu trả lời đã khá rõ.",
        "Trước khi quyết định gì lớn, cho mình một tuần quan sát: ghi lại mỗi ngày một điều tốt và một điều tệ ở chỗ làm. Nhìn cả tuần sẽ công bằng hơn nhìn một hôm.",
        "[if:deadline|nhiều việc|không kịp|quá tải] Với deadline dồn, chọn đúng một việc quan trọng nhất và nói rõ với {person} những việc còn lại sẽ trễ. Nói trước bao giờ cũng dễ hơn xin lỗi sau.",
      ],
      reframes: [
        "[if:mắng|chửi|đổ lỗi|chê] Bạn đang coi chuyện này là về năng lực của mình. Nhưng cách {person} phản ứng có thể nói về {person} nhiều hơn là về bạn.",
        "[if:phải ở lại|buộc phải ở lại] Bạn nói \"phải\" ở lại. Ai đặt ra chữ \"phải\" đó - là điều kiện thật, hay là nỗi sợ thay đổi?",
        "[if:nghỉ việc|chuyển việc|ở lại] Có thể vấn đề không phải chọn ở hay đi, mà là ở lại theo cách nào.",
      ],
      steps: [
        "Tuần này nói chuyện riêng với {person} 15 phút, chỉ về một việc cụ thể.",
        "Viết ra ba điều bạn muốn ở công việc tiếp theo, bất kể là ở đây hay nơi khác.",
        "Cập nhật CV - không phải để nộp, mà để nhìn rõ mình đã làm được gì.",
        "Chọn một việc trong tuần để làm thật tốt và tự ghi nhận nó, không chờ ai khen.",
      ],
      auroraOpeners: [
        "Nếu mọi thứ ở chỗ làm cứ như bây giờ thêm sáu tháng nữa, bạn sẽ thấy sao?",
        "Điều khiến bạn khó chịu nhất ở đây là việc, là người, hay là cảm giác mình đang giậm chân?",
      ],
    },
    study: {
      label: "học tập",
      followUps: [
        "Bạn đang lo về kết quả, hay lo về việc chưa bắt đầu được?",
        "Môn này khó vì nội dung, hay vì cách nó được dạy?",
        "[if:điểm|thi] Nếu điểm không như ý thì điều bạn sợ nhất là gì - bản thân thất vọng, hay người khác thất vọng?",
        "Lần gần nhất bạn học mà thấy vào, hôm đó khác gì hôm nay?",
      ],
      observations: [
        "[if:thi|kỳ thi|thi lại|ôn thi] Kỳ thi làm mọi thứ trông như sống chết, trong khi nó chỉ là một mốc trong nhiều mốc.",
        "Nghe như bạn đang học bằng nỗi sợ hơn là bằng tò mò, và nỗi sợ thì mệt lắm.",
        "Có vẻ bạn đang tự đặt cho mình chuẩn mà chính bạn cũng không chắc ai đặt ra.",
      ],
      suggestions: [
        "Chia nhỏ tới mức hơi buồn cười: không phải \"ôn chương 3\" mà là \"đọc 2 trang đầu chương 3\". Cái đầu dễ bắt đầu hơn với việc nhỏ.",
        "Học 25 phút rồi nghỉ 5 phút, lặp lại. Không cần giỏi, chỉ cần ngồi xuống được.",
        "Nếu một môn kéo cả tinh thần xuống, hỏi thẳng thầy cô hoặc bạn học giỏi môn đó một câu cụ thể. Một câu hỏi tốt tiết kiệm được cả buổi tối tự mò.",
      ],
      reframes: [
        "[if:điểm|thi] Bạn gắn điểm số với giá trị của mình. Nhưng bạn có đánh giá bạn bè mình bằng điểm của họ không?",
        "[if:phải đậu|phải qua|phải được] \"Phải đậu\" nghe như không còn đường nào khác. Nếu không đậu, chuyện gì thật sự xảy ra?",
      ],
      steps: [
        "Tối nay chỉ học đúng 25 phút phần khó nhất, rồi dừng.",
        "Viết ra ba câu hỏi cụ thể để hỏi thầy cô hoặc bạn trong tuần.",
        "Lập một thời khóa biểu cho ba ngày tới thôi, không phải cả kỳ.",
      ],
      auroraOpeners: [
        "Điều bạn muốn ở việc học này là điểm, là hiểu, hay là một cánh cửa sau đó?",
        "Lúc nào trong ngày bạn học hiệu quả nhất, và bạn có đang dùng khung giờ đó không?",
      ],
    },
    family: {
      label: "gia đình",
      followUps: [
        "Chuyện với {person} như vậy, bạn đã nói ra được bao nhiêu phần điều mình nghĩ?",
        "Bạn muốn {person} hiểu điều gì nhất mà họ chưa hiểu?",
        "Gia đình mình có hay nói chuyện thẳng với nhau không, hay thường để trong lòng?",
        "Lúc nào gần đây bạn và {person} còn thoải mái với nhau?",
        "Điều này làm bạn buồn, hay làm bạn thấy có lỗi?",
      ],
      observations: [
        "[if:cãi|giận|mâu thuẫn|mắng] Với gia đình, cãi nhau thường không phải vì chuyện đó, mà vì cả hai đều muốn được hiểu.",
        "Người thân là nơi mình mong được hiểu nhất, nên khi không được hiểu nó đau gấp đôi.",
        "Nghe như bạn đang vừa thương {person}, vừa mệt vì {person}. Hai điều đó ở cùng nhau được.",
        "Có vẻ bạn đã giữ điều này một mình khá lâu rồi.",
      ],
      suggestions: [
        "Với {person}, nói về mình thay vì về họ: \"con thấy buồn khi…\" nghe được hơn \"mẹ lúc nào cũng…\". Đổi một câu thôi đã khác.",
        "Nếu nói chuyện trực tiếp khó, một tin nhắn ngắn tối nay cũng được. Không cần giải quyết hết, chỉ cần mở lại cánh cửa.",
        "Cho phép mình không phải là người hiểu chuyện lúc nào cũng được. Bạn cũng là người cần được thương.",
      ],
      reframes: [
        "Bạn đang cố thay đổi cách {person} nghĩ. Nếu điều đó không thể, bạn còn thay đổi được điều gì ở phía mình?",
        "\"Gia đình thì phải…\" - câu đó của ai? Bạn có thật sự đồng ý với nó không?",
      ],
      steps: [
        "Nhắn cho {person} một câu không liên quan đến chuyện cãi nhau, chỉ hỏi thăm.",
        "Viết ra điều bạn muốn nói với {person}, dù chưa gửi.",
        "Chọn một chuyện nhỏ để nhường, và một chuyện bạn sẽ giữ lập trường.",
      ],
      auroraOpeners: [
        "Bạn muốn mối quan hệ với {person} sẽ như thế nào, nếu được chọn?",
        "Điều bạn cần lúc này là {person} thay đổi, hay là bạn được nhẹ lòng?",
      ],
    },
    love: {
      label: "tình cảm",
      followUps: [
        "[if:chia tay|nhớ|người cũ] Bạn nhớ người đó, hay nhớ cảm giác có ai đó?",
        "Chuyện này là mới xảy ra, hay là giọt nước tràn ly?",
        "Nếu {person} đọc được điều bạn vừa viết, bạn nghĩ họ sẽ nói gì?",
        "Điều bạn cần từ mối quan hệ này mà chưa có là gì?",
        "[if:nhắn|tin nhắn|seen|bơ] Bạn đang chờ một tin nhắn, hay chờ một câu trả lời cho chính mình?",
      ],
      observations: [
        "[if:chia tay|người cũ] Chia tay làm người ta đau không chỉ vì mất ai đó, mà vì mất cả tương lai mình từng hình dung.",
        "[if:nhắn|tin nhắn] Nghe như bạn đang vừa muốn nhắn, vừa biết là không nên. Cái giằng co đó mệt hơn chính nỗi buồn.",
        "[if:tin nhắn cũ|đọc lại] Đọc tin nhắn cũ là cách mình níu lại một thứ đã qua. Ai cũng làm thế, và nó không sai.",
        "[if:yêu xa] Yêu xa khó không phải vì khoảng cách, mà vì mỗi lần nhớ đều phải tự xử lý một mình.",
      ],
      suggestions: [
        "[if:nhắn|muốn nhắn] Nếu đang muốn nhắn cho {person}, cho mình 24 giờ. Nếu sau một ngày vẫn muốn nhắn thì nhắn - lúc đó là bạn chọn, không phải cảm xúc chọn.",
        "Viết hết những gì muốn nói với {person} ra giấy. Không gửi. Phần lớn cái mình cần là được nói ra, không phải được trả lời.",
        "Nếu cứ mắc kẹt với chuyện này, hỏi mình: mối quan hệ này cho mình thêm năng lượng hay lấy đi? Trả lời thành thật, không cần quyết gì ngay.",
      ],
      reframes: [
        "[if:quay lại|níu kéo] Bạn đang hỏi làm sao để họ quay lại. Câu hỏi khác là: nếu họ quay lại, điều gì sẽ khác đi?",
        "[if:không có ai tốt hơn|không ai tốt hơn] \"Không có ai tốt hơn\" là câu nói của người đang đau, không phải của người đang nhìn rõ.",
        "[if:thay đổi vì|chiều|vừa lòng] Bạn đang thay đổi mình để vừa với họ. Bạn có từng mong điều ngược lại không?",
      ],
      steps: [
        "[if:tin nhắn cũ|đọc lại] Tuần này chọn một tối không mở lại tin nhắn cũ, làm việc gì đó bằng tay.",
        "Nói thẳng với {person} một điều bạn cần, bằng một câu, không giải thích dài.",
        "Hẹn một người bạn mà lâu rồi bạn chưa gặp vì bận yêu.",
      ],
      auroraOpeners: [
        "Điều bạn muốn ở mối quan hệ này là gì, nếu nói bằng một câu?",
        "Nếu bạn thân của bạn đang ở trong đúng tình huống này, bạn sẽ nói gì với họ?",
      ],
    },
    friends: {
      label: "bạn bè",
      followUps: [
        "Chuyện với {person} là hiểu lầm, hay là khác nhau thật?",
        "Bạn muốn giữ tình bạn này đến mức nào?",
        "[if:không rủ|bỏ rơi|bị bỏ] Cảm giác bị bỏ lại, nó đến từ chuyện này, hay nó có từ trước rồi?",
        "Nếu {person} chủ động nhắn trước, bạn có muốn nói chuyện lại không?",
      ],
      observations: [
        "[if:xa nhau|xa dần|không còn thân|ít gặp] Bạn bè lớn lên rồi tự nhiên xa nhau - đau ở chỗ không ai làm gì sai cả.",
        "[if:chủ động|toàn mình|luôn là mình] Nghe như bạn là người hay chủ động, và lần này mệt vì phải chủ động nữa.",
        "[if:không rủ|bỏ rơi|bị bỏ] Bị không rủ thường đau hơn là nói ra, vì nó làm mình tự hỏi mình có quan trọng không.",
      ],
      suggestions: [
        "Nhắn cho {person} một câu ngắn, không trách, chỉ là \"dạo này tao thấy hơi xa, mày ổn không?\". Người ta thường đáp lại sự thẳng thắn.",
        "Thay vì chờ được rủ, rủ trước một người, một việc nhỏ thôi. Cảm giác bị bỏ rơi giảm nhanh khi mình là người mở lời.",
        "Nếu một tình bạn chỉ còn mình cố, cho phép mình buông bớt. Không cần cắt đứt, chỉ bớt cố.",
      ],
      reframes: [
        "[if:im lặng|không trả lời|seen|bơ] Bạn đang đọc im lặng của {person} như là từ chối. Còn cách đọc nào khác không?",
        "\"Bạn thân thì phải hiểu mình\" - nhưng bạn đã nói cho họ biết cách để hiểu chưa?",
      ],
      steps: [
        "Nhắn cho {person} trong hôm nay, một câu thôi.",
        "Rủ một người đi ăn trong tuần này, không chờ ai rủ.",
        "Ghi ra hai người bạn mà ở cạnh bạn thấy mình là mình nhất.",
      ],
      auroraOpeners: [
        "Trong tình bạn này, bạn đang là người cho nhiều hơn hay nhận nhiều hơn?",
        "Bạn muốn giải quyết chuyện với {person}, hay muốn hiểu vì sao nó làm bạn buồn vậy?",
      ],
    },
    health: {
      label: "sức khỏe",
      followUps: [
        "Bạn đã đi khám chưa, hay đang tự chịu?",
        "[if:bệnh|ốm|đau|khám|xét nghiệm] Cái lo này là lo về cơ thể, hay lo về những thứ sẽ phải bỏ dở nếu bệnh?",
        "Dạo này bạn ăn với ngủ có đủ không?",
        "Có ai biết bạn đang không khỏe không?",
      ],
      observations: [
        "Khi cơ thể mệt, mọi chuyện khác đều trông nặng hơn thật.",
        "Nghe như bạn đã lờ đi cái mệt này một thời gian rồi.",
        "[if:xét nghiệm|kết quả|khám] Chờ kết quả khám là một kiểu lo rất riêng - không làm gì được, chỉ chờ.",
      ],
      suggestions: [
        "Nếu đau hoặc mệt kéo dài hơn một tuần, đi khám. Không phải vì nghiêm trọng, mà để thôi phải đoán.",
        "Tối nay chỉ cần một việc: ngủ sớm hơn 30 phút. Mọi thứ khác để mai.",
        "Mình không phải bác sĩ, nhưng có một điều chắc: cơ thể mệt thì tâm trạng không thể tự tốt lên được. Ưu tiên nó trước.",
      ],
      reframes: [
        "Bạn coi việc nghỉ là lười. Nhưng cơ thể đang nói với bạn điều gì đó, và bạn đang không nghe.",
      ],
      steps: [
        "Đặt lịch khám trong tuần này, hoặc gọi hỏi một người biết về y tế.",
        "Ba tối liên tiếp ngủ trước 11 giờ, chỉ vậy thôi.",
        "Đi bộ 15 phút mỗi ngày, không cần nhanh.",
      ],
      auroraOpeners: [
        "Điều bạn đang lo nhất là triệu chứng, hay là việc không biết nó là gì?",
      ],
    },
    sleep: {
      label: "giấc ngủ",
      followUps: [
        "Bạn không ngủ được vì đầu không dừng nghĩ, hay vì cơ thể không mệt?",
        "Khi nằm đó, thường bạn nghĩ về chuyện gì nhiều nhất?",
        "[if:mất ngủ|không ngủ được|khó ngủ] Mất ngủ mấy đêm rồi?",
      ],
      observations: [
        "[if:mất ngủ|thức khuya|không ngủ được|khó ngủ] Hai giờ sáng là lúc mọi vấn đề trông to gấp ba lần ban ngày.",
        "Thiếu ngủ làm mình dễ buồn, dễ cáu hơn - nên có thể một phần cái nặng hôm nay là vì đêm qua.",
      ],
      suggestions: [
        "Nếu nằm 20 phút không ngủ được, dậy, ra khỏi giường, làm việc gì chán chán dưới ánh sáng mờ, rồi quay lại. Giường chỉ để ngủ.",
        "Viết hết những gì đang quanh quẩn ra giấy trước khi nằm. Đầu thường chịu buông khi biết đã có chỗ giữ.",
        "Thử thở 4-7-8: hít 4 giây, giữ 7, thở ra 8. Ba vòng thôi. Có nút \"Hít thở cùng nhau\" ở trang chủ buổi tối.",
      ],
      reframes: [],
      steps: [
        "Tối nay tắt màn hình 30 phút trước khi nằm.",
        "Viết ra ba thứ đang lo lên giấy để đó, mai đọc lại.",
      ],
      auroraOpeners: [
        "Giấc ngủ xấu đi từ khi nào - có chuyện gì bắt đầu cùng lúc không?",
      ],
    },
    money: {
      label: "tiền bạc",
      followUps: [
        "Cái lo này là lo tháng này, hay lo dài hạn?",
        "Bạn có người nào để bàn chuyện tiền mà không bị phán xét không?",
        "Chuyện tiền làm bạn lo, hay làm bạn thấy xấu hổ?",
      ],
      observations: [
        "Lo tiền là cái lo rất thật, không phải nghĩ tích cực mà hết được.",
        "Nghe như bạn đang gánh phần này một mình, mà tiền thì ít ai dám kể.",
        "Thiếu tiền làm người ta mệt không chỉ vì thiếu, mà vì phải tính toán từng thứ cả ngày.",
      ],
      suggestions: [
        "Ghi hết các khoản ra một tờ giấy, kể cả khoản nhỏ. Nhìn thấy con số thật thường bớt sợ hơn con số trong đầu.",
        "Nếu có nợ, gọi cho bên cho vay nói chuyện trước khi trễ. Họ gần như luôn có phương án, và nói trước dễ hơn nhiều.",
        "Tìm một khoản cố định cắt được trong tháng này, chỉ một thôi. Không cần giải quyết hết, chỉ cần thấy mình kiểm soát được một thứ.",
      ],
      reframes: [
        "Bạn gắn tiền với việc mình có ổn hay không với tư cách con người. Hai thứ đó tách ra được không?",
      ],
      steps: [
        "Tối nay liệt kê thu chi tháng này, thô cũng được.",
        "Chọn một khoản để cắt hoặc hoãn trong tuần.",
        "Nói chuyện tiền với một người bạn tin, dù chỉ 10 phút.",
      ],
      auroraOpeners: [
        "Nếu tiền không phải vấn đề, bạn sẽ chọn gì? Câu trả lời đó cho biết bạn thật sự muốn gì.",
      ],
    },
    future: {
      label: "tương lai",
      followUps: [
        "Bạn đang phân vân giữa những lựa chọn thật, hay đang sợ chọn sai?",
        "Nếu chọn sai, điều tệ nhất có thể xảy ra là gì - và nó có sửa được không?",
        "Trong những điều bạn đang cân nhắc, cái nào bạn muốn, cái nào bạn thấy \"nên\"?",
        "Ai là người bạn đang sợ làm thất vọng nếu chọn khác đi?",
      ],
      observations: [
        "Mông lung về tương lai thường không phải vì thiếu lựa chọn, mà vì có quá nhiều và không cái nào chắc.",
        "Nghe như bạn đang cố nhìn hết cả con đường, trong khi chỉ cần thấy bước tiếp theo.",
        "Có vẻ bạn biết mình muốn gì rồi, chỉ là chưa dám nói ra thành lời.",
      ],
      suggestions: [
        "Thử tưởng tượng một năm sau, bạn đã chọn A. Viết một đoạn ngắn về một ngày bình thường lúc đó. Rồi làm lại với B. Cái nào bạn viết dễ hơn thường là cái bạn muốn.",
        "Chia quyết định lớn thành một quyết định nhỏ có thể thử trong hai tuần. Thử một chút rồi mới biết, hơn là nghĩ mãi.",
        "Hỏi một người đã đi con đường bạn đang cân nhắc, không phải để xin lời khuyên, mà để nghe một ngày của họ như thế nào.",
      ],
      reframes: [
        "Bạn đang tìm lựa chọn đúng. Có thể không có lựa chọn đúng, chỉ có lựa chọn bạn sẽ làm cho đúng.",
        "\"Lỡ chọn sai\" - bạn đã từng chọn sai điều gì trước đây chưa, và giờ bạn đang ở đâu?",
        "Bạn đang hỏi \"nên làm gì\", nhưng câu hỏi thật có vẻ là \"mình có được phép muốn điều đó không\".",
      ],
      steps: [
        "Viết hai đoạn: một ngày của bạn sau một năm nếu chọn {a}, và nếu chọn {b}.",
        "Tìm một người đã làm điều bạn đang cân nhắc và hỏi họ một câu.",
        "Chọn một việc nhỏ có thể thử trong hai tuần để kiểm tra hướng đi, không cần cam kết gì.",
      ],
      auroraOpeners: [
        "Nếu không ai biết bạn chọn gì, không ai đánh giá, bạn sẽ chọn gì?",
        "Điều bạn đang cân nhắc là một quyết định, hay là một nỗi sợ đang mặc áo quyết định?",
      ],
    },
    self: {
      label: "bản thân",
      followUps: [
        "[if:kém|kém cỏi|không giỏi|không đủ tốt] Giọng nói \"mình kém\" đó, nó giống giọng của ai trong đời bạn?",
        "[if:so sánh|so với] Bạn đang so mình với ai, và bạn có thấy hết cuộc sống của họ không?",
        "Nếu một người bạn thân nói y như bạn vừa nói về chính họ, bạn sẽ trả lời họ thế nào?",
        "Lần gần nhất bạn thấy mình ổn là khi nào, lúc đó bạn đang làm gì?",
      ],
      observations: [
        "[if:thất bại] Cảm giác \"mình là một thất bại\" thường đến sau một chuyện cụ thể, rồi tự lan ra cả con người. Chuyện cụ thể đó nhỏ hơn cái cảm giác nhiều.",
        "Bạn đang chấm điểm mình bằng thang mà bạn không bao giờ dùng cho người khác.",
        "[if:vô dụng] Người thật sự vô dụng thì không ngồi đây tự hỏi mình có vô dụng không.",
        "Nghe như bạn khắt khe với mình hơn bất kỳ ai khác từng khắt khe với bạn.",
      ],
      suggestions: [
        "Viết ra ba việc bạn đã làm được trong tuần, nhỏ cũng tính. Không phải để tự khen, mà để có bằng chứng ngược với giọng nói kia.",
        "[if:kém|kém cỏi|không giỏi|không đủ tốt] Khi giọng \"mình kém\" lên tiếng, hỏi lại nó: \"kém so với ai, ở việc gì, hôm nào?\". Nó thường không trả lời được cụ thể.",
        "Giảm bớt lướt mạng xã hội vài ngày. So sánh với phiên bản được chọn lọc của người khác là cuộc đua không ai thắng.",
      ],
      reframes: [
        "[if:thất bại] Bạn đang nói \"mình thất bại\" như một bản án. Nhưng một việc không thành là một sự kiện, không phải một danh tính.",
        "Bạn muốn tự tin trước rồi mới làm. Thường thì ngược lại: làm trước, tự tin đến sau.",
      ],
      steps: [
        "Mỗi tối ghi một việc bạn đã làm được trong ngày, dù nhỏ.",
        "Chọn một việc nhỏ bạn giỏi và làm nó trong tuần này, chỉ vì bạn giỏi nó.",
        "Nói chuyện với một người luôn thấy bạn ổn, và tin họ một chút.",
      ],
      auroraOpeners: [
        "Bạn thấy mình thất bại ở việc gì cụ thể, hay là một cảm giác chung chung?",
        "\"Đủ tốt\" theo bạn là như thế nào - bạn đã bao giờ định nghĩa nó chưa?",
      ],
    },
    loneliness: {
      label: "cô đơn",
      followUps: [
        "Cô đơn kiểu không có ai bên cạnh, hay có người bên cạnh mà vẫn thấy một mình?",
        "Lần gần nhất bạn thấy được hiểu là khi nào?",
        "Có ai bạn muốn nhắn mà đang ngại không?",
        "[if:chuyển|thành phố|mới đến|xa nhà] Chuyển đến đây được bao lâu rồi?",
      ],
      observations: [
        "Cô đơn là cảm giác khó kể nhất, vì kể ra thì sợ người ta thấy mình đáng thương.",
        "[if:sống một mình|ở một mình] Sống một mình, cái khó không phải là tối, mà là không có ai để kể chuyện nhỏ trong ngày.",
        "Nghe như bạn đang thiếu không phải người, mà thiếu một người thật sự nhìn thấy bạn.",
        "Bạn vừa kể điều này ra đây - nghĩa là bạn vẫn đang với tay, và điều đó quan trọng.",
      ],
      suggestions: [
        "Nhắn cho một người, bất kỳ ai, một câu không cần lý do: \"tự nhiên nhớ mày\". Phần lớn người ta mừng khi nhận được.",
        "Tìm một chỗ có người mà không cần nói chuyện: quán cà phê, lớp học gì đó, chạy bộ nhóm. Ở gần người khác đã bớt một nửa.",
        "Đặt một lịch cố định với ai đó, kiểu mỗi tối thứ năm gọi cho mẹ hoặc ăn với bạn. Cô đơn sợ nhất là lịch.",
      ],
      reframes: [
        "Bạn đang chờ ai đó tìm đến mình. Nếu đổi chỗ, bạn có muốn được tìm đến không? Người ta cũng vậy.",
        "[if:không ai hiểu|không ai] \"Không ai hiểu mình\" - bạn đã cho ai cơ hội để hiểu chưa, hay bạn đã đoán trước họ sẽ không?",
      ],
      steps: [
        "Nhắn cho một người trong hôm nay, không cần lý do.",
        "Tuần này đến một chỗ có người quen mặt: quán quen, lớp học, nhà thờ, chùa, câu lạc bộ.",
        "Gọi cho {person} 10 phút.",
      ],
      auroraOpeners: [
        "Bạn muốn có nhiều người hơn, hay muốn một người hiểu bạn hơn?",
      ],
    },
    loss: {
      label: "mất mát",
      followUps: [
        "Bạn có muốn kể cho mình về người đó không, dù chỉ một chuyện nhỏ?",
        "Hôm nay điều gì làm bạn nhớ đến họ?",
        "Bạn có ai để cùng nhớ về họ không?",
      ],
      observations: [
        "Mất một ai đó không có cách nào đúng để đau. Hôm nay bạn đau thế nào thì nó đúng thế ấy.",
        "Nỗi nhớ không giảm đi, chỉ là cuộc sống lớn dần lên xung quanh nó.",
        "Người ta hay nói \"rồi sẽ qua\", nhưng mình nghĩ nó không qua, nó chỉ đổi hình.",
        "Mình ở đây. Không cần nói gì thêm cũng được.",
      ],
      suggestions: [
        "Nếu được, viết cho họ một lá thư. Kể họ nghe hôm nay. Không ai đọc cũng không sao.",
        "Cho phép mình có những ngày không ổn mà không cần giải thích với ai.",
        "Giữ lại một thói quen nhỏ gắn với họ - món ăn, bài hát, chỗ ngồi. Nhớ không phải là mắc kẹt.",
      ],
      reframes: [
        "[if:tự trách|lỗi của mình|đáng lẽ|giá như] Bạn đang trách mình vì đã không làm gì đó. Nhưng bạn đã làm với những gì bạn biết lúc ấy.",
      ],
      steps: [
        "Viết cho họ vài dòng tối nay.",
        "Kể cho một người về họ, một kỷ niệm thôi.",
        "Cho phép mình một ngày không phải ổn.",
      ],
      auroraOpeners: [
        "Mình nghĩ lúc này không phải lúc để giải quyết gì. Bạn muốn kể cho mình nghe về họ không?",
      ],
    },
    change: {
      label: "thay đổi",
      followUps: [
        "Cái lạ này là lạ chỗ, lạ người, hay lạ chính mình ở chỗ mới?",
        "Điều gì ở chỗ cũ mà bạn nhớ nhất?",
        "Bạn đã tìm được một chỗ nào ở đây làm bạn thấy dễ chịu chưa, dù là một quán nhỏ?",
      ],
      observations: [
        "Mới chuyển đến đâu cũng có một khoảng mọi thứ đều hơi sai sai. Nó là bình thường, không phải dấu hiệu chọn sai.",
        "Bắt đầu lại mệt vì mọi thứ đều phải nghĩ, kể cả mua gì ở đâu.",
        "[if:nhớ chỗ cũ|nhớ nhà|chỗ cũ] Nghe như bạn đang nhớ không phải chỗ cũ, mà nhớ phiên bản mình ở chỗ cũ - người có bạn bè và biết đường.",
      ],
      suggestions: [
        "Chọn một quán, một con đường, một chỗ để thành \"chỗ của mình\" ở nơi mới. Quen một chỗ nhỏ trước, cả thành phố sau.",
        "Cho mình ba tháng trước khi kết luận gì về nơi này.",
        "Giữ một lịch gọi về chỗ cũ, nhưng cũng đặt một lịch làm gì đó mới mỗi tuần ở chỗ này.",
      ],
      reframes: [
        "Bạn so chỗ mới sau một tháng với chỗ cũ sau nhiều năm. Không công bằng với chỗ mới, và với bạn.",
      ],
      steps: [
        "Tìm một quán gần nhà và đến đó ba lần trong tuần.",
        "Nhận lời một cuộc rủ ở chỗ mới, dù hơi ngại.",
        "Gọi cho một người ở chỗ cũ kể về chỗ mới.",
      ],
      auroraOpeners: [
        "Bạn muốn chỗ mới giống chỗ cũ hơn, hay muốn mình ở chỗ mới khác đi?",
      ],
    },
    procrastination: {
      label: "trì hoãn",
      followUps: [
        "Việc bạn đang né, bước đầu tiên của nó là gì, cụ thể?",
        "Bạn trì hoãn vì việc đó chán, hay vì sợ làm không tốt?",
        "Lúc trì hoãn, bạn thường làm gì thay vào đó?",
        "Nếu việc này làm xong rồi, bạn sẽ thấy gì?",
      ],
      observations: [
        "Trì hoãn ít khi là lười. Thường là sợ: sợ làm không tốt, sợ nó khó, sợ phải đối diện.",
        "Cái mệt của trì hoãn là mệt gấp đôi: vừa không làm, vừa áy náy vì không làm.",
        "Nghe như trong đầu bạn việc đó đã to lên gấp mười lần kích thước thật.",
      ],
      suggestions: [
        "Hạ chuẩn xuống thấp đến mức buồn cười: không phải \"viết báo cáo\" mà là \"mở file và đặt tiêu đề\". Bắt đầu là phần khó nhất, phần sau tự chạy.",
        "Làm đúng 10 phút rồi được phép dừng. Phần lớn lần sẽ không dừng, nhưng cho phép dừng là cái làm mình dám bắt đầu.",
        "Nói với một người \"tối nay tao làm cái này\". Có người biết thì khó né hơn.",
      ],
      reframes: [
        "Bạn nghĩ cần có động lực rồi mới làm. Thường động lực đến sau khi làm được 5 phút, không phải trước.",
        "[if:lười] Bạn gọi mình là lười. Nhưng người lười không áy náy; bạn thì đang áy náy. Vậy nó là gì khác?",
      ],
      steps: [
        "Trong 24 giờ tới, làm đúng bước đầu tiên của việc đó trong 10 phút.",
        "Chia việc ra ba bước nhỏ và viết lên giấy dán trước mặt.",
        "Nói với một người bạn sẽ làm nó lúc mấy giờ.",
      ],
      auroraOpeners: [
        "Việc bạn đang trì hoãn, nếu làm xong thì mất bao lâu thật - và bạn đã dành bao lâu để né nó?",
        "Bạn sợ bắt đầu, hay sợ kết quả?",
      ],
    },
    daily: {
      label: "cuộc sống",
      followUps: [
        "Kể thêm đi, lúc đó bạn đang ở đâu?",
        "Điều gì làm khoảnh khắc đó đáng nhớ với bạn?",
        "Bạn có hay có những lúc như thế không, hay hôm nay đặc biệt?",
      ],
      observations: [
        "Những chuyện nhỏ như thế này là thứ làm một ngày thành ra đáng sống.",
        "Để ý được điều nhỏ như vậy là một kiểu khả năng, không phải ai cũng có.",
      ],
      suggestions: [],
      reframes: [],
      steps: [],
      auroraOpeners: [],
    },
  },

  emotions: {
    sad: {
      ack: [
        "Nghe buồn thật. {detail} - chuyện đó không nhỏ đâu.",
        "{detail}. Mình đọc mà thấy nặng theo.",
        "Buồn kiểu này thường không có chỗ để nói ra, nên mình mừng vì bạn nói ở đây.",
        "Nghe thật không dễ dàng.",
      ],
      stay: [
        "Mình ở đây. Không cần phải ổn ngay.",
        "Cứ buồn thêm một lúc cũng được, mình không đi đâu.",
        "Không cần nói gì hay ho. Mình vẫn nghe.",
      ],
    },
    anxious: {
      ack: [
        "Cái lo này nghe như đang quay vòng trong đầu bạn mãi không dừng.",
        "{detail} - lo là đúng rồi, ai ở vị trí bạn cũng lo.",
        "Nghe như bạn đang căng từ sáng đến giờ.",
        "Lo kiểu này mệt lắm, vì nó không cho mình nghỉ.",
      ],
      stay: [
        "Hít một hơi dài với mình đã. Chuyện vẫn ở đó, nhưng bạn không phải xử lý nó trong một phút này.",
        "Mình ở đây. Lo thì lo, nhưng không phải lo một mình.",
      ],
    },
    worried: {
      ack: [
        "Nghe như bạn đang rối giữa hai thứ đều có lý.",
        "{detail} - phân vân là vì bạn coi trọng cả hai phía.",
        "Lưỡng lự kiểu này mệt vì không chọn cũng là một kiểu chọn.",
      ],
      stay: ["Không cần quyết ngay. Cứ nói ra trước đã."],
    },
    frustrated: {
      ack: [
        "Nghe là thấy bực rồi. {detail}.",
        "Bực kiểu đó là bực chính đáng, không phải bạn nhỏ nhen.",
        "Ức chế nhất là khi mình làm đúng mà mọi thứ vẫn không ra.",
        "{detail} - ai gặp vậy cũng phát cáu.",
      ],
      stay: ["Xả ra hết đi, mình nghe. Không cần lịch sự.", "Cứ bực. Mình không bắt bạn phải bình tĩnh."],
    },
    angry: {
      ack: [
        "Tức là đúng rồi. {detail} - chuyện đó không công bằng.",
        "Nghe như bạn đã nhịn khá nhiều trước khi tức đến mức này.",
        "{detail}. Giận là phản ứng bình thường của người bị đối xử không đúng.",
      ],
      stay: ["Cứ nói hết ra. Ở đây không ai bắt bạn phải nhẹ nhàng.", "Mình nghe. Giận xong rồi tính."],
    },
    overwhelmed: {
      ack: [
        "[if:quá|kiệt sức|quá tải|kiệt|đuối|rã rời|không nổi] Nghe như hôm nay là một ngày quá sức, và bạn đã gánh gần hết một mình.",
        "{detail} - mệt kiểu đó không phải ngủ một giấc là hết.",
        "[if:quá tải|kiệt sức|không nổi|ngộp] Quá tải kiểu này làm người ta không còn chỗ để cảm thấy gì nữa.",
        "Bạn đã kéo được đến giờ này là đã nhiều rồi.",
        "Mệt thật ha.",
      ],
      stay: [
        "Không cần làm thêm gì tối nay. Chỉ cần ở đây một lúc.",
        "Mình không đưa thêm việc cho bạn đâu. Nghỉ chút đi.",
      ],
    },
    happy: {
      ack: [
        "Ơ hay vậy! {detail} - nghe vui ghê!",
        "Đọc xong mình cũng vui lây.",
        "Trời, tuyệt quá!",
        "Thích ghê, kể thêm đi!",
        "Hahaha dễ thương quá.",
      ],
      stay: [],
    },
    calm: {
      ack: [
        "Nhẹ cả người ha.",
        "Nghe ổn rồi, mừng cho bạn.",
        "Ừ, kiểu này nghe dễ thở hơn hôm trước.",
      ],
      stay: [],
    },
    peaceful: {
      ack: ["Nghe bình yên thật.", "Những lúc như này quý lắm, giữ lấy nhé.", "Ừm, nhẹ nhàng ha."],
      stay: [],
    },
    hopeful: {
      ack: [
        "Nghe trong giọng bạn có chút hy vọng, mình thích điều đó.",
        "{detail} - nghe như bạn đã sẵn sàng hơn bạn nghĩ.",
        "Có cái gì đó đang mở ra ha.",
      ],
      stay: [],
    },
    inspired: {
      ack: ["Nghe hào hứng ghê! Kể mình nghe ý tưởng đó đi.", "Cái năng lượng này hiếm lắm, đừng để nó trôi.", "Ơ, nghe có lửa rồi đó."],
      stay: [],
    },
    neutral: {
      ack: ["Ừm, mình nghe đây.", "Mình đang nghe.", "Rồi, kể tiếp đi."],
      stay: ["Mình vẫn ở đây."],
    },
  },

  general: {
    greeting: [
      "Chào bạn. Hôm nay của bạn thế nào rồi?",
      "Mình đây. Có chuyện gì muốn kể không?",
      "Chào bạn, mình ở đây. Hôm nay có gì mới không?",
    ],
    greetingReturning: [
      "Chào bạn. Lần trước bạn có kể về chuyện {topic} - dạo này sao rồi?",
      "Mình đây. Chuyện {topic} hôm trước, có gì mới không?",
    ],
    thanks: [
      "Không có gì đâu. Mình ở đây mà.",
      "Có gì đâu. Lúc nào muốn nói lại thì mình vẫn ở đây.",
      "Mình mừng vì giúp được chút gì. Nghỉ ngơi nhé.",
    ],
    closing: [
      "Ừ, đi nghỉ đi. Mai có gì kể mình nghe nhé.",
      "Ngủ ngon nhé. Mình giữ chuyện hôm nay cho bạn.",
      "Ừ, bạn đi nhé. Mình ở đây, lúc nào cũng được.",
      "Chúc bạn một ngày nhẹ nhàng. Có gì cứ quay lại.",
    ],
    feelBetter: [
      "Mừng là bạn thấy nhẹ hơn. Đôi khi chỉ cần nói ra là đã khác rồi.",
      "Nghe vậy mình mừng. Nhẹ hơn một chút cũng là đủ cho hôm nay.",
      "Ừ, nhẹ hơn là tốt rồi. Không cần phải hết hẳn.",
    ],
    crisis:
      "Mình đọc kỹ điều bạn vừa viết, và mình lo cho bạn thật lòng. Bạn không phải chịu một mình lúc này. Nếu bạn đang gặp nguy hiểm, hãy gọi 115 ngay, hoặc tìm một người bạn tin ở gần và nói với họ. Ở Việt Nam còn có Đường dây nóng Ngày Mai 096 306 1414, miễn phí, trực khoảng 13:00-20:30 một số ngày trong tuần. Mình chỉ là một chương trình nên không thay được những người đó, nhưng mình vẫn ở đây. Lúc này bạn có đang an toàn không?",
    aboutHaven: [
      "Mình là Thì Thầm, một phần của Haven. Mình là chương trình chứ không phải người thật, và mình hiểu theo những gì đã được dạy nên có lúc sẽ hiểu sai - cứ sửa mình nhé. Mọi thứ bạn kể chỉ nằm trên máy của bạn.",
      "Mình là Thì Thầm, bạn đồng hành trong Haven. Mình không phải bác sĩ hay người thật, nhưng mình đọc kỹ và nhớ những gì bạn kể, ngay trên máy của bạn.",
    ],
    adviceGeneric: [
      "Mình chưa đủ hiểu để nói \"nên\" được. Kể mình nghe thêm một chút: chuyện này bắt đầu từ đâu?",
      "Trước khi nói nên hay không, cho mình hỏi: điều bạn thật sự muốn là gì, nếu bỏ qua chữ \"nên\"?",
      "Mình có thể cùng bạn nghĩ. Trước hết, nếu không ai đánh giá, bạn sẽ muốn làm gì?",
    ],
    adviceLead: [
      "Mình nghĩ thế này:",
      "Nếu là mình:",
      "Thật lòng thì:",
    ],
    opinionLead: [
      "Thật lòng thì mình thấy",
      "Theo mình thì",
      "Mình nghĩ là",
    ],
    groundedFollowUps: [
      "Chuyện {phrase} này, nó bắt đầu từ bao giờ?",
      "Điều gì về {phrase} đang ở lại trong đầu bạn nhiều nhất?",
      "{phrase} - kể mình nghe thêm được không?",
      "Nếu phải nói một câu về {phrase}, bạn sẽ nói gì?",
    ],
    groundedObservations: [
      "Nghe như {phrase} đang chiếm khá nhiều chỗ trong đầu bạn lúc này.",
      "Có gì đó về {phrase} nghe quan trọng với bạn.",
    ],
    heavyProbes: [
      "Có chuyện gì xảy ra vậy?",
      "Chuyện gì làm bạn thấy vậy?",
      "Bạn thấy như vậy từ khi nào?",
    ],
    openInvites: [
      "Kể mình nghe thêm đi.",
      "Rồi sao nữa?",
      "Mình đang nghe. Bạn cứ nói tiếp.",
      "Ừm. Còn gì nữa không?",
    ],
    noticeRecurring: [
      "Bạn nhắc đến {topic} vài lần rồi đó. Có vẻ nó đang là chuyện chính hôm nay.",
      "Để ý thấy {topic} cứ quay lại trong những gì bạn kể.",
    ],
    noticePerson: [
      "Hình như {person} là người ảnh hưởng đến bạn nhiều hôm nay.",
      "{person} xuất hiện khá nhiều trong chuyện bạn kể.",
    ],
    rememberPast: [
      "Lần trước bạn cũng có nhắc đến {topic}. Hai chuyện có liên quan gì nhau không?",
      "Mình nhớ lần trước bạn kể về {topic}. Dạo này chuyện đó sao rồi?",
    ],
    decisionLead: [
      "Vậy là bạn đang đứng giữa \"{a}\" và \"{b}\".",
      "Hai hướng: \"{a}\" hoặc \"{b}\".",
    ],
    lightFollowUps: [
      "Kể thêm đi!",
      "Rồi sao nữa?",
      "Lúc đó bạn đang ở với ai?",
      "Điều gì làm bạn thích nhất ở chuyện đó?",
    ],
    longShareAck: [
      "Mình đọc hết rồi. Nhiều chuyện trong một ngày quá.",
      "Mình đọc kỹ rồi. Viết được hết ra như vậy cũng đã nhẹ đi một phần.",
    ],
  },

  aurora: {
    understand: [
      "Để mình nói lại cho đúng: {detail}. Có đúng ý bạn không?",
      "Mình hiểu là {detail}. Nếu sai chỗ nào bạn sửa giúp mình nhé.",
    ],
    understandDecision: [
      "Vậy là bạn đang cân nhắc giữa \"{a}\" và \"{b}\".",
      "Hai lựa chọn trên bàn: \"{a}\" hoặc \"{b}\".",
    ],
    clarifyGoal: [
      "Nếu chuyện này được giải quyết ổn thỏa, cụ thể thì cuộc sống bạn sẽ khác đi ở điểm nào?",
      "Điều bạn thật sự muốn ở đây là gì - không phải điều bạn \"nên\" muốn?",
      "Khi nói \"ổn\", bạn hình dung nó trông như thế nào?",
    ],
    clarifyDecision: [
      "Giữa \"{a}\" và \"{b}\", cái nào bạn thấy mình muốn, cái nào bạn thấy mình nên?",
      "Nếu phải chọn ngay bây giờ, không nghĩ, bạn chọn \"{a}\" hay \"{b}\"? Cứ nói, chưa phải quyết đâu.",
      "Điều gì ở \"{a}\" làm bạn chưa dám chọn hẳn, và điều gì ở \"{b}\" cũng vậy?",
    ],
    explore: [
      "Điều gì đang cản bạn làm việc đó, cụ thể nhất có thể?",
      "Bạn đã thử gì rồi, và chuyện gì xảy ra?",
      "Nếu cản trở lớn nhất biến mất, bạn sẽ làm gì ngay ngày mai?",
      "Phần nào của chuyện này nằm trong tay bạn, phần nào không?",
    ],
    challengeGeneric: [
      "Bạn vừa nói \"{quote}\". Bạn chắc điều đó đến mức nào - và nếu nó chỉ đúng một nửa thì sao?",
      "[if:mình phải|tôi phải|phải làm|phải đi|phải ở] Mình để ý bạn dùng chữ \"phải\" khá nhiều. Nếu thay bằng \"muốn\", câu nào còn đúng?",
      "Có khả năng nào là điều bạn sợ sẽ không xảy ra, mà bạn đang chuẩn bị cho nó như thể chắc chắn?",
    ],
    reflectLead: [
      "Nghe lại những gì bạn nói, có một điều nổi lên: \"{quote}\".",
      "Trong tất cả những gì bạn kể, câu này đáng chú ý nhất: \"{quote}\".",
    ],
    reflectNoQuote: [
      "Nghe lại những gì bạn nói, mình thấy bạn đã biết khá rõ mình muốn gì, chỉ chưa cho phép mình nói ra.",
      "Mình thấy bạn không thiếu câu trả lời. Bạn đang thiếu sự cho phép.",
    ],
    insightGeneric: [
      "Có thể vấn đề không phải là chọn cái nào, mà là bạn đang muốn một lựa chọn không có rủi ro - và lựa chọn đó không tồn tại.",
      "Mình nghĩ cái bạn cần không phải thêm thông tin, mà là một bước nhỏ để kiểm tra điều bạn đang đoán.",
      "Nghe như bạn đang chờ chắc chắn mới làm. Nhưng chắc chắn thường chỉ đến sau khi làm.",
    ],
    summaryClear: "Điều bạn đã thấy rõ",
    summaryOpen: "Điều vẫn còn mở",
    summaryStep: "Bước nhỏ tiếp theo",
    clearQuote: ["Bạn đã nói ra được: \"{quote}\"."],
    reactFear: [
      "Nếu điều bạn sợ thật sự xảy ra, bạn sẽ làm gì tiếp theo?",
      "Điều bạn sợ đó, khả năng xảy ra thật là bao nhiêu, nếu nhìn thật công bằng?",
      "Nỗi sợ này đang bảo vệ bạn khỏi điều gì?",
    ],
    reactUnknown: [
      "Không biết cũng không sao. Nếu buộc phải đoán, bạn đoán gì?",
      "Ừ, không dễ trả lời. Thử hỏi ngược lại: điều bạn chắc chắn KHÔNG muốn là gì?",
    ],
    reactAnswer: [
      "\"{quote}\" - mình nghĩ đó là chỗ đáng dừng lại.",
      "Mình để ý câu này: \"{quote}\".",
    ],
    clearGeneric: [
      "Bạn đã gọi được tên điều đang làm mình mắc kẹt.",
      "Chuyện này đã rõ hơn lúc bạn bắt đầu kể.",
    ],
    stillOpenGeneric: [
      "Bạn chưa nói ra điều bạn sợ nhất nếu chọn sai.",
      "Chưa rõ ai ngoài bạn đang có tiếng nói trong chuyện này.",
      "Bạn muốn gì thì đã rõ hơn; còn khi nào làm thì chưa.",
    ],
    stepGeneric: [
      "Trong tuần này, làm một việc nhỏ để kiểm tra giả định lớn nhất của bạn.",
      "Kể chuyện này với một người bạn tin, nguyên văn như bạn kể với mình.",
      "Viết ra quyết định của bạn bằng một câu, dán lên đâu đó, nhìn nó ba ngày.",
    ],
    wantToBeHeard: [
      "Mình thấy hình như bạn không cần giải quyết gì lúc này, chỉ cần được nghe. Mình nghe đây.",
    ],
    starters: [
      "Mình hay trì hoãn việc quan trọng.",
      "Mình nên ở lại công việc hiện tại hay chuyển việc?",
      "Mình cảm thấy mình là một thất bại.",
      "Mình không biết có nên tiếp tục mối quan hệ này không.",
    ],
  },

  reflect: {
    heavy: [
      "{detail}. Bạn đã kể ra thay vì giữ trong lòng, và mình nghĩ đó là việc đúng.",
      "{detail} - đó là điều nặng nhất bạn mang hôm nay. Bạn đã không mang nó một mình.",
      "Một ngày không dễ: {detail}. Mình giữ lại để sau này bạn nhìn lại và thấy mình đã đi qua được.",
    ],
    light: [
      "Một điều đáng giữ hôm nay: {detail}. Những chuyện như thế dễ trôi đi, nên mình ghi lại.",
      "{detail} - một khoảnh khắc nhỏ nhưng là thứ làm hôm nay khác với những hôm khác.",
      "Bạn đã để ý được điều này: {detail}. Để ý được là một món quà.",
    ],
    neutral: [
      "Bạn kể rằng {detail}. Mình ghi lại để sau này bạn có thể quay lại xem.",
      "Điều ở lại sau cuộc trò chuyện hôm nay: {detail}.",
    ],
    heavyPlain: [
      "Hôm nay không nhẹ, và bạn đã nói ra thay vì giữ một mình. Mình giữ lại cuộc trò chuyện này cho bạn.",
      "Một ngày nặng. Bạn đã đi qua được đến đây, và điều đó đáng được ghi lại.",
    ],
    lightPlain: [
      "Hôm nay có điều gì đó nhẹ nhàng trong câu chuyện của bạn. Mình giữ lại để sau này đọc vẫn thấy vui.",
    ],
    neutralPlain: [
      "Một cuộc trò chuyện bình thường trong một ngày bình thường. Những ngày như thế cũng đáng được nhớ.",
    ],
    endedLighter: ["Cuối cuộc trò chuyện, bạn nói mình đã thấy nhẹ hơn một chút."],
    standoutRepeat: [
      "Bạn nhắc đến \"{phrase}\" vài lần. Có thể điều đó đáng để ý.",
      "\"{phrase}\" cứ quay lại trong những gì bạn kể.",
    ],
    standoutPerson: [
      "{person} là người xuất hiện nhiều nhất trong câu chuyện hôm nay.",
    ],
    standoutQuote: [
      "Câu đáng nhớ nhất bạn nói: \"{quote}\".",
    ],
    fallbackTopic: "cuộc sống",
  },
};
