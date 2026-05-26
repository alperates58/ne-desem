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
    active: false,
  },
  {
    id: "flort_iliski",
    title: "Flört / İlişki",
    description: "Belirsizlik, kırgınlık, netlik isteme ve kapanış konuşmaları.",
    examples: ["Geç cevap verene yazma", "Netlik isteme", "Mesafe koyma"],
    active: false,
  },
  {
    id: "aile_arkadas",
    title: "Aile / Arkadaş",
    description: "Yakın çevreyle kırmadan ama net konuşma provaları.",
    examples: ["Hayır deme", "Borç hatırlatma", "Kırgınlığı anlatma"],
    active: false,
  },
  {
    id: "para_pazarlik",
    title: "Para / Pazarlık",
    description: "Fiyat, ücret, kira, borç ve pazarlık konuşmaları.",
    examples: ["Fiyat savunma", "Alacak isteme", "İndirim reddetme"],
    active: false,
  },
  {
    id: "zor_mesajlar",
    title: "Zor Mesajlar",
    description: "Cevap vermekte zorlandığın mesajları güvenli şekilde prova et.",
    examples: ["Kibarca reddetme", "Konuyu kapatma", "Pasif-agresif mesaja cevap"],
    active: true,
  },
];

export const contextFieldLabels: Record<keyof MessageContext, string> = {
  incomingMessage: "Gelen mesaj",
  otherPerson: "Karşı taraf",
  difficultyReason: "Neden zor?",
  goal: "Amacın",
  tone: "Ton",
  replyLength: "Cevap uzunluğu",
  preserveRelationship: "İlişkiyi koruma",
  fear: "Çekindiğin tepki",
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
