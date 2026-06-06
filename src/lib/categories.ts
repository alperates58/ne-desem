import type { MessageContext } from "@/lib/types";

export type Category = {
  id: string;
  title: string;
  description: string;
  examples: string[];
  active: boolean;
};

export const categories: Category[] = [
  {
    id: "is_kariyer",
    title: "İş / Kariyer",
    description: "Zam, sınır koyma, geri bildirim ve profesyonel konuşmalar.",
    examples: ["Zam isteme", "Fazla mesaiyi reddetme", "Patronla konuşma"],
    active: true,
  },
  {
    id: "flort_iliski",
    title: "Flört / İlişki",
    description: "Belirsizlik, kırgınlık, netlik isteme ve kapanış konuşmaları.",
    examples: ["Geç cevap verene yazma", "Netlik isteme", "Mesafe koyma"],
    active: true,
  },
  {
    id: "aile_arkadas",
    title: "Aile / Arkadaş",
    description: "Yakın çevreyle kırmadan ama net konuşma provaları.",
    examples: ["Hayır deme", "Borç hatırlatma", "Kırgınlığı anlatma"],
    active: true,
  },
  {
    id: "para_pazarlik",
    title: "Para / Pazarlık",
    description: "Fiyat, ücret, kira, borç ve pazarlık konuşmaları.",
    examples: ["Fiyat savunma", "Alacak isteme", "İndirim reddetme"],
    active: true,
  },
  {
    id: "zor_mesajlar",
    title: "Zor Mesajlar",
    description: "Cevap vermekte zorlandığın mesajları güvenli şekilde prova et.",
    examples: ["Kibarca reddetme", "Konuyu kapatma", "Pasif-agresif mesaja cevap"],
    active: true,
  },
];

export const contextFieldLabels: Record<keyof Omit<MessageContext, "aiOpeningMessage">, string> = {
  incomingMessage: "Durum / Gelen mesaj",
  otherPerson: "Karşı taraf",
  otherPersonPersonality: "Karşı tarafın kişiliği",
  difficultyReason: "Neden zor?",
  goal: "Amacın",
  tone: "Ton",
  replyLength: "Cevap uzunluğu",
  preserveRelationship: "İlişkiyi koruma",
  fear: "Çekindiğin tepki",
  otherPersonAttitude: "Karşı tarafın tavrı",
  previouslyDiscussed: "Daha önce konuşuldu mu?",
  redLine: "Kırmızı çizgin",
  relationshipDuration: "İletişim süresi",
  avoidAction: "Asla yapılmayacak",
  noReplyAction: "Cevap gelmezse",
  closenessLevel: "Yakınlık derecesi",
  pastConversations: "Geçmiş konuşmalar",
  financialIssue: "Para meselesi",
  currentAmount: "Mevcut tutar",
  minAcceptableLevel: "Kabul edilebilir minimum",
  leverageOrAlternative: "Koz / Alternatif",
  noAgreementAction: "Anlaşma olmazsa",
};

export function createSimulationTitle(context: MessageContext) {
  const person = context.otherPerson || "Karşı taraf";
  const goal = context.goal || "Zor mesaj";
  return `${person} için ${goal.toLocaleLowerCase("tr-TR")}`;
}

export function compactScenario(context: MessageContext) {
  const text = context.incomingMessage.trim().replace(/\s+/g, " ");
  return text.length > 90 ? `${text.slice(0, 87)}...` : text;
}

export function getCategoryLabel(categoryId: string): string {
  const found = categories.find((c) => c.id === categoryId);
  return found ? found.title : categoryId;
}
