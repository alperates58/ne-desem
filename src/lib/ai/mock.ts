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
  return `${sentenceStarter(context)} Bana bunu biraz daha net söyler misin?`;
}

export function generateTurnResponse(
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
): TurnAiResponse {
  const length = userMessage.trim().length;
  const hasEmpathy = includesAny(userMessage, ["anlıyorum", "haklı", "üzgün", "teşekkür", "farkındayım"]);
  const hasBoundary = includesAny(userMessage, ["istemiyorum", "benim için", "uygun değil", "sınır", "net"]);
  const hasCalm = includesAny(userMessage, ["sakin", "tartışmadan", "kırmadan", "saygı", "netleştirmek"]);
  const hasAggression = includesAny(userMessage, ["mecbursun", "saçma", "asla", "hep böylesin", "umurumda değil"]);

  const scores: Scores = {
    clarity: clamp(52 + Math.min(length / 8, 24) + (hasBoundary ? 14 : 0)),
    confidence: clamp(48 + (hasBoundary ? 18 : 0) + (length > 35 ? 10 : 0) - (length > 450 ? 12 : 0)),
    empathy: clamp(42 + (hasEmpathy ? 28 : 0) + (hasCalm ? 10 : 0)),
    boundaries: clamp(44 + (hasBoundary ? 30 : 0) + (context.goal.includes("Sınır") ? 8 : 0)),
    naturalness: clamp(58 + (length < 280 ? 16 : -8) + (hasAggression ? -14 : 0)),
    risk: clamp(38 + (hasAggression ? 28 : 0) + (length > 500 ? 10 : 0) - (hasCalm ? 12 : 0)),
    persuasion: clamp(50 + (hasBoundary ? 12 : 0) + (hasEmpathy ? 10 : 0) + (hasCalm ? 8 : 0)),
  };

  const aiMessage =
    turnNumber >= 4
      ? "Tamam, söylediğini daha iyi anladım. Yine de bunu nasıl uygulayacağımızı netleştirmem gerekiyor."
      : scores.risk > 60
        ? "Bu biraz sert geldi. Ben bunu saldırı gibi algılamaya başladım."
        : hasEmpathy
          ? "Böyle söyleyince daha anlaşılır oldu. Yine de benim açımdan zor olan kısmı var."
          : "Anladım, ama neden böyle düşündüğünü biraz daha açmanı beklerdim.";

  return {
    ai_message: aiMessage,
    suggested_replies: {
      soft: `Seni anlıyorum. ${context.goal.toLocaleLowerCase("tr-TR")} istiyorum ama bunu kırmadan konuşmak istiyorum.`,
      clear: `Benim için önemli olan şu: ${context.goal.toLocaleLowerCase("tr-TR")}. Bunu net ama saygılı söylemek istiyorum.`,
      short: "Sadece netleştirmek istedim; tartışmaya çevirmek istemiyorum.",
    },
    scores,
    feedback:
      scores.risk > 60
        ? "Mesajın anlaşılır ama karşı tarafı savunmaya itebilir. Daha sakin bir giriş riski azaltır."
        : "Cevabın iyi bir zeminde duruyor. Biraz daha somut ve kısa söylersen etkisi artar.",
    better_alternative:
      "Anlıyorum. Ben de bunu büyütmeden, sadece kendi sınırımı ve niyetimi netleştirmek için söylüyorum.",
  };
}

export function generateFinalReport(context: MessageContext, turns: StoredTurn[]): FinalReport {
  const scoredTurns = turns.map((turn) => ({
    ...turn,
    total: averageScore(turn.scores),
  }));
  const best = scoredTurns.sort((a, b) => b.total - a.total)[0];
  const weakest = scoredTurns.sort((a, b) => a.total - b.total)[0];
  const totalScore = scoredTurns.length
    ? Math.round(scoredTurns.reduce((sum, turn) => sum + turn.total, 0) / scoredTurns.length)
    : 72;

  return {
    total_score: totalScore,
    summary: `${context.otherPerson} ile olan mesajlaşmada ana hedefin "${context.goal}" idi. En iyi çalışan tarafın, konuyu büyütmeden niyetini açıklaman oldu.`,
    best_sentence: best?.userMessage || "Bunu tartışmaya çevirmeden netleştirmek istiyorum.",
    weakest_sentence:
      weakest?.userMessage || "Çok fazla açıklama yaptığın yerlerde mesajın ana fikri biraz dağılıyor.",
    perceived_by_other_person:
      totalScore >= 75
        ? "Karşı taraf seni sakin, net ve ilişkiyi tamamen yakmayan biri olarak algılamış olabilir."
        : "Karşı taraf niyetini anlamış olabilir ama bazı cümleleri savunma veya geri çekilme olarak okuyabilir.",
    better_alternatives: [
      "Seni anlıyorum; ben sadece kendi tarafımı sakin şekilde netleştirmek istiyorum.",
      "Bunu uzatmak istemem ama benim için uygun olan sınırı söylemem gerekiyor.",
      "Yanlış anlaşılmak istemem; niyetim tartışmak değil, durumu netleştirmek.",
    ],
    real_life_tips: [
      "Mesajı göndermeden önce tek bir ana amaç seç.",
      "Karşı tarafın tepkisine göre daha fazla açıklama yapmak yerine kısa kal.",
      "Sınır koyarken suçlama değil, kendi ihtiyacını anlatan cümleler kullan.",
    ],
    risks: [
      "Çok uzun açıklama karşı tarafın ana mesajı kaçırmasına yol açabilir.",
      "Pasif-agresif bir ton konuşmayı gereksiz büyütebilir.",
    ],
  };
}

export function generateOutcomeAdvice(
  context: MessageContext,
  outcome: OutcomeInput,
): OutcomeAdvice {
  const reachedGoal = outcome.goalResult === "evet";
  const partly = outcome.goalResult === "kismen";

  return {
    situation_analysis: reachedGoal
      ? "Konuşma genel olarak hedefinle uyumlu ilerlemiş. Şimdi önemli olan bu sonucu sakin şekilde sürdürmek."
      : partly
        ? "Konuşmada bazı ilerleme işaretleri var ama konu tamamen kapanmamış görünüyor."
        : "Beklediğin sonucu almamış olabilirsin; yine de sınırını daha sağlıklı kurmak için veri toplamış oldun.",
    what_went_well: [
      "Durumu ertelemek yerine konuşmayı denedin.",
      `${context.tone.toLocaleLowerCase("tr-TR")} tona sadık kalmaya çalıştın.`,
    ],
    risks: [
      "Konuyu hemen tekrar açmak karşı tarafı savunmaya itebilir.",
      "Belirsizlik sürerse aynı mesajı farklı şekillerde tekrar etmek yorucu olabilir.",
    ],
    next_steps: [
      "Önce karşı tarafın verdiği tepkiyi olduğu gibi not et.",
      "Bir sonraki mesajda tek hedef seç ve kısa kal.",
      "Sınırın değişmediyse bunu sakin bir cümleyle tekrar et.",
    ],
    followup_message: reachedGoal
      ? "Konuştuğumuz için teşekkür ederim. Böyle netleşmesi benim için iyi oldu."
      : "Bunu uzatmak istemem ama benim açımdan sınır hâlâ aynı. Sakin şekilde burada bırakmak istiyorum.",
    next_conversation_opener:
      "Geçen konuşmadan sonra biraz düşündüm. Bunu tartışma gibi değil, netleşme gibi konuşmak istiyorum.",
  };
}
