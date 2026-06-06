import type {
  FinalReport,
  MessageContext,
  OutcomeAdvice,
  OutcomeInput,
  Scores,
  TurnAiResponse,
} from "@/lib/types";
import { averageScore } from "@/lib/status";

type StoredTurn = {
  turnNumber: number;
  userMessage: string;
  aiMessage: string;
  scores: Scores;
  feedback: string;
  betterAlternative: string;
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function includesAny(text: string, words: string[]) {
  const lower = text.toLocaleLowerCase("tr-TR");
  return words.some((word) => lower.includes(word));
}

function sentenceStarter(context: MessageContext) {
  if (context.otherPerson.toLocaleLowerCase("tr-TR").includes("patron")) {
    return "Bunu şimdi açmanı beklemiyordum.";
  }

  if (context.goal.toLocaleLowerCase("tr-TR").includes("reddet")) {
    return "Yani bunu yapmak istemediğini mi söylüyorsun?";
  }

  return "Mesajını gördüm ama tam olarak ne demek istediğini anlamaya çalışıyorum.";
}

export function createOpeningMessage(context: MessageContext) {
  return `${sentenceStarter(context)} Bana bunu biraz daha net söyleyebilir misin?`;
}

function mockTurnReply(
  category: string,
  context: MessageContext,
  turnNumber: number,
  scores: Scores,
  userMessage: string,
): string {
  const other = context.otherPerson || "Karsi Taraf";
  const goal = context.goal || "cozum bulmak";
  
  if (category === "is_kariyer") {
    if (turnNumber === 1) return `Anliyorum, ${goal} konusunda bir talebin var. Ancak su anki is planimiz ve butce durumumuz nedeniyle bunu hemen onaylamam zor.`;
    if (turnNumber === 2) return `Yani bu konuda esnek olamayacagini mi soyluyorsun? ${other} olarak senden daha yapici bir yaklasim beklerdim.`;
    if (turnNumber === 3) return `Isin bu boyutunu dusunmemistim. Pekala, ${goal} hedefine ulasmak icin is yukunu veya takvimi nasil revize edebiliriz?`;
    return `Tamam, detaylari anladim. Bunu ust yonetimle/ekiple konusup netlestirelim.`;
  }
  
  if (category === "flort_iliski") {
    if (turnNumber === 1) return `Bilmem, bir suredir aramizdaki iletisim bana da biraz tuhaf geliyordu. Niyetinin ${goal} oldugunu bilmek iyi oldu ama emin degilim.`;
    if (turnNumber === 2) return `Neden her konusmada konuyu buraya getirmek zorundayiz? Iliskimizi/iletisimimizi bu kadar germen beni yoruyor.`;
    if (turnNumber === 3) return `Soylediklerinde hakli oldugun kisimlar var, kabul ediyorum. Aramizdaki bagi hemen kaybetmek istemiyorum.`;
    return `Pekala, ikimiz icin de hayirlisi olsun. Biraz zamana ve mesafeye ihtiyacim var, bunu dusunecegim.`;
  }
  
  if (category === "aile_arkadas") {
    if (turnNumber === 1) return `Ask olsun, aramizda bunun lafi mi olurdu? ${other} olarak senden boyle mesafeli bir yaklasim gormek beni biraz uzdu.`;
    if (turnNumber === 2) return `Ben senin icin her zaman elimden geleni yaparken, simdi bana boyle net sinirlar cizmen bencilce degil mi?`;
    if (turnNumber === 3) return `Peki, niyetinin beni kirmak olmadigini biliyorum. Yine de bu durumu aramizda tatliya baglayabiliriz umarım.`;
    return `Tamam canim, seni cok iyi anliyorum. Konustugumuz iyi oldu, aramiz bozulmasin yeter ki.`;
  }
  
  if (category === "para_pazarlik") {
    if (turnNumber === 1) return `Fiyat/talep konusunda teklifiniz yuksek geldi. Piyasada ${goal} icin daha uygun secenekler varken bunu kabul etmem zor.`;
    if (turnNumber === 2) return `Son fiyatiniz veya teklifiniz gercekten bu mu? Masadan kalkmadan once son kez revize etme sansiniz var mi?`;
    if (turnNumber === 3) return `Sartlari biraz esnetirseniz hemen el sikisabiliriz. Bize ozel bir seyler yapabilir misiniz?`;
    return `Pekala, bu kosullar altinda anlasmayi onayliyorum. Sozlesme veya detaylari hazirlayalim.`;
  }
  
  // Default: zor_mesajlar
  if (turnNumber === 1) return `Gonderdigin mesaji okudum. Aslinda amacinin ${goal} oldugunu hissediyorum ama yine de sasirdim.`;
  if (turnNumber === 2) return `Bunu bu sekilde soylemen aramizda bir gerilim yaratti. Konuyu daha sakin konusamaz miydik?`;
  if (turnNumber === 3) return `Haklisin, belki de ben de asiri tepki verdim. Iletisimi koparmadan ortak bir noktada bulusalim.`;
  return `Tamamdir, ne demek istedigini ve sinirlarini net olarak anladim. Bundan sonra buna dikkat ederim.`;
}

export function generateTurnResponse(
  category: string,
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
): TurnAiResponse {
  const length = userMessage.trim().length;
  const hasEmpathy = includesAny(userMessage, ["anlıyorum", "haklı", "üzgün", "teşekkür", "farkındayım", "anliyorum", "hakli", "uzgun", "tesekkur", "farkindayim"]);
  const hasBoundary = includesAny(userMessage, ["istemiyorum", "benim için", "uygun değil", "sınır", "net", "istemiyorum", "benim icin", "uygun degil", "sinir", "net"]);
  const hasCalm = includesAny(userMessage, ["sakin", "tartışmadan", "kırmadan", "saygı", "netleştirmek", "sakin", "tartismadan", "kirmadan", "saygi", "netlestirmek"]);
  const hasAggression = includesAny(userMessage, ["mecbursun", "saçma", "asla", "hep böylesin", "umurumda değil", "sacma", "hep boylesin", "umurumda degil"]);

  const scores: Scores = {
    clarity: clamp(52 + Math.min(length / 8, 24) + (hasBoundary ? 14 : 0)),
    confidence: clamp(48 + (hasBoundary ? 18 : 0) + (length > 35 ? 10 : 0) - (length > 450 ? 12 : 0)),
    empathy: clamp(42 + (hasEmpathy ? 28 : 0) + (hasCalm ? 10 : 0)),
    boundaries: clamp(44 + (hasBoundary ? 30 : 0) + (context.goal.includes("Sınır") || context.goal.includes("Sinir") ? 8 : 0)),
    naturalness: clamp(58 + (length < 280 ? 16 : -8) + (hasAggression ? -14 : 0)),
    risk: clamp(38 + (hasAggression ? 28 : 0) + (length > 500 ? 10 : 0) - (hasCalm ? 12 : 0)),
    persuasion: clamp(50 + (hasBoundary ? 12 : 0) + (hasEmpathy ? 10 : 0) + (hasCalm ? 8 : 0)),
  };

  const aiMessage = mockTurnReply(category, context, turnNumber, scores, userMessage);

  return {
    ai_message: aiMessage,
    suggested_replies: {
      soft: `Seni anliyorum. ${context.goal.toLocaleLowerCase("tr-TR")} istiyorum ama bunu kirmadan konusmak istiyorum.`,
      clear: `Benim icin onemli olan su: ${context.goal.toLocaleLowerCase("tr-TR")}. Bunu net ama saygili soylemek istiyorum.`,
      short: "Sadece netlestirmek istedim; tartismaya cevirmek istemiyorum.",
    },
    scores,
    feedback:
      scores.risk > 60
        ? "Mesajin anlasilir ama karsi tarafi savunmaya itebilir. Daha sakin bir giris riski azaltir."
        : "Cevabin iyi bir zeminde duruyor. Biraz daha somut ve kisa soylersen etkisi artar.",
    better_alternative:
      "Anliyorum. Ben de bunu buyutmeden, sadece kendi sinirimi ve niyetimi netlestirmek icin soylüyorum.",
  };
}

export function generateFinalReport(
  category: string,
  context: MessageContext,
  turns: StoredTurn[],
): FinalReport {
  const scoredTurns = turns.map((turn) => ({
    ...turn,
    total: averageScore(turn.scores),
  }));
  const best = scoredTurns.sort((a, b) => b.total - a.total)[0];
  const weakest = scoredTurns.sort((a, b) => a.total - b.total)[0];
  const totalScore = scoredTurns.length
    ? Math.round(scoredTurns.reduce((sum, turn) => sum + turn.total, 0) / scoredTurns.length)
    : 72;

  const other = context.otherPerson || "Karsi Taraf";
  const goal = context.goal || "hedefiniz";

  return {
    total_score: totalScore,
    summary: `${other} ile gerceklesen simulasyonda ana hedefin "${goal}" idi. Konuyu uzatmadan ve yapici bir tonda sinir cizmen en basarili yonundu.`,
    best_sentence: best?.userMessage || "Bunu tartismaya cevirmek istemiyorum.",
    weakest_sentence:
      weakest?.userMessage || "Cok fazla aciklama yaptigin yerlerde mesajin ana fikri biraz dagiliyor.",
    perceived_by_other_person:
      totalScore >= 75
        ? "Karşı taraf seni sakin, net ve ilişkiyi koruyan ama sınırlarına sadık biri olarak algılamış olabilir."
        : "Karşı taraf niyetini anlamış olabilir ama bazı ifadeleri savunmacı veya agresif bulmuş olabilir.",
    better_alternatives: [
      "Seni anliyorum; ben sadece kendi tarafimi sakin sekilde netlestirmek istiyorum.",
      "Bunu uzatmak istemem ama benim icin uygun olan siniri soylemem gerekiyor.",
      "Yanlis anlasilmak istemem; niyetim tartismak degil, durumu netlestirmek.",
    ],
    real_life_tips: [
      "Mesaji gondermeden once tek bir ana amac sec.",
      "Karsi tarafin tepkisine gore daha fazla aciklama yapmak yerine kisa kal.",
      "Sinir koyarken suclama degil, kendi ihtiyacini anlatan cumleler kullan.",
    ],
    risks: [
      "Cok uzun aciklama karsi tarafin ana mesaji kacirmasina yol acabilir.",
      "Pasif-agresif bir ton konusmayi gereksiz buyutebilir.",
    ],
    detailed_evaluation: `Simülasyon sürecinde ${other} ile girdiğin diyalogda genel olarak sakinliğini korumayı başardın. Ancak "${weakest?.userMessage || 'bazı cümleleriniz'}" yerine daha net ve duruşu güçlü bir dil seçebilirdin. Karşı tarafın "${context.otherPersonPersonality || 'belirttiğin'}" karakter yapısında olduğunu göz önünde bulundurursak, onun manipülatif veya baskıcı hamlelerine karşı daha doğrudan sınırlar çizmek yararına olacaktır.

İkinci olarak, konuşma esnasında kendi çekincelerini öne çıkarmak yerine, olayı tamamen profesyonel veya kişisel sınırların çerçevesine oturtman gerekirdi. "${best?.userMessage || 'en iyi cümlen'}" gibi anlarda gösterdiğin kararlılığı tüm konuşma geneline yayabilirsen, gerçek hayattaki konuşmada çok daha başarılı bir sonuç elde edebilirsin.`
  };
}

export function generateOutcomeAdvice(
  category: string,
  context: MessageContext,
  outcome: OutcomeInput,
): OutcomeAdvice {
  const reachedGoal = outcome.goalResult === "evet";
  const partly = outcome.goalResult === "kismen";

  return {
    situation_analysis: reachedGoal
      ? "Konusma genel olarak hedefinle uyumlu ilerlemis. Simdi onemli olan bu sonucu sakin sekilde surdurmek."
      : partly
        ? "Konusmada bazı ilerleme isaretleri var ama konu tamamen kapanmamis gorunuyor."
        : "Bekledigin sonucu almamis olabilirsin; yine de sinirini daha saglikli kurmak icin veri toplamis oldun.",
    what_went_well: [
      "Durumu ertelemek yerine konusmayi denedin.",
      `${context.tone.toLocaleLowerCase("tr-TR")} tona sadik kalmaya calistin.`,
    ],
    risks: [
      "Konuyu hemen tekrar acmak karsi tarafi savunmaya itebilir.",
      "Belirsizlik surerse ayni mesaji farkli sekillerde tekrar etmek yorucu olabilir.",
    ],
    next_steps: [
      "Once karsi tarafin verdigi tepkiyi oldugu gibi not et.",
      "Bir sonraki mesajda tek hedef sec ve kisa kal.",
      "Sinirin degismediyse bunu sakin bir cumleyle tekrar et.",
    ],
    followup_message: reachedGoal
      ? "Konustugumuz icin tesekkur ederim. Boyle netlesmesi benim icin iyi oldu."
      : "Bunu uzatmak istemem ama benim acimdan sinir hâlâ ayni. Sakin sekilde burada birakmak istiyorum.",
    next_conversation_opener:
      "Gecen konusmadan sonra biraz dusundum. Bunu tartisma gibi degil, netlesme gibi konusmak istiyorum.",
  };
}

export function generateSimulationBrief(category: string, context: MessageContext): string {
  const other = context.otherPerson || "Karşı taraf";
  const personality = context.otherPersonPersonality || "kendine has";
  const goal = context.goal || "durumu konuşmak";
  return `${other} ile karşı karşıyasın. Kendisi bu konuşmada "${personality}" bir kişilik sergileyecek. Amacın "${goal}" hedefine ulaşmak; sakin kalıp sınırlarını koruyarak diyalogu sürdürmelisin.`;
}
