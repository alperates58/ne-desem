"use client";

import { ArrowRight, Lock, MessageSquareText, Zap, Sparkles, Play, ShieldAlert, Award, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/categories";
import type { MessageContext } from "@/lib/types";
import { templates } from "@/lib/templates";

type WizardStep = {
  key: keyof MessageContext;
  label: string;
  helper: string;
  type: "textarea" | "select" | "input";
  options?: string[];
  placeholder?: string;
};

// Suggestion options for steps
const STEP_SUGGESTIONS: Record<string, Record<string, string[]>> = {
  is_kariyer: {
    incomingMessage: [
      "Maaşıma son enflasyon oranında zam yapılmasını talep etmek istiyorum.",
      "Mesai saati bittikten sonra gelen acil raporlama talebini reddetmek.",
      "Başka bir şirketten gelen teklif üzerine istifamı yöneticime sunmak.",
      "Kendi teslim tarihlerimi aksatan iş arkadaşımın benden iş istemesi."
    ],
    redLine: [
      "Hafta sonu mesaisi yapmayı kesinlikle kabul edemem.",
      "Maaş artışı olmadan yeni sorumlulukları kalıcı üstlenmem.",
      "İhbar süresinden daha fazla kalmayı kabul edemem."
    ],
    fear: [
      "Yöneticinin sinirlenmesi veya tepki göstermesi",
      "İşimi kaybetmek veya dışlanmak",
      "Ekip içinde uyumsuz biri olarak görünmek"
    ]
  },
  flort_iliski: {
    incomingMessage: [
      "Flörtümün 6 saattir mesajıma cevap vermemesine soğuk bir yanıt vermek.",
      "Belirsiz davranan flörtüme ilişkimizin adını koyma konuşması yapmak.",
      "Aylar sonra 'nasılsın' yazan eski sevgilime mesafeli bir yanıt vermek.",
      "İlişkideki ilgisizlikten ve soğukluktan rahatsız olduğumu belirtmek."
    ],
    avoidAction: [
      "Yalvarmak veya muhtaç gibi görünmek",
      "Öfkeyle sitem etmek veya trip atmak",
      "Hemen yumuşayıp buluşmayı kabul etmek"
    ],
    fear: [
      "İlişkinin tamamen kopması",
      "Gurursuz görünmek",
      "Karşı tarafın kaçması veya hazır değilim demesi"
    ]
  },
  aile_arkadas: {
    incomingMessage: [
      "Yakın bir arkadaşıma geçen ay verdiğim borcu kırmadan hatırlatmak.",
      "Akrabamın sürekli benden borç istemesini kırmadan geri çevirmek.",
      "Ailemin iş ve kariyer seçimlerime sürekli müdahale etmesini durdurmak.",
      "Hafta sonu arkadaşımın davetine gitmek istemediğimi kibarca iletmek."
    ],
    fear: [
      "Ailemin veya arkadaşımın küsmesi",
      "Bencil veya vefasız görünmek",
      "Kavga çıkması veya gerilimin artması"
    ]
  },
  para_pazarlik: {
    incomingMessage: [
      "Ev sahibinin yasal sınırın üstündeki %100 kira artış talebine itiraz etmek.",
      "Freelance işimde müşterinin ısrarlı %30 indirim talebini reddetmek.",
      "Hizmet bedelimi piyasa değerine göre artıracağımı bildirmek.",
      "Satıcıdan makul bir oranda indirim talep etmek."
    ],
    minAcceptableLevel: [
      "Yasal sınır olan %65 artışın üstüne çıkamam.",
      "Bu hafta sonuna kadar en az yarısının ödenmesi.",
      "Ekstra kapsam azaltımı olmadan indirim yapamam."
    ],
    fear: [
      "Evden çıkarılmak veya mahkemelik olmak",
      "Müşteriyi rakibe kaptırmak",
      "Paragöz veya cimri gibi görünmek"
    ]
  },
  egitim_okul: {
    incomingMessage: [
      "Kanka ben bu aralar çok yoğunum, slaytları siz halledersiniz değil mi?",
      "Sınav kağıtlarını son derece objektif okudum, itirazı olan resmi dilekçe versin.",
      "Grup ödevinde herkesin ismini yazalım diyen arkadaşı uyarma.",
      "Hocadan ek teslim süresi talep etmek."
    ],
    fear: [
      "Notumun daha da düşürülmesi veya hocanın takması",
      "Gruptaki diğer arkadaşlarımla aramın açılması veya yalnız kalmak",
      "Sınıfta kaba/uyumsuz biri olarak mimlenmek"
    ]
  },
  gunluk_yasam: {
    incomingMessage: [
      "Çocuklar koşuyor ne yapalım, apartmanda yaşamanın kuralları bunlar.",
      "Usta diğer şantiyede acil işim çıktı, yarın sabah ilk iş oradayım.",
      "Aidat artışını kabul etmeyen veya ödemeyen komşu uyarısı.",
      "Apartman koridoruna çöplerini veya eşyalarını bırakan komşuyu uyarma."
    ],
    fear: [
      "Komşuyla yüz yüze bakarken düşman olmak",
      "Ustanın işi yarım bırakıp kaçması veya para iadesi yapmaması",
      "Apartmanda gerginlik çıkması veya dedikodu yapılması"
    ]
  },
  zor_mesajlar: {
    incomingMessage: [
      "Görüldü atan flörte konuyu kapatmak için kısa bir mesaj yazmak.",
      "Bana pasif-agresif mesaj atan iş arkadaşıma profesyonel sınır çizmek.",
      "Birinin ısrarlı kahve davetini kibarca ama net bir şekilde reddetmek.",
      "Yanlış anlaşıldığım bir konuyu büyütmeden açıklığa kavuşturmak."
    ],
    fear: [
      "Yanlış anlaşılmak veya suçlanmak",
      "Tartışmanın büyümesi",
      "Kaba görünmek"
    ]
  }
};

function getStepsForCategory(category: string): WizardStep[] {
  switch (category) {
    case "is_kariyer":
      return [
        {
          key: "incomingMessage",
          label: "Durum veya sana söylenen son söz ne?",
          helper: "Durumu veya konuşulan son cümleyi yazarak provanın zeminini belirleyin.",
          type: "textarea",
          placeholder: "Durumu veya konuşulan son cümleyi yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Karşı tarafın rolü konuşmanın gidişatını belirler.",
          type: "select",
          options: ["Patron", "Yönetici / Müdür", "İş arkadaşı", "IK (İnsan Kaynakları)", "Müşteri"]
        },
        {
          key: "otherPersonPersonality",
          label: "Karşı tarafın kişiliği nasıl?",
          helper: "AI karşı tarafı bu karaktere göre canlandırır, tepki ve itirazları buna göre şekillenir.",
          type: "select",
          options: ["Anlayışlı ve Mantıklı", "Otoriter ve Sert", "Pasif-Agresif / İğneleyici", "Manipülatif ve Egoist", "Yoğun ve Dikkatsiz"]
        },
        {
          key: "otherPersonAttitude",
          label: "Karşı tarafın muhtemel tavrı nasıl olur?",
          helper: "Görüşme sırasındaki tutumu ne olacak?",
          type: "select",
          options: ["Savunmacı", "Anlayışlı", "Kaçamak", "Sert", "Umursamaz", "Pazarlıkçı"]
        },
        {
          key: "previouslyDiscussed",
          label: "Daha önce bu konu açıldı mı?",
          helper: "Konuşmanın geçmiş geçmişi var mı?",
          type: "select",
          options: ["Hayır, ilk kez açılacak", "Evet, olumlu geçti", "Evet, kötü geçti"]
        },
        {
          key: "difficultyReason",
          label: "Bu konuda konuşmakta neden zorlanıyorsun?",
          helper: "Temel zorluğu veya çekinceni seç.",
          type: "select",
          options: [
            "Zam istemek / hakkımı savunmak",
            "Fazla mesaiyi kibarca reddetmek",
            "İstifa etmek / ayrılmak",
            "Haksız eleştiriye profesyonel yanıt vermek",
            "İş yükümü azaltmak",
            "Ekip arkadaşıma geribildirim vermek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Provanın kazanma koşulu gibi düşün.",
          type: "select",
          options: ["Zam almak", "Sınır koymak", "Profesyonelce reddetmek", "Geri bildirim vermek", "İstifa etmek"]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "Yapay zeka önerileri bu tona göre ayarlanır.",
          type: "select",
          options: ["Yumuşak ama ciddi", "Profesyonel ve kibar", "Net ve kararlı", "Kısa ve direkt"]
        },
        {
          key: "redLine",
          label: "Kırmızı çizgin ne?",
          helper: "Asla taviz vermeyeceğin sınır.",
          type: "input",
          placeholder: "Örn: Fazla ücretsiz mesai yapmam, bu tutarın altına inmem"
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Profesyonel yazışmalarda net olmak avantajdır.",
          type: "select",
          options: ["Kısa mesaj", "Tek cümle", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "Bu kişiyle profesyonel ilişkiyi korumak istiyor musun?",
          helper: "Sınır ve nezaket dengesini ayarlar.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "Çekindiğin olumsuz senaryoyu belirt.",
          type: "input",
          placeholder: "Örn: işimi kaybetmek, zayıf görünmek, patronun sinirlenmesi"
        }
      ];
    case "flort_iliski":
      return [
        {
          key: "incomingMessage",
          label: "İlişkideki son mesaj veya durum ne?",
          helper: "Örn: Karşı tarafın geç yazması, soğuk cevabı veya belirsiz bir durum.",
          type: "textarea",
          placeholder: "Gelen son mesajı veya durumu yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Aranızdaki bağ simülasyonu şekillendirir.",
          type: "select",
          options: ["Flört", "Yeni tanışılan biri", "Sevgili", "Eski sevgili", "Platonik aşk"]
        },
        {
          key: "relationshipDuration",
          label: "Ne kadar süredir iletişimdesiniz?",
          helper: "Bu süre samimiyet derecesini belirler.",
          type: "select",
          options: ["Birkaç ay", "Birkaç gün", "Birkaç hafta", "Çok uzun süre"]
        },
        {
          key: "otherPersonPersonality",
          label: "Karşı tarafın kişiliği nasıl?",
          helper: "AI karşı tarafı bu karaktere göre canlandırır, tepki ve itirazları buna göre şekillenir.",
          type: "select",
          options: ["Soğuk ve Mesafeli", "Duygusal ve Hassas", "İlgisiz / Geç Yazan", "Kıskanç ve Koruyucu", "Anlayışlı ve Açık Sözlü"]
        },
        {
          key: "otherPersonAttitude",
          label: "Karşı tarafın son tavrı nasıldı?",
          helper: "Sana nasıl yaklaşıyor?",
          type: "select",
          options: ["İlgili ama belirsiz", "Sıcak", "Soğuk", "Kararsız", "Geç cevap veriyor", "Savunmacı", "Suçlayıcı"]
        },
        {
          key: "difficultyReason",
          label: "Neden yazmakta veya konuşmakta zorlanıyorsun?",
          helper: "Kararsızlığının sebebini seç.",
          type: "select",
          options: [
            "İlişkiyi adlandırmak / netlik istemek",
            "Soğuk davranılmasını sorgulamak",
            "Kırgınlığımı dile getirmek",
            "Kıskançlık / güven konusunu açmak",
            "Kibarca mesafe koymak / bitirmek",
            "Eski sevgiliye yanıt vermek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Simülasyonun hedefi.",
          type: "select",
          options: ["Niyetini anlamak", "Kırgınlığımı hissettirmek", "Mesafe koymak", "İlişkiyi bitirmek", "Özür dilemek ve barışmak"]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "AI bu tona göre öneri yapacaktır.",
          type: "select",
          options: ["Sakin", "Net ve mesafeli", "Duygusal ama kontrollü", "Samimi ve açık", "Hafif esprili"]
        },
        {
          key: "avoidAction",
          label: "Bu konuşmada asla yapmak istemediğin şey ne?",
          helper: "Sınırını korumana yardımcı olur.",
          type: "input",
          placeholder: "Örn: yalvarmak, fazla sert olmak, gurursuz görünmek"
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Kısa kalmak genelde flörtte daha etkilidir.",
          type: "select",
          options: ["Kısa mesaj", "Tek cümle", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "Bu kişiyle aranızdaki bağı korumak istiyor musun?",
          helper: "Gelecekteki iletişimi etkiler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "noReplyAction",
          label: "Karşı taraf cevap vermezse ne yapmak istiyorsun?",
          helper: "İletişim stratejisini belirler.",
          type: "select",
          options: ["Bir daha yazmayacağım", "Son bir mesaj göndereceğim", "Bekleyeceğim", "Emin değilim"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "Seni durduran endişeyi yaz.",
          type: "input",
          placeholder: "Örn: tamamen kopmak, gurursuz görünmek, reddedilmek"
        }
      ];
    case "aile_arkadas":
      return [
        {
          key: "incomingMessage",
          label: "Söylenen son söz veya yaşanan durum ne?",
          helper: "Örn: Arkadaşın borç istedi veya ailen kararlarına karıştı.",
          type: "textarea",
          placeholder: "Durumu veya mesajı buraya yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Yakınlık derecesini seç.",
          type: "select",
          options: ["Yakın arkadaş", "Anne", "Baba", "Kardeş", "Akraba / Kuzen"]
        },
        {
          key: "closenessLevel",
          label: "Aranızdaki yakınlık derecesi nasıl?",
          helper: "Konuşmanın hassasiyetini etkiler.",
          type: "select",
          options: ["Çok yakın", "Yakın ama hassas", "Aramız biraz bozuk", "Mesafeliyiz", "Aile olduğu için kopmak istemiyorum", "Arkadaşlığı bitirme noktasındayım"]
        },
        {
          key: "otherPersonPersonality",
          label: "Karşı tarafın kişiliği nasıl?",
          helper: "AI karşı tarafı bu karaktere göre canlandırır, tepki ve itirazları buna göre şekillenir.",
          type: "select",
          options: ["Alıngan ve Hassas", "Otoriter ve Baskıcı", "Pasif-Agresif", "Destekleyici ve Sevgi Dolu", "Geleneksel / Israrcı"]
        },
        {
          key: "otherPersonAttitude",
          label: "Karşı taraf nasıl tepki verebilir?",
          helper: "Kaygı duyduğun muhtemel tavır.",
          type: "select",
          options: ["Alınabilir", "Kızabilir", "Konuyu değiştirebilir", "Suçluluk hissettirebilir", "Anlayışlı olabilir", "Dalga geçebilir"]
        },
        {
          key: "pastConversations",
          label: "Bu kişiyle geçmişte benzer konuşmalar nasıl geçti?",
          helper: "Geçmiş iletişim örüntünüz.",
          type: "select",
          options: ["İlk kez konuşacağım", "Genelde iyi", "Genelde tartışmaya dönüyor", "Ben susuyorum", "Karşı taraf savunmaya geçiyor"]
        },
        {
          key: "difficultyReason",
          label: "Bu konuda konuşmakta neden zorlanıyorsun?",
          helper: "En çok zorlandığın durum.",
          type: "select",
          options: [
            "Arkadaşa borcunu hatırlatmak",
            "Yakın birine hayır demek",
            "Aileye kendi kararlarımı açıklamak",
            "Planı kırmadan iptal etmek",
            "Yakın birinin kırıcı davranışını söylemek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Ulaşmak istediğin sonuç.",
          type: "select",
          options: ["Kırmadan sınır koymak", "Hayır demek", "Kararımı kabul ettirmek", "Borcumu tahsil etmek", "İlişkiyi düzeltmek"]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "İletişim dilini belirler.",
          type: "select",
          options: ["Sakin ama net", "Çok yumuşak", "Kırmadan sınır koyan", "Direkt ve açık"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Çok açıklama yapmak bazen sınırları zayıflatır.",
          type: "select",
          options: ["Kısa mesaj", "Tek cümle", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "İlişkiyi korumak istiyor musun?",
          helper: "Kişişel sınır dengesini etkiler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "En büyük kaygın.",
          type: "input",
          placeholder: "Örn: ailemin küsmesi, arkadaşımın kırılması, bencil görünmek"
        }
      ];
    case "para_pazarlik":
      return [
        {
          key: "incomingMessage",
          label: "Pazarlık veya para ile ilgili son durum/teklif ne?",
          helper: "Örn: Ev sahibinin yüksek zam talebi veya müşterinin indirim istemesi.",
          type: "textarea",
          placeholder: "Mevcut fiyat teklifini veya durumu yaz..."
        },
        {
          key: "financialIssue",
          label: "Konu hangi para meselesi?",
          helper: "Konuşmanın finansal türünü seç.",
          type: "select",
          options: ["Maaş pazarlığı", "Kira artışı", "Borç / Alacak", "Freelance / Hizmet bedeli", "Ürün fiyatı", "Ortak masraf bölüşme"]
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Finansal muhatabın.",
          type: "select",
          options: ["Müşteri", "Patron / Yönetici", "Ev sahibi", "Kiracı", "Satıcı", "Alıcı", "Arkadaş"]
        },
        {
          key: "otherPersonPersonality",
          label: "Karşı tarafın kişiliği nasıl?",
          helper: "AI karşı tarafı bu karaktere göre canlandırır, tepki ve itirazları buna göre şekillenir.",
          type: "select",
          options: ["Para Göz ve Katı", "Uzlaşmacı ve Esnek", "Profesyonel ve Mesafeli", "Israrcı ve Zorlayıcı"]
        },
        {
          key: "otherPersonAttitude",
          label: "Karşı tarafın şu anki pozisyonu/tavrı ne?",
          helper: "Sana karşı aldığı finansal duruş.",
          type: "select",
          options: ["Pahalı buluyor", "Henüz konuşulmadı", "Ödemeyi geciktiriyor", "İndirim istiyor", "Artışı kabul etmiyor", "Daha düşük teklif verdi"]
        },
        {
          key: "currentAmount",
          label: "Mevcut veya teklif edilen tutar nedir?",
          helper: "Sözleşme veya son teklif bedeli.",
          type: "input",
          placeholder: "Örn: 20.000 TL kira, 40.000 TL maaş teklifi"
        },
        {
          key: "difficultyReason",
          label: "Neden zorlanıyorsun?",
          helper: "Seni kısıtlayan durumu seç.",
          type: "select",
          options: [
            "Maaş pazarlığı yapmak",
            "Serbest çalışan olarak fiyatımı savunmak",
            "Müşterinin indirim talebini reddetmek",
            "Kira artışına itiraz etmek / anlaşmak",
            "Arkadaştan alacağımı istemek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Maddi veya sözleşmesel hedefin.",
          type: "select",
          options: ["Hedef tutarda anlaşmak", "İndirim yapmadan satmak", "Artışı kabul ettirmek / limit koymak", "Ödemeyi almak"]
        },
        {
          key: "minAcceptableLevel",
          label: "Kabul edeceğin minimum seviye / sınır nedir?",
          helper: "Masadan kalkma noktanı belirler.",
          type: "input",
          placeholder: "Örn: 35.000 TL altını kabul etmem, taksit istemiyorum"
        },
        {
          key: "tone",
          label: "Pazarlık tonun nasıl olsun?",
          helper: "Pazarlık gücünü etkiler.",
          type: "select",
          options: ["Sert ama saygılı", "Uzlaşmacı", "Net ve kararlı", "Profesyonel"]
        },
        {
          key: "leverageOrAlternative",
          label: "Elinde koz veya alternatif var mı?",
          helper: "Pazarlıktaki gücünü artıracak kanıt/seçenek.",
          type: "input",
          placeholder: "Örn: Emsal piyasa fiyatları, başka bir iş teklifi"
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Pazarlıkta az ve öz konuşmak koz kazandırır.",
          type: "select",
          options: ["Kısa mesaj", "Tek cümle", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "İlişkiyi/anlaşmayı korumak istiyor musun?",
          helper: "Masadan kalkma limitini belirler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "noAgreementAction",
          label: "Anlaşma olmazsa ne yapacaksın?",
          helper: "B Planın nedir?",
          type: "select",
          options: ["Emin değilim", "Masadan kalkarım", "Alternatif teklif sunarım", "Süre isterim", "İlişkiyi bozmak istemem"]
        },
        {
          key: "fear",
          label: "En çok hangi tepki veya sonuçtan çekiniyorsun?",
          helper: "En büyük finansal kaygın.",
          type: "input",
          placeholder: "Örn: anlaşmanın bozulması, müşteriyi kaybetmek, cimri görünmek"
        }
      ];
    case "zor_mesajlar":
    default:
      return [
        {
          key: "incomingMessage",
          label: "Gelen mesaj ne?",
          helper: "İstersen özel bilgileri sansürleyebilirsin.",
          type: "textarea",
          placeholder: "Gelen mesajı aynen buraya yapıştır..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Bu rol simülasyondaki tepkiyi belirler.",
          type: "select",
          options: ["Flört", "Sevgili", "Eski sevgili", "Arkadaş", "Aile", "İş arkadaşı", "Patron", "Müşteri", "Tanımadığım biri"]
        },
        {
          key: "otherPersonPersonality",
          label: "Karşı tarafın kişiliği nasıl?",
          helper: "AI karşı tarafı bu karaktere göre canlandırır, tepki ve itirazları buna göre şekillenir.",
          type: "select",
          options: ["Soğuk ve Mesafeli", "Otoriter ve Sert", "Anlayışlı ve Mantıklı", "Pasif-Agresif / İğneleyici", "Manipülatif ve Egoist", "Yoğun ve Dikkatsiz", "Duygusal ve Hassas"]
        },
        {
          key: "difficultyReason",
          label: "Bu mesaja cevap vermekte neden zorlanıyorsun?",
          helper: "Ana gerilimi seç.",
          type: "select",
          options: [
            "Kırmadan reddetmek istiyorum",
            "Fazla istekli görünmek istemiyorum",
            "Net olmak istiyorum",
            "Tartışma çıkmasın istiyorum",
            "Kendimi savunmak istiyorum",
            "Konuyu kapatmak istiyorum",
            "Karşı tarafın niyetini anlamak istiyorum"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Provanın kazanma koşulu gibi düşün.",
          type: "select",
          options: [
            "Reddetmek",
            "Konuşmayı sürdürmek",
            "Mesafe koymak",
            "Özür dilemek",
            "Sınır koymak",
            "Netlik istemek",
            "Tartışmayı kapatmak",
            "Karşı tarafı sakinleştirmek"
          ]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "AI önerileri bu tona göre ayarlanır.",
          type: "select",
          options: ["Kırmadan ama kararlı", "Kısa", "Sakin", "Net", "Esprili", "Mesafeli", "Samimi", "Profesyonel"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Kısa kalmak çoğu zor mesajda avantajdır.",
          type: "select",
          options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "Bu kişiyle ilişkiyi korumak istiyor musun?",
          helper: "Sınır ve yumuşaklık dengesini etkiler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "Örn: alınması, kızması, cevap vermemesi, manipüle etmesi.",
          type: "input",
          placeholder: "Örn: alınması, kızması, cevap vermemesi, dalga geçmesi"
        }
      ];
  }
}

function getInitialContextForCategory(category: string): MessageContext {
  const steps = getStepsForCategory(category);
  const context: Partial<MessageContext> = {};
  for (const step of steps) {
    if (step.type === "select" && step.options) {
      context[step.key] = step.options[0];
    } else {
      context[step.key] = "";
    }
  }
  return context as MessageContext;
}

export function ContextWizard({
  templateId,
  initialPersonality,
  remainingLimits = 5,
}: {
  templateId?: string;
  initialPersonality?: string;
  remainingLimits?: number;
}) {
  const router = useRouter();

  const [activeTemplate, setActiveTemplate] = useState<any>(() => {
    return templateId ? templates.find((t) => t.id === templateId) || null : null;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (templateId) {
      const t = templates.find((tmp) => tmp.id === templateId);
      return t ? t.category : "";
    }
    return "";
  });

  const [categorySelected, setCategorySelected] = useState<boolean>(!!templateId);

  const [context, setContext] = useState<MessageContext>(() => {
    const defaultContext = getInitialContextForCategory(
      activeTemplate ? activeTemplate.category : "zor_mesajlar"
    );

    if (activeTemplate) {
      return {
        ...defaultContext,
        ...activeTemplate.context,
        ...(initialPersonality ? { otherPersonPersonality: initialPersonality } : {}),
      };
    }
    return defaultContext;
  });

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const steps = getStepsForCategory(selectedCategory || "zor_mesajlar");
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function update(key: keyof MessageContext, value: string) {
    setContext((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(customContext = context) {
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory, context: customContext }),
      });
      const data = await response.json();
      setPending(false);

      if (!response.ok) {
        setError(data.message || "Simülasyon oluşturulamadı.");
        return;
      }

      router.push(`/simulations/${data.simulation.id}/play`);
      router.refresh();
    } catch {
      setPending(false);
      setError("Bağlantı hatası oluştu.");
    }
  }

  function onStepSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!context[current.key]?.trim()) {
      setError("Bu alanı doldurman gerekiyor.");
      return;
    }

    if (isLast) {
      if (remainingLimits <= 0) {
        setError("Aylık simülasyon limitinize ulaştınız.");
        return;
      }
      void submit();
      return;
    }

    setError("");
    setStep((value) => value + 1);
  }

  // Get current active step suggestions
  const currentStepSuggestions = selectedCategory ? (STEP_SUGGESTIONS[selectedCategory]?.[current?.key] || []) : [];

  // -------------------------------------------------------------
  // MODE 0: Category Selection Screen First (Sequential layout)
  // -------------------------------------------------------------
  if (!selectedCategory) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2 mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">Yeni Simülasyon</p>
          <h1 className="text-3xl font-black text-white">Hangi konuda prova yapmak istersin?</h1>
          <p className="text-sm text-slate-400">Zor konuşmaları güvenli bir ortamda prova etmek için bir alan seçin.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                if (category.active && !pending) {
                  setSelectedCategory(category.id);
                  setContext(getInitialContextForCategory(category.id));
                  setStep(0);
                  setError("");
                }
              }}
              type="button"
              className={`text-left rounded-3xl border p-5 transition-all duration-300 ${
                category.active
                  ? "border-white/10 bg-slate-950/60 hover:border-violet-300 hover:bg-violet-400/[0.03] hover:-translate-y-0.5 cursor-pointer shadow-lg"
                  : "border-white/5 bg-slate-950/20 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-xs leading-5 text-slate-400">{category.description}</p>
                </div>
                {category.active ? (
                  <div className="rounded-xl bg-violet-500/10 p-2 text-violet-300 border border-violet-500/20">
                    <MessageSquareText size={18} />
                  </div>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] text-slate-300">
                    <Lock size={10} /> Yakında
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {category.examples.map((example) => (
                  <span key={example} className="rounded-full bg-white/5 border border-white/5 px-2.5 py-1 text-[10px] text-slate-400">
                    {example}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODE 0.5: Sub-Simulation List (Predefined Templates) Screen
  // -------------------------------------------------------------
  if (selectedCategory && !categorySelected) {
    const categoryTemplates = templates.filter((t) => t.category === selectedCategory);
    const categoryTitle = categories.find((c) => c.id === selectedCategory)?.title || selectedCategory;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("");
              setError("");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-white font-semibold transition"
          >
            ← Kategorilere Geri Dön
          </button>
          <h1 className="text-3xl font-black text-white mt-2">{categoryTitle} Senaryoları</h1>
          <p className="text-sm text-slate-400">
            Hazır bir prova senaryosu seçin veya kendi durumunuza göre sıfırdan bir simülasyon başlatın.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Custom Simulation Card */}
          <button
            onClick={() => {
              setActiveTemplate(null);
              setCategorySelected(true);
              setStep(0);
              setError("");
              setContext(getInitialContextForCategory(selectedCategory));
            }}
            type="button"
            className="text-left rounded-3xl border border-dashed border-violet-400/30 bg-violet-950/10 hover:border-violet-300 hover:bg-violet-950/20 p-5 transition duration-200 flex flex-col justify-between min-h-[180px] shadow-lg cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full">
                  ÖZEL PROVA
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Sıfırdan Kendin Yarat</h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Gelen mesajı, muhatabınızı, karşı tarafın kişiliğini ve konuşmanın amacını kendiniz belirleyerek özel bir prova başlatın.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-violet-300 font-bold mt-4">
              Sıfırdan Başla <ArrowRight size={14} />
            </span>
          </button>

          {/* Preset Templates Cards */}
          {categoryTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setActiveTemplate(template);
                setContext({
                  ...getInitialContextForCategory(selectedCategory),
                  ...template.context,
                });
                setCategorySelected(true);
                setStep(0);
                setError("");
              }}
              type="button"
              className="text-left rounded-3xl border border-white/10 bg-slate-950/60 hover:border-violet-300 hover:bg-violet-400/[0.03] p-5 transition duration-200 flex flex-col justify-between min-h-[180px] shadow-lg cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    template.difficulty === "Kolay" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    template.difficulty === "Orta" ? "bg-amber-500/10 text-amber-400 border-emerald-500/20" :
                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{template.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
                  {template.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-violet-300 font-bold mt-4">
                Senaryoyu Gör <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Custom Simulation Setup (Step-by-step questions only)
  // -------------------------------------------------------------
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] items-start animate-in fade-in duration-300">
      {/* Left Side: Dynamic Suggestion Chips / Back to Category selection */}
      <section className="space-y-4">
        {/* Active Category / Template Indicator with Back Button */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg">
          {activeTemplate ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aktif Senaryo Şablonu</p>
              <h2 className="text-lg font-black text-white mt-1">
                {activeTemplate.title}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">{activeTemplate.description}</p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aktif Kategori</p>
              <h2 className="text-lg font-black text-white mt-1">
                {categories.find(c => c.id === selectedCategory)?.title || selectedCategory}
              </h2>
            </>
          )}
          {!templateId && (
            <button
              type="button"
              onClick={() => {
                setCategorySelected(false);
                setSelectedCategory("");
                setActiveTemplate(null);
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-white font-semibold transition"
            >
              {activeTemplate ? "← Şablonu Değiştir" : "← Kategori Değiştir"}
            </button>
          )}
        </div>

        {/* Dynamic Context Suggestions Card */}
        {currentStepSuggestions.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xs font-bold text-violet-300 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Sparkles size={14} /> Hızlı Öneri / Örnekler
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Aşağıdaki hazır şablonlardan birine tıklayarak bu adımın girdisini hızlıca doldurabilirsiniz:
            </p>
            <div className="space-y-2">
              {currentStepSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => update(current.key, suggestion)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-400/30 hover:bg-violet-500/5 transition text-xs text-slate-300 leading-relaxed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Right Side: Step-by-Step Custom Setup Form */}
      <form
        onSubmit={onStepSubmit}
        className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-violet-950/30"
      >
        {remainingLimits <= 0 && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs leading-6 text-rose-200">
            <span className="font-bold flex items-center gap-2 mb-1">
              <Lock size={14} className="text-rose-300" /> Aylık Simülasyon Limitiniz Doldu!
            </span>
            Profilinizden planınızı yükseltmeden yeni bir simülasyon başlatamazsınız.
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-violet-200">
              Adım {step + 1} / {steps.length}
            </p>
            <h1 className="mt-2 text-xl font-bold text-white">{current.label}</h1>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">{current.helper}</p>
          </div>
        </div>

        {current.type === "textarea" ? (
          <textarea
            className="min-h-36 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-xs leading-relaxed outline-none focus:border-violet-300"
            value={context[current.key] || ""}
            onChange={(event) => update(current.key, event.target.value)}
            placeholder={current.placeholder || "Detayları yazın..."}
            required
          />
        ) : current.type === "select" ? (
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-xs outline-none focus:border-violet-300"
            value={context[current.key] || ""}
            onChange={(event) => update(current.key, event.target.value)}
          >
            {current.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-xs outline-none focus:border-violet-300"
            value={context[current.key] || ""}
            onChange={(event) => update(current.key, event.target.value)}
            placeholder={current.placeholder || "Kısaca belirtin..."}
            required
          />
        )}

        {error && <p className="mt-4 text-xs text-rose-300">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-slate-300 disabled:opacity-40"
            disabled={pending}
            onClick={() => {
              if (step === 0) {
                setCategorySelected(false);
              } else {
                setStep((value) => Math.max(0, value - 1));
              }
            }}
          >
            Geri
          </button>
          {isLast && remainingLimits <= 0 ? (
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/30 px-5 py-2.5 text-xs font-semibold text-rose-300 cursor-not-allowed"
              disabled
              type="button"
            >
              Limit Aşıldı <Lock size={14} />
            </button>
          ) : (
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-violet-300 px-5 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-60 hover:bg-violet-200 transition"
              disabled={pending}
              type="submit"
            >
              {pending ? "Hazırlanıyor..." : isLast ? "Simülasyonu Başlat" : "Devam"}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
