/**
 * Template-specific suggestions for the incomingMessage step in the context wizard.
 * Each template ID maps to 3 contextual suggestion strings that help users
 * understand what to write or pick a slight variation of the scenario.
 */
export const templateSuggestions: Record<string, string[]> = {

  // ─── İŞ / KARİYER ─────────────────────────────────────────────────────────

  "patron-zam": [
    "Son altı ayda aldığım ek sorumluluklar için maaş artışı görüşmek istiyorum.",
    "Piyasa koşulları ve bu yıldaki katkılarım doğrultusunda ücretimi gözden geçirmek istiyorum.",
    "Uzun süredir maaşım aynı kaldı, artan iş yükümü de göz önünde bulundurarak zam talep etmek istiyorum.",
  ],

  "mesai-reddi": [
    "Hafta sonu acil bir teslimat var, cumartesi günü ofise gelebilir misin?",
    "Pazar günü çalışmanı gerektiren bir durum oluştu, birkaç saat gelebilir misin?",
    "Bu hafta sonu müsait misin? Önemli bir konu var, birkaç saat gelsek yeter.",
  ],

  "istifa-bildirimi": [
    "Kariyerimde yeni bir adım atmak amacıyla şirketten ayrılma kararı aldım.",
    "Başka bir firmadan cazip bir teklif aldım ve kabul etmek istiyorum, bu konuyu sizinle paylaşmam gerekiyordu.",
    "Kişisel gelişimim için farklı bir fırsatı değerlendireceğim, istifamı iletmek istedim.",
  ],

  "terfi-talebi": [
    "Son altı aydır ekibin teknik koordinasyonunu ve yeni üye oryantasyonunu tek başıma yürütüyorum.",
    "Aldığım ek sorumluluklar ve göstergelerim doğrultusunda ekip liderliği pozisyonuna aday olmak istiyorum.",
    "Aylardır kıdemli bir rolün görevlerini yaparken unvanım ve maaşım aynı kaldı, terfi görüşmesi istiyorum.",
  ],

  "is-gorusmesi-pazarlik": [
    "Teklif ettiğiniz net maaş beklentimin altında kalıyor, biraz daha görüşmek istiyorum.",
    "Aylık net 40.000 TL bütçeniz olduğunu belirttiniz, ancak ben farklı bir rakam düşünüyordum.",
    "Teklifinizi inceledim; maaş konusunu biraz daha konuşabilir miyiz?",
  ],

  "ekip-arkadasi-geri-bildirim": [
    "Ya kusura bakma benim kısım biraz gecikti ama sunumda ikimizin adı var nasıl olsa, sen halledersin değil mi?",
    "Şu raporun son bölümünü yapamadım, siz tamamlarsınız değil mi? Çok yoğunum.",
    "Benim kısım hazır değil ama teslim yarın, sen halleder misin? İkimizin de işi bu.",
  ],

  "haksiz-elestiri-cevap": [
    "Bu projenin gecikme sebebi senin ayrıntılarda fazla oyalanmandır.",
    "Ekip önünde 'bu iş böyle yapılmaz' diyerek beni eleştirdi ve yanıt vermek istedim.",
    "Toplantıda herkesin önünde beni suçladı, profesyonelce yanıt vermem gerekiyor.",
  ],

  "is-yuku-azaltma": [
    "Son üç aydır üç kişilik projeyi tek başıma yürütüyorum, verimlilik düşüyor.",
    "Aşırı iş yükünden sağlığım etkilenmeye başladı, yöneticimle konuşmam gerekiyor.",
    "Sürdürülebilir olmayan bir tempoda çalışıyorum; iş yükümün düzenlenmesini talep etmek istiyorum.",
  ],

  "ik-terfi-beklentisi": [
    "Şu anki rolümde 2 yılı geride bıraktım, unvan/kıdem artışı beklentimi paylaşmak istiyorum.",
    "Performans değerlendirmem olumlu geçti, terfi için resmi adım atmak istiyorum.",
    "Yeni sorumluluklar üstlendim ama unvanım değişmedi; bu durumu İK ile görüşmem gerekiyor.",
  ],

  "burnout-bildirimi": [
    "Son 3 aydır akşamları ve hafta sonları da çalışıyorum, bu iş yükü sürdürülebilir değil.",
    "Tükenmişlik belirtileri yaşıyorum; yöneticimle iş yükü dengesini konuşmam gerekiyor.",
    "Hem fiziksel hem de zihinsel olarak tükendim, mevcut tempoyu sürdüremiyorum.",
  ],

  "freelance-sure-talebi": [
    "Entegrasyon aşamasında beklenmedik teknik bir sorunla karşılaştım, 3 gün ek süre istiyorum.",
    "Teslim tarihini yetiştiremeyeceğim; bunu müşteriye kızdırmadan nasıl iletebilirim?",
    "API entegrasyonunda kritik bir hata çıktı, teslimatı ertelememiz gerekiyor.",
  ],

  "is-karsi-teklif-pazarlik": [
    "Başka bir firmadan aldığım teklif mevcut şartlarımın çok üzerinde; şirkette kalmak için ne yapılabilir?",
    "Rakip bir şirketten cazip bir teklif geldi; mevcut şirketimle bunu müzakere etmek istiyorum.",
    "Başka bir yerden gelen teklifi değerlendiriyorum, mevcut şirketim de karşı teklif sunabilir mi?",
  ],

  "mentorluk-talebi-ust-yonetici": [
    "Kariyer hedeflerim için sizin deneyimlerinizden yararlanmak ve düzenli görüşmek isterim.",
    "Şirketteki bir liderden mentorluk almak istiyorum; bunu kibarca nasıl talep edebilirim?",
    "Ayda bir görüşerek kariyer gelişimim hakkında rehberlik almanızı rica etmek istiyorum.",
  ],

  "rakip-firmaya-gecis": [
    "Rakip bir firmadan çok cazip teklif aldım ve kabul ettim, yöneticime açıklamam gerekiyor.",
    "Rakip bir şirkete geçeceğimi yöneticime profesyonelce nasıl anlatırım?",
    "İstifamı veriyorum, rakip firmada başlayacağım. Köprüleri yakmamak istiyorum.",
  ],

  "haksiz-performans-puani": [
    "Bu dönem hedeflere ulaştım ama iletişim puanını düşük değerlendirdi, itiraz etmek istiyorum.",
    "Performans değerlendirmem haksız yapıldı; somut verilerle itiraz etmem gerekiyor.",
    "Yöneticimin subjektif kriterlerle verdiği düşük performans puanına itiraz etmek istiyorum.",
  ],

  "is-arkadasi-fikir-calma": [
    "Benim hazırladığım öneriyi toplantıda kendi fikri gibi sundu, bununla yüzleşmek istiyorum.",
    "Toplantıdaki proje önerisi gerçekten çok beğenildi, müdür de onayladı.",
    "Emeğimi çalan iş arkadaşına bir daha bunu yapmaması için açıkça söylemem gerekiyor.",
  ],

  "is-teklifi-yan-hak-pazarlik": [
    "Maaş dışındaki yan hakların iyileştirilmesini talep etmek istiyorum.",
    "Özel sağlık sigortası ve yemek kartı konusunda bütçe esnekliği var mı diye sormak istiyorum.",
    "Maaşta anlaştık ama yan haklar yetersiz; bu konuyu tekrar açmak istiyorum.",
  ],

  "mikro-yonetim-sinir": [
    "Her yaptığım işi saat saat kontrol eden ve hareket alanı bırakmayan yöneticime sınır çizmek istiyorum.",
    "Yöneticim detaylara fazla giriyor, güven duyulmadığını hissediyorum; bunu konuşmalıyım.",
    "Saat kaçta ne yapacağımı takip eden yöneticimle rahat çalışma ortamını konuşmam gerekiyor.",
  ],

  "mulakat-uygunsuz-soru": [
    "Mülakatta evlilik planlarımı sordular; profesyonelce nasıl geçiştiririm?",
    "İK çocuk planım olup olmadığını sordu; kişisel hakkımı koruyarak nasıl yanıt veririm?",
    "Mülakatçı seyahat engelim olup olmadığını sormak yerine özel hayatımı sorguladı.",
  ],

  "ihbar-suresi-kisaltma": [
    "Yeni işe hemen başlamam gerekiyor; yasal ihbar süremimi kısaltmak için yöneticimle konuşmam lazım.",
    "İhbar süresini ücretli izinle mahsuplaştırmak istiyorum, yöneticimi ikna etmem gerekiyor.",
    "İhbar sürem 4 hafta ama yeni işe 2 haftada başlamam lazım; nasıl anlaşabilirim?",
  ],

  "mobbing-sinir-cizme": [
    "Bu işi beceremeyeceksen bence buralarda vakit kaybetme dedi; cevap vermem gerekiyor.",
    "Kıdemli bir iş arkadaşım sürekli küçümseyici konuşuyor; sınır çizmem lazım.",
    "İğneleyici ve aşağılayıcı sözler söylüyor; profesyonelce ama sert yanıt vermek istiyorum.",
  ],

  "is-arkadasi-sinir": [
    "Ya ben bugün biraz yoğunum da, şu raporun kalan kısmını sen halledebilir misin rica etsem?",
    "Benim işimi de yükleniyorum; kendi sorumluluklarını üstlenmeyen iş arkadaşıma sınır koymam gerekiyor.",
    "Projedeki payını yapmıyor, bana yıkmaya çalışıyor; bunu kırmadan ama net söylemem lazım.",
  ],

  "uzaktan-calisma-talebi": [
    "Uzaktan çalışma imkânı istiyorum; bu talebi yöneticime nasıl sunabilirim?",
    "Haftada 2-3 gün evden çalışmayı talep etmek istiyorum.",
    "Ofise gelme zorunluluğunun azaltılmasını yöneticimle görüşmek istiyorum.",
  ],

  "eski-patrondan-referans": [
    "Yeni iş başvurusu için eski patronumdan referans mektubu istemek istiyorum.",
    "Eski yöneticimle aradan yıllar geçti; referans için nasıl ulaşsam?",
    "İşten ayrılırken pek iyi bitmemişti; eski patrondan referans istemek zor.",
  ],

  "is-gorusmesinde-maas-pazarligi": [
    "Mülakatta beklentimin altında bir maaş teklif etti; müzakere etmem gerekiyor.",
    "Teklif edilen rakam piyasanın altında; değerimi nasıl savunabilirim?",
    "Maaş müzakeresinde ne diyeceğimi bilmiyorum; hazırlık yapmak istiyorum.",
  ],

  "is-yuku-dengeleme-yoneticiye": [
    "Ekipten ayrılan kişinin işlerini de yapıyorum; bu sürdürülebilir değil.",
    "Görev dağılımı adaletsiz; ek iş yükünün bölüştürülmesini istemek istiyorum.",
    "İki kişilik iş yapıyorum; fazla iş yükümün kabul edilmesine artık devam edemem.",
  ],

  "is-arkadasina-sinir-koyma": [
    "İş arkadaşım sürekli kişisel konularını anlatıp çalışma saatlerimi baltalıyor.",
    "Ofiste beni yoğun mesajlarla boğuyor; bir sınır koymam lazım.",
    "Kişisel sınırlarıma saygı duymayan iş arkadaşıma açıkça söylemem gerekiyor.",
  ],

  "terfi-neden-ben-degilim": [
    "Terfi açıklandı ama beni es geçtiler; nedenini sormak ve değerlendirmemi istemek istiyorum.",
    "Aynı pozisyona daha az deneyimli biri terfi etti; bunu yöneticimle konuşmam lazım.",
    "Terfi sürecinde neden değerlendirilmediğimi anlamak ve adımlarımı belirlemek istiyorum.",
  ],

  // ─── FLÖRT / İLİŞKİ ────────────────────────────────────────────────────────

  "flort-netlik": [
    "İlişkimizin son dönemdeki soğukluğu ve belirsizliği hakkında konuşmak istiyorum.",
    "Aramızdaki durumu netleştirmek istiyorum; ne hissediyorsun, nereye gidiyoruz?",
    "Belirsizlikten bunaldım; niyetini açıkça bilmek istiyorum.",
  ],

  "gec-cevap-flort": [
    "Kusura bakma canım ya yoğunluktan anca bakabildim telefona. Naber?",
    "Yazdım ama saatler sonra 'ne yapalım?' diye döndü; soğuk bir yanıt vermek istiyorum.",
    "6 saattir görüldü atmış, şimdi 'naber?' yazıyor; bunu nasıl yanıtlayayım?",
  ],

  "eski-sevgili-donus": [
    "Selam, geçen gün seni düşündüm de... Nasılsın, her şey yolunda mı?",
    "Aylarca sessizken aniden 'nasılsın?' diye yazdı; net ve soğuk bir yanıt vermek istiyorum.",
    "Eski sevgilim tekrar ulaşmaya çalışıyor; geri dönüş istemediğimi net belirtmem gerekiyor.",
  ],

  "ilk-mesaj-flort": [
    "Profilindeki müzik paylaşımını gördüm, bu grubu ben de çok seviyorum.",
    "Ortak bir arkadaşından çok şey duydum seni; tanışmak istedim.",
    "Sosyal medyada paylaşımlarını takip ediyordum; ilk mesajı atmak istiyorum.",
  ],

  "iliski-adi-koyma": [
    "İlişkimizin şu anki yönü ve geleceği hakkında netleşmek istiyorum.",
    "Aylardır flört aşamasındayız; adını koymak istiyorum.",
    "Nereye gittiğimizi bilmek istiyorum; 'ne oluyoruz biz?' konuşmasını yapmam gerekiyor.",
  ],

  "kiskanc-flort-sinir": [
    "O arkadaşlarınla bu kadar sık görüşmeni ve dışarı çıkmanı istemiyorum.",
    "Kim o kişi diye sorguluyor, sosyal hayatıma müdahale ediyor; sınır koymam lazım.",
    "Kıskanç ve kontrolcü davranışlarına dur demem gerekiyor.",
  ],

  "ayrilik-konusmasi": [
    "Son zamanlarda aramızdaki kopukluğu hissediyorum, bir şeyler ters gidiyor sanki.",
    "Birlikteliğimizi sonlandırmak istiyorum; bunu nazikçe ama net söylemem gerekiyor.",
    "Hislerim değişti; sona erdirme konuşmasını yapmam gerekiyor.",
  ],

  "barisma-provasi": [
    "O günkü tavrın beni gerçekten çok kırdı, konuşmak istemiyorum şu an.",
    "Yaptığım hata yüzünden kırılan partnerime samimi bir özür dilemek istiyorum.",
    "Aramızdaki soğuğu gidermek ve barışmak istiyorum; nasıl başlayayım?",
  ],

  "bulusma-reddetme": [
    "Bu cuma akşamı yine o çok sevdiğin restorana gidelim mi? Seni çok özledim.",
    "Tekrar görüşmek istediğini söylüyor ama ben istemiyorum; nazikçe reddetmem gerekiyor.",
    "Kimyamızın uyuşmadığını hissettim; bir daha görüşmek istemediğimi iletmem lazım.",
  ],

  "gelecek-beklentisi-iliski": [
    "İlişkimizin ciddiyeti ve uzun vadeli planlarımız hakkında ne düşündüğünü merak ediyorum.",
    "Birlikteliğimizin nereye gittiğini bilmek istiyorum; ciddi misin, değil misin?",
    "Uzun vadeli bir ilişki istiyorum; partnerimin bu konuda aynı fikirde olup olmadığını anlamak istiyorum.",
  ],

  "sosyal-medya-sinirlari": [
    "Eski sevgilinin fotoğraflarını beğenmeye devam etmen beni huzursuz ediyor.",
    "Sosyal medyadaki bazı etkileşimlerin beni rahatsız ediyor; bunu kıskançlık krizine girmeden anlatmak istiyorum.",
    "İnstagram'daki davranışları nedeniyle sınır koymam gerekiyor.",
  ],

  "bulusma-sonrasi-sogukluk": [
    "Buluşmamızın ardından iletişimimiz biraz soğudu, her şey yolunda mı?",
    "Güzel geçen bir buluşmanın ardından aniden mesafeli davranmaya başladı; sebebini anlamak istiyorum.",
    "İlk buluşmadan sonra soğudu; duygusal bir sarmala girmeden durumu sormak istiyorum.",
  ],

  "birlikte-yasama-teklifi": [
    "İlişkimizin gidişatına göre artık aynı evi paylaşma zamanının geldiğini düşünüyorum.",
    "Birlikte yaşamayı teklif etmek istiyorum; bunu nasıl açayım?",
    "Beraber evde oturmayı konuşmak istiyorum, ama baskı yapmadan önermek istiyorum.",
  ],

  "iliski-alan-ihtiyaci": [
    "Seni çok seviyorum ama biraz kendime ve hobilerime vakit ayırmak istiyorum.",
    "Hafta sonları kendi alanıma ihtiyacım var; sevgilim bunu anlamıyor.",
    "Bireysel zamana ihtiyacım olduğunu belirtmek istiyorum; ilişkiyi zedelemeden nasıl anlatırım?",
  ],

  "ghosting-kapanis-mesaji": [
    "Sessizliğin ve aramalarıma dönmemen durumun netleştiğini gösteriyor.",
    "Günlerdir yazmadan ortadan kaybolan birine son ve onurlu bir mesaj atmak istiyorum.",
    "Ghosting yapan flörte, kapanış mesajı yazarak durumu kapatmak istiyorum.",
  ],

  "partner-karar-dayatmasi": [
    "Hafta sonu arkadaşlarla kampa gidiyoruz, senin de gelmen için her şeyi ayarladım.",
    "Bana sormadan plan yaptı; fikrimin alınması gerektiğini söylemek istiyorum.",
    "Ortak kararları tek başına aldığı için bunu kibarca ama net dile getirmek istiyorum.",
  ],

  "ex-naber-mesaji-red": [
    "Selam, dün akşam seni düşündüm. Nasılsın, görüşmeyeli hayat nasıl gidiyor?",
    "Eski sevgilim aniden yazdı; kapıyı tamamen kapatmak istiyorum.",
    "Bitmiş ilişkiden sonra yazan eskiye geri dönüş olmadığını net bir şekilde iletmek istiyorum.",
  ],

  "arkadas-kalalim-teklifi-red": [
    "Bence aramızdaki flört enerjisi bitti ama sen çok değerlisin, arkadaş olarak kalmayı çok isterim.",
    "Arkadaş kalalım dedi; ama benim için bu mümkün değil, reddetmem gerekiyor.",
    "Friend zone'a atıldım; duygusal açıdan bunu kabul edemeyeceğimi nazikçe belirtmek istiyorum.",
  ],

  "partner-ailesi-mudahale": [
    "Annemler hafta sonu bize gelip salonun düzenini değiştirmemizi söylediler, haklılar bence de değiştirelim.",
    "Partnerin ailesi ilişkimize müdahale ediyor; partnerimi bu konuda sınır koyması için ikna etmem lazım.",
    "Kayınvalidem evimizin düzenine karışıyor; partnerimle bu konuyu konuşmam gerekiyor.",
  ],

  "love-bombing-yavaslatma": [
    "Sen benim hayatımın aşkısın. Gelecek ay hemen evlilik hazırlıklarına başlayabiliriz bence.",
    "Yeni tanışmamıza rağmen çok büyük vaatler veriyor; süreci yavaşlatmak istiyorum.",
    "Çok hızlı ilerliyor; heyecanını kırmadan tempoyu yavaşlatmamı anlatmak istiyorum.",
  ],

  "flort-hesap-odeme": [
    "Hesap geldi, sen yine halledersin değil mi tatlım?",
    "Buluşmalarımızda sürekli ben ödüyorum; hesabı paylaşmayı teklif etmek istiyorum.",
    "Hesap konusunda adil bir çözüm bulmak istiyorum; nasıl açayım bunu?",
  ],

  "sadece-arkadaslik-cevabi": [
    "Sana karşı hissettiklerimi artık söylemem gerekiyor, seni seviyorum.",
    "İtiraf geldi ama karşılık veremiyorum; arkadaş olarak kalmak istediğimi nazikçe söylemem lazım.",
    "Benden hoşlandığını söyledi; duygularını incitmeden reddetmek istiyorum.",
  ],

  "ne-oluyoruz-biz-konusma": [
    "Uzun süredir birlikte oluyoruz ama hala adını koyamadık; bu konuşmayı yapmam gerekiyor.",
    "Flört aşamasında takılı kaldık; ilişkiyi resmileştirip resmileştirmeyeceğimizi konuşmak istiyorum.",
    "Ne hissettiklerini bilmiyorum; durumu netleştirmek için konuşmam lazım.",
  ],

  "kiskancligi-dile-getirme": [
    "O kişiyle kurduğun yakınlık beni rahatsız ediyor ama nasıl söyleyeceğimi bilmiyorum.",
    "Kıskançlık hissediyorum ama bunu kriz yaratmadan, olgun bir şekilde söylemek istiyorum.",
    "Bir durumdan rahatsız oldum; kavgaya dönüştürmeden konuşmak istiyorum.",
  ],

  "ayrilik-sonrasi-arkadas-kalalim": [
    "Ayrıldık ama arkadaş kalmayı önerdi; bu benim için sağlıklı değil, reddetmem gerekiyor.",
    "Ayrılık sonrası iletişim kurmaya devam ediyor; net bir sınır koymam lazım.",
    "Ex'im arkadaşlık teklifini yeniledi; duygularım geçmeden bunu kabul edemeyeceğimi söylemem gerekiyor.",
  ],

  "uzun-mesafe-ilgi-azalma": [
    "Uzak mesafe ilişkimizde ilgi azalmaya başladı; bu durumu konuşmamız gerekiyor.",
    "Aradaki mesafe iletişimimizi bozuyor; düzenli görüşme planı yapmak istiyorum.",
    "Uzak mesafeli ilişkide karşı tarafın ilgisi seyreldi; durumu netleştirmek istiyorum.",
  ],

  // ─── AİLE / ARKADAŞ ────────────────────────────────────────────────────────

  "akraba-borc-reddi": [
    "Yeğenim/kuzenim, şu ara sıkıştım da bana bir 20 bin TL borç gönderebilir misin?",
    "Akrabam sürekli para istiyor; bu sefer nazikçe ama net geri çevirmek istiyorum.",
    "Ekonomik açıdan sıkıştığını söyleyen akrabam borç istedi; hayır demem gerekiyor.",
  ],

  "arkadas-kirginlik": [
    "Ya kanka çok acil bir işim çıktı, bugün buluşmayı erteleyelim mi ya?",
    "Sürekli son dakika iptal ediyor; artık birikmiş kırgınlığımı belirtmem lazım.",
    "Planları hep erteliyor; bu tavrından ne kadar rahatsız olduğumu söylemek istiyorum.",
  ],

  "aile-karar-aciklama": [
    "Kariyerimde kendi yeteneklerime uygun farklı bir alanda ilerlemeye karar verdim.",
    "İstediğim bölümü değil kendi istediğim alanı seçtim; aileme bunu anlatmam gerekiyor.",
    "Ailenin planladığı kariyeri değil kendi yolumu seçiyorum; bunu savunmam lazım.",
  ],

  "arkadas-borc-hatirlatma": [
    "Geçen aylardaki borcun durumunu konuşabilir miyiz?",
    "Üzerinden aylar geçti, borcunu hatırlatmak istiyorum ama arkadaşlığı bozmaktan çekiniyorum.",
    "Verdiğim parayı geri istemek istiyorum; bunu dostluğumuzu zedelemeden nasıl söylerim?",
  ],

  "davet-iptali-kibar": [
    "Akşama her şey hazır, sabırsızlıkla bekliyorum geleceksin değil mi?",
    "Gideceğimi söylediğim davete katılamayacağım; son dakika iptal etmem gerekiyor.",
    "Arkadaşım merakla bekliyor ama gelemeyeceğim; üzmeden nasıl anlatırım?",
  ],

  "aile-baski-evlilik": [
    "Yaşın geçiyor evladım, artık birini bulup yuva kurmanın zamanı gelmedi mi?",
    "Her fırsatta evlilik sorusu soruluyor; nazikçe ama net 'bu benim kararım' demem lazım.",
    "Aile baskısı evlilik konusunda çok yoğunlaşıyor; sınır koymam gerekiyor.",
  ],

  "ev-arkadasi-temizlik": [
    "Ortak alanların temizliği ve bulaşıkların birikmesi konusunda bir düzen oturtmamız gerekiyor.",
    "Ev arkadaşım ortak alanları temizlemiyor; bunu kızmadan ama net söylemem lazım.",
    "Bulaşıklar birikiyor, temizlik düzenimiz yok; nöbet sistemi önermek istiyorum.",
  ],

  "koruyucu-ebeveyn-sinir": [
    "Dün gece nerede kaldın? Kiminleydin? Neden telefonlarıma hemen bakmıyorsun?",
    "Annem/babam her adımımı takip ediyor; bağımsızlık alanı talep etmem gerekiyor.",
    "Ebeveyn baskısı ve fazla kontrolden bunaldım; sınır koymam lazım.",
  ],

  "dedikoducu-arkadas-uyari": [
    "Sana sadece senin bilmen şartıyla anlattığım konuyu başkasından duydum.",
    "Özel bir şeyi başkalarına söyledi; bu güven kırıklığını yüzüne vurrmam gerekiyor.",
    "Sırrımı ifşa etti; bunu ona açık ve net bir şekilde söylemek istiyorum.",
  ],

  "akraba-borc-talebi-red": [
    "Yeğenim acil ödemem var, bana bir 20 bin TL gönderebilir misin?",
    "Akrabam yine borç istiyor; bu sefer vermeyeceğimi saygılı bir şekilde belirtmem lazım.",
    "Borç verip geri alamayacağımı biliyorum; ama hayır demek zorundayım.",
  ],

  "aile-cocuk-bakimi-sinir": [
    "Aman ne olacak altı üstü bir çikolata yedi, biz seni de böyle büyüttük.",
    "Anne/babam çocuğumun eğitim kurallarını çiğniyor; müdahale etmelerini durdurmam gerekiyor.",
    "Çocuk yetiştirme konusunda koyduğum kurallara saygı gösterilmesini istiyorum.",
  ],

  "enerji-vampiri-arkadas": [
    "Hayatım yine çok kötü bir gün geçirdim, o iş yerindeki kız bana yine öyle baktı...",
    "Arkadaşım sürekli kendi sorunlarını anlatıyor, beni dinlemiyor; bu dengeyi konuşmak istiyorum.",
    "Her konuşma tek taraflı oluyor; karşılıklı destek ilişkisi istediğimi anlatmam lazım.",
  ],

  "hediye-begenmeme-gerginligi": [
    "Hediye için teşekkürler ama bu rengi pek sevmiyorum, fişi varsa değiştirebilir miyim?",
    "Özenle seçtiğim hediyeyi beğenmediğini hissettirdi; bu soğukluğu gidermek istiyorum.",
    "Hediyemi değersizleştirdi; bunu dürüstçe ama kızmadan söylemek istiyorum.",
  ],

  "arkadan-konusma-yuzlesme": [
    "Ben senin hakkında kötü bir şey söylemedim ki, yanlış anlamışsın.",
    "Arkadan konuştuğunu öğrendim; inkar ederse bile gerçeği biliyor olduğumu hissettirmek istiyorum.",
    "Güvenilir biri olmadığını anladım; arkadaşlığı bitirirken net bir yüzleşme yapmak istiyorum.",
  ],

  "uzaklasan-arkadasla-netlesme": [
    "Bu aralar çok yoğunum kanka, kusura bakma, pek vakit bulamıyorum.",
    "Son zamanlarda aramalarıma dönmüyor; aradaki sorunu anlamak istiyorum.",
    "Uzaklaşıyor gibi hissediyorum; varsa bir kırgınlığı konuşmak istiyorum.",
  ],

  "bayram-ziyareti-iptali": [
    "Bayramda tüm hazırlıkları yaptık, seni bekliyoruz oğlum/kızım. Biletini aldın mı?",
    "Bayramda memlekete gidemeyeceğim; ailem suçluluk hissettirmesin diye nasıl açıklarım?",
    "Kendi tatil planım var, bayramda aileye gidemiyorum; bunu anlatmak zor.",
  ],

  "arkadas-surekli-gec-kalma": [
    "Ya kanka yine 30 dakika gecikeceğim, trafik çok fena, kusura bakma.",
    "Her buluşmada geç kalıyor; bu davranıştan ne kadar bunaldığımı söylemek istiyorum.",
    "Zamanıma saygı gösterilmediğini hissediyorum; bunu arkadaşıma kızmadan belirtmek istiyorum.",
  ],

  "dugun-daveti-reddi": [
    "Gelecek ayki düğünüme mutlaka bekliyorum, sensiz bir düğün düşünemiyorum kanka.",
    "Şehir dışındaki düğüne gidemeyeceğim; çok yakın arkadaşıma bunu nasıl söylerim?",
    "Maddi durumum elvermediği için düğüne katılamıyorum; arkadaşı kırmadan bunu açıklamam lazım.",
  ],

  "kardesler-arasi-paylasim": [
    "Senin o ceketini giydim bugün, ne olacak ki altı üstü bir ceket.",
    "İzinsiz eşyalarımı alıyor; kişisel alanıma saygı duyulmasını istemek istiyorum.",
    "Kardeşim sınırlarımı çiğniyor; bunu aile içinde kavga çıkarmadan söylemek istiyorum.",
  ],

  "arkadastan-borc-isteme": [
    "Kanka sıkıştım, kısa süreliğine biraz para verebilir misin?",
    "Arkadaşımdan borç istemem gerekiyor ama utanıyorum; bunu nasıl açayım?",
    "Acil ihtiyacım var; arkadaşımdan yardım istemek istiyorum ama bunu nazikçe nasıl söylerim?",
  ],

  "baska-sehre-tasima-haberi": [
    "Yeni bir iş fırsatı için başka bir şehre taşınmayı düşünüyorum.",
    "Şehir değiştireceğimi aileye/arkadaşlara söylemem gerekiyor; onları kırmak istemiyorum.",
    "Taşınma kararım kesinleşti ama çevremdekilere bunu nasıl açıklayacağımı bilmiyorum.",
  ],

  "en-yakin-arkadasin-dugunune-katilamamak": [
    "Gelecek ayki düğünüme mutlaka bekliyorum, sensiz düşünemiyorum.",
    "En yakın arkadaşımın düğününe gidemeyeceğim; bunu ona nasıl söylerim?",
    "Düğüne katılmam mümkün değil ama bunu açıklamak çok zor.",
  ],

  "aile-whatsapp-kavgasini-durdurmak": [
    "Aile grubunda tartışma çıktı; müdahale etmek ama kışkırtmamak istiyorum.",
    "Aile WhatsApp grubundaki kavgayı durdurmam gerekiyor ama taraf tutmak istemiyorum.",
    "Gruptan iki kişi tartışıyor; barıştırıcı bir mesaj atmak istiyorum.",
  ],

  "arkadasin-sagliksiz-iliskisi": [
    "Arkadaşım sağlıksız bir ilişkide; endişelerimi paylaşmak istiyorum ama kızacak.",
    "Zararına olan ilişkisini sürdürüyor; onu uyarmak istiyorum ama müdahalecilik gibi görünmek istemiyorum.",
    "Arkadaşım için endişeleniyorum; bunu ona kırıcı olmadan söylemek istiyorum.",
  ],

  "kardes-ile-aile-sorumlulugu": [
    "Aile sorumluluklarını hep benim üstümde bırakıyor; dengeyi konuşmam lazım.",
    "Ebeveynlere kardeşimden çok ben bakıyorum; bu dengesizliği dile getirmek istiyorum.",
    "Ev/aile yükü hep bana düşüyor; kardeşimle bunu konuşmam gerekiyor.",
  ],

  // ─── PARA / PAZARLIK ───────────────────────────────────────────────────────

  "kira-artisi": [
    "Biliyorsun piyasa uçtu. Kirayı iki katına çıkarmamız gerekiyor, ne dersin?",
    "Kira artışı talebine itiraz etmek istiyorum; yasal sınırın üzerinde istiyor.",
    "Ev sahibi fahiş bir zam istiyor; hakkımı koruyarak müzakere etmek istiyorum.",
  ],

  "borc-geri-isteme": [
    "Sana geçen ay verdiğim borcun durumunu sormak durumundayım.",
    "Arkadaşıma verdiğim parayı geri istemek istiyorum; ama paragöz görünmekten çekiniyorum.",
    "Verdiğim borç ödenmedi; kırmadan ama net bir hatırlatma yapmam gerekiyor.",
  ],

  "musteri-indirim-reddi": [
    "Teklifiniz güzel ama bütçemizi aşıyor. %20 daha indirim yaparsanız hemen başlayalım.",
    "Müşteri ısrarla indirim istiyor; fiyatımı değer kaybettirmeden reddetmek istiyorum.",
    "İndirim talebini geri çevirmek istiyorum; müşteri kaçmasın ama fiyat kırmasın.",
  ],

  "kira-artisi-evsahibi": [
    "Mevcut ekonomik şartlar nedeniyle kira bedelini güncellememiz gerekiyor.",
    "Kirayı artırmam gerekiyor; kiracıyı kızdırmadan müzakere etmek istiyorum.",
    "Kira güncelleme konuşmasını yapmam gerekiyor; kiracı anlayışlı olur umarım.",
  ],

  "freelance-fiyat-savunma": [
    "Tasarım teklifiniz piyasanın oldukça üzerinde. Daha uygun fiyat veremez misiniz?",
    "Fiyatımı piyasanın üzerinde buluyor; emeğimi değersizleştirmeden savunmam lazım.",
    "Müşteri teklifimi pahalı buluyor; neden bu fiyata hak kazandığımı anlatmam gerekiyor.",
  ],

  "ikinci-el-pazarlik": [
    "İlanınızdaki çalışma masasını çok beğendim. Bütçem biraz kısıtlı, ortada buluşabilir miyiz?",
    "İkinci el ürün almak istiyorum; satıcıyla fiyat üzerinde nasıl pazarlık yaparım?",
    "Beğendiğim ürünü biraz indirmek istiyorum; satıcıya bunu nezaketle nasıl önerebilirim?",
  ],

  "hasarli-urun-iade": [
    "Paketi teslim alırken hasar tespit tutanağı tutturmadıysanız sorumluluk bize ait değildir.",
    "Hasarlı ürün geldi; satıcı sorumluluktan kaçıyor ama tüketici haklarımı biliyorum.",
    "Kırık gelen ürünü değiştirmek istiyorum; direniş gösteren satıcıyla nasıl konuşurum?",
  ],

  "ortak-tatil-gider-paylasimi": [
    "Geçen haftaki tatil otel ve yemek masraflarının dökümünü çıkardım, senin payın 6.200 TL tutuyor.",
    "Ortak tatil masraflarını arkadaşımdan istemek istiyorum; ama rahat görünmek istemiyorum.",
    "Tatil harcamalarını ben karşıladım; arkadaşım kendi payını ödemedi, nasıl konuşurum?",
  ],

  "arac-alim-pazarlik": [
    "Aracım hatasız, boyasızdır. Son fiyatım ilanda yazandır, pazarlık teklif etmeyin lütfen.",
    "Satıcı fiyatta kesinlikle indirim yapmak istemiyor; nasıl ikna edebilirim?",
    "Beğendiğim aracı bütçeme göre almak istiyorum; sert bir satıcıyla nasıl pazarlık yaparım?",
  ],

  "hizmet-abonelik-iptali": [
    "Sözleşmeniz gereği taahhüdünüz devam ediyor, iptal durumunda cayma bedeli yansıtılacaktır.",
    "Spor salonu üyeliğimi iptal ettirmek istiyorum; cayma bedeli ödemekten kaçınmak istiyorum.",
    "Aboneliği taahhüt bitmeden iptal ettirmek istiyorum; yasal hakkımı kullanmak istiyorum.",
  ],

  "grup-hediye-butce-tartismasi": [
    "Arkadaşlar, kişi başı 3.000 TL topluyoruz, herkes IBAN'a göndersin.",
    "Grup hediyesi bütçesi çok yüksek; itiraz etmek istiyorum ama cimri görünmekten çekiniyorum.",
    "Ekonomik durumum iyi değil; grup arkadaşlarına bunu nezaketle nasıl belirtirim?",
  ],

  "ev-sahibi-fahis-kira": [
    "Çevredeki kiralar yükseldi, sizin kirayı da bu tutara çıkarmam gerekiyor.",
    "Ev sahibi tahliye tehdidiyle beraber fahiş bir zam istiyor; haklarımı koruyarak müzakere etmeliyim.",
    "Yasadışı bir kira artışı talebiyle karşı karşıyayım; hukuki açıdan savunmam gerekiyor.",
  ],

  "freelance-odeme-tahsili": [
    "Projeyi onayladık ancak muhasebe departmanında onay bekliyor, bu hafta ödeme çıkacaktır.",
    "İşi teslim ettim ama ödeme gelmiyor; yaptırım uygularken ilişkiyi de korumak istiyorum.",
    "Haftalardır para ödenmiyor; sert ama profesyonel bir tahsilat görüşmesi yapmam gerekiyor.",
  ],

  "dugun-takisi-borc-isteme": [
    "Kanka şu an durumlar biraz sıkışık, biliyorsun evlilik masrafları çok tuttu.",
    "Düğünde borç verdiğim altını geri istemek istiyorum; nasıl söylerim?",
    "Verdiğim altın hâlâ iade edilmedi; dostluğu zedelemeden bunu hatırlatmam lazım.",
  ],

  "ise-giren-arkadas-borc": [
    "Yeni işe girdim ama ilk maaşla hemen borçlarımı kapatamadım, biraz daha zamana ihtiyacım var.",
    "İşe girdi, maaş alıyor ama borcu ödemiyor; artık ödeme konusunda kesin konuşmam lazım.",
    "Lüks harcamalar yapıyor ama bana borçlu; bunu diplomatik ama net biçimde gündeme getirmeliyim.",
  ],

  "gym-uyelik-devir-pazarlik": [
    "Kalan 6 aylık üyeliğinize talibim ama salon devir ücreti alıyormuş, indirim yapabilir misiniz?",
    "Üyeliği devrediyorum; alıcı devir ücretini bana yıkmaya çalışıyor.",
    "Spor üyeliğimi devretmek istiyorum; fiyat konusunda pazarlık yapmam gerekiyor.",
  ],

  "miras-paylasimi-kardes": [
    "Ben yıllarca annemlerin yanındaydım, eve ben baktım. O ev bende kalmalı.",
    "Miras paylaşımında haksızlık yapılıyor; kardeşimle hukuki çerçevede konuşmam lazım.",
    "Eşit pay istemiyorum ama az verilmesini de kabul etmiyorum; kardeşimle uzlaşmam gerekiyor.",
  ],

  "kurum-hatali-fatura-itiraz": [
    "Bu fatura normalin çok üzerinde geldi; kurumla itiraz görüşmesi yapmam lazım.",
    "Hizmet almadığım halde faturama ücret yansıtılmış; itiraz etmek istiyorum.",
    "Hatalı fatura konusunda müşteri hizmetleriyle konuşmak ve düzeltilmesini talep etmek istiyorum.",
  ],

  "eski-sevgili-esya-iadesi": [
    "Ayrıldık ama eşyalarım hâlâ onun evinde; geri almak istiyorum.",
    "Ayrılık sonrası eşyalarını almak veya vermek için iletişim kurmam gerekiyor.",
    "Ex'imde kalan eşyalarımı geri isteyeceğim; duygusal bir tartışmaya girmeden bunu nasıl yönetirim?",
  ],

  "son-dakika-davet-iptali": [
    "Bu akşam birlikteyiz değil mi? Her şeyi ayarladım!",
    "Gideceğimi söylediğim etkinliği son dakika iptal etmem gerekiyor.",
    "Beklenmedik bir durum oluştu; daveti son anda iptal etmek zorundayım.",
  ],

  "is-ortakligi-sonlandirma": [
    "İş ortaklığımızı sonlandırmak istediğimi söylemem gerekiyor.",
    "Ortak olduğum kişiyle iş birliğini bitirmek istiyorum; bunu profesyonelce nasıl açıklarım?",
    "Ortaklığımız sürdürülemez hale geldi; kavga etmeden ayrılmak istiyorum.",
  ],

  "arkadas-kisisel-bakim-uyari": [
    "Arkadaşımın kişisel bakımı veya hijyeni konusunda endişeleniyorum; nasıl söylerim?",
    "Bu konuyu söylemek utandırıcı ama söylemeliyim; nazikçe nasıl giriş yaparım?",
    "Sağlığıyla ilgili endişelerimi paylaşmak istiyorum ama incitmek istemiyorum.",
  ],

  "aday-is-basvurusu-reddetme": [
    "Başvurusunu değerlendirdim ama uygun bulmadım; bunu nazikçe nasıl iletirim?",
    "İş için başvuran birine olumsuz geri dönüş vermem gerekiyor; profesyonelce nasıl yaparım?",
    "Aday uygun değil; reddetme mesajını insancıl ama net biçimde yazmak istiyorum.",
  ],

  "sosyal-medya-tanisma-red": [
    "Sosyal medyadan mesaj attı; görüşmek istiyor ama ben istemiyorum.",
    "Tanımadığım biri buluşma teklif ediyor; nazikçe ama kesin reddetmem lazım.",
    "Online tanışma isteğini kabul etmek istemiyorum; bunu kibarca nasıl iletebilirim?",
  ],

  // ─── ZOR MESAJLAR ─────────────────────────────────────────────────────────

  "konuyu-kapatma": [
    "Eee senin şu özel hayat/iş konusu ne oldu ya? Hala bir gelişme yok mu, anlatsana?",
    "Tekrar aynı konuyu açtı; bu konuda konuşmak istemediğimi net söylemek istiyorum.",
    "Rahatsız edici bir konuyu sürekli açıyor; nazikçe ama kararlı biçimde kapatmak istiyorum.",
  ],

  "goruldu-sonrasi-yazma": [
    "Bir önceki mesaja cevap vermeyip görüldü attıktan sonra gelen sessizlik.",
    "Görüldü attı, cevap vermedi; kendimi küçük düşürmeden bunu toparlamak istiyorum.",
    "Mesajıma görüldü atıp devam etti; muhtaç görünmeden bu durumu kapatan bir şey yazmak istiyorum.",
  ],

  "pasif-agresif-cevap": [
    "Sanırım projenin önemini tam kavrayamadın ya da vaktin yoktu. Yine de eline sağlık.",
    "İmalı ve üstü kapalı suçlayıcı bir mesaj aldım; profesyonelce yanıt vermem gerekiyor.",
    "Pasif-agresif bir mesaj attı; sınırımı koyarken profesyonel kalmak istiyorum.",
  ],

  "kahve-daveti-reddi": [
    "Bu hafta sonu müsait olunca bir kahve içelim mi, ne dersin?",
    "İlgi duymadığım biri buluşmak istiyor; onu kırmadan ama net reddetmek istiyorum.",
    "Kahve davetini nazikçe geri çevirmem gerekiyor; ısrar ederse nasıl yanıtlarım?",
  ],

  "is-teklifi-kibar-red": [
    "Tüm aşamaları başarıyla tamamladınız, sizi aramızda görmek istiyoruz.",
    "Mülakatlarını geçtiğim firmayı reddetmem gerekiyor; gelecekte kapı açık kalsın.",
    "Şartları uygun olmayan iş teklifini kibarca geri çevirmek istiyorum.",
  ],

  "yanlis-mesaj-kurtarma": [
    "Bu ne biçim bir mesaj? Benim hakkımda böyle mi düşünüyordun gerçekten?",
    "Yanlış kişiye mesaj gönderdim; durumu kurtarmam gerekiyor.",
    "Hakkında konuştuğum arkadaşıma yanlışlıkla mesaj gitti; özür dileyip toparlamam lazım.",
  ],

  "davetsiz-misafir-reddi": [
    "Haftaya İstanbul'a geleceğim de, otellere para vermeyeyim diyorum. Sizde 3-4 gün kalabilir miyim?",
    "Yatılı kalmak istiyor ama ben istemiyorum; kibarca reddetmem gerekiyor.",
    "Evde yatılı kalma talebi geldi; akraba ilişkisini bozmadan hayır demek istiyorum.",
  ],

  "arkadas-borc-talebi-red": [
    "Kanka çok acil 15 bin TL lazım, maaşı alınca hemen göndereceğim söz.",
    "Borç vermek istemiyorum; arkadaşı kırmadan bunu söylemenin yolunu bulmalıyım.",
    "Para konusunda hayır demek zor; ama bu sefer geri ödeceğini zannetmiyorum.",
  ],

  "guven-kiran-ozur": [
    "Bana güvenip anlattığın bir şeyi başkasına söyledim; özür dilemeye gidiyorum.",
    "Hatamı fark ettim; güvenini kırdım ve samimi özür dilememiz gerekiyor.",
    "Söz verdiğim halde tutmadım; özür dileyip güveni yeniden inşa etmek istiyorum.",
  ],

  "hastalik-haberini-paylasma": [
    "Sağlık durumumu yakınlarımla veya işverenimi ile paylaşmam gerekiyor.",
    "Teşhisimi yakınlarıma söylemek istiyorum; ama nasıl tepki vereceklerinden çekiniyorum.",
    "Hastalığım hakkında konuşmam gerekiyor; aşırı üzülmelerini istemiyorum.",
  ],

  "arkadasligi-bitirme-sinyali": [
    "Sana bir şey söylemem gerekiyor; aramızdaki arkadaşlık artık benim için sağlıklı değil.",
    "Arkadaşlığı bitirmeye karar verdim; bunu ona saygıyla nasıl iletirim?",
    "Bu ilişkinin bana iyi gelmediğini fark ettim; sonlandırmak istiyorum.",
  ],

  "rahatsiz-edici-davranis-bildirme": [
    "Davranışın beni rahatsız ediyor; bunu sana söylemem gerekiyordu.",
    "Birisinin beni rahatsız eden davranışını yüzüne karşı söylemek istiyorum.",
    "Bu davranışın benim için sorun yarattığını karşı tarafa bildirmem lazım.",
  ],

  "yanlis-anlasilan-niyet-aciklama": [
    "Yanlış anlaşıldım; niyetimi açıklamam gerekiyor ama savunmaya geçmek istemiyorum.",
    "Söylediğim bir şey yanlış yorumlandı; durumu açıklığa kavuşturmak istiyorum.",
    "Bir mesajım veya davranışım yanlış anlaşıldı; bunu büyütmeden düzeltmem lazım.",
  ],

  "onemli-bir-hayir": [
    "Büyük ve önemli bir konuda hayır demem gerekiyor; baskı altında hissediyorum.",
    "Uzun süredir ertelediğim bir hayırı söylemenin zamanı geldi.",
    "Bu kişiye hayır demek benim için çok zor ama artık söylemem şart.",
  ],

  // ─── EĞİTİM / OKUL ────────────────────────────────────────────────────────

  "grup-arkadasi-kaytarma": [
    "Kanka ben bu aralar çok yoğunum, slaytları siz halledersiniz değil mi?",
    "Ödevde hiçbir şey yapmıyor ama ismi yazılacak; bunu ona söylemem gerekiyor.",
    "Grup ödevinde çalışmıyor; uyarmak istiyorum ama ekibi bozmak istemiyorum.",
  ],

  "hoca-not-itiraz": [
    "Sınav kağıtlarını son derece objektif okudum, itirazı olan resmi dilekçe versin.",
    "Sınav notumda hata olduğunu düşünüyorum; hocaya saygılı ama net itiraz etmem gerekiyor.",
    "Beklediğimden düşük not aldım; hocanın kağıdımı tekrar incelemesini istemek istiyorum.",
  ],

  "danisman-tez-inceleme": [
    "Hocam, teslim ettiğim tez taslağı üzerindeki düzeltmelerinizi bekliyor olacağım.",
    "Danışman hocam tezimi haftalardır okumadı; bunu nazikçe hatırlatmam gerekiyor.",
    "Tez geri bildirimi gelmedi; mezuniyetim tehlikede, hocaya diplomatik hatırlatma yapmalıyım.",
  ],

  "grup-odevi-liderlik": [
    "Arkadaşlar merhaba, ödev teslimine 3 gün kaldı. Herkes kendi bölümünü ne zaman tamamlayabilir?",
    "Grubu harekete geçirmeye çalışıyorum; kimse çalışmıyor, müdahale etmem lazım.",
    "Ödev yaklaşıyor, herkes pasif; grubu motive edip iş dağıtımı yapmam gerekiyor.",
  ],

  "hoca-referans-mektubu": [
    "Yüksek lisans başvurum için referans mektubu yazmanızı rica edebilir miyim?",
    "Hocadan akademik destek talep ediyorum; bunu nazikçe nasıl yazarım?",
    "Dersinizden iyi bir not aldım; referans mektubu için size başvurmak istiyorum.",
  ],

  "ogrenci-isleri-burs-kesintisi": [
    "Yönetmelik gereği alttan iki dersiniz olduğu için bursunuz otomatik olarak kesilmiştir.",
    "Bursumu haksız yere kestiler; komisyona sevk ettirmeye çalışıyorum.",
    "Bürokrasiyle mücadele etmem gerekiyor; memuru yumuşatıp dilekçeyi işleme sokturmalıyım.",
  ],

  "hoca-proje-ek-sure": [
    "Hocam, bilgisayarımın bozulması nedeniyle projeyi yetiştiremedim, 2 gün ek süre verebilir misiniz?",
    "Sağlık raporu aldım ama projeyi yetiştiremeyeceğim; hocadan mazeret kabul ettirmem lazım.",
    "Teknik sorunlar yüzünden teslim tarihi kaçırdım; hocanın anlayış göstermesini istiyorum.",
  ],

  "veli-ogretmen-sinir-cizme": [
    "Benim çocuğum evde sürekli çalışıyor, sizin dersinizden nasıl 40 alır?",
    "Öğrenci velisi agresif şekilde not itirazı yapıyor; sakin ama kararlı yanıt vermem lazım.",
    "Veli çocuğunun düşük notunun sebebini bende arıyor; profesyonelce açıklamam gerekiyor.",
  ],

  "sinav-notu-itiraz": [
    "Sınav sonucuna itiraz etmek istiyorum; puanlama hatası olduğunu düşünüyorum.",
    "Beklediğimden düşük not aldım; bunu tartışmaya açmak istiyorum.",
    "Sınav kağıdımda hak etmediğim puan var; hocaya resmi yoldan itiraz etmek istiyorum.",
  ],

  "odev-katkisiz-arkadas-sikayet": [
    "Ödevde hiçbir katkısı olmadı ama ismini yazmamı bekliyor.",
    "Grup ödevine katılmayan arkadaşın ismini yazmayacağımı söylemem lazım.",
    "Katkısız kalan kişiye düzeltme fırsatı vermek istiyorum, ama önce uyarmam gerekiyor.",
  ],

  "kongre-butce-talebi": [
    "Kongreye katılmak için bütçe desteği talep etmek istiyorum.",
    "Akademik etkinlik için maddi destek istiyorum; bunu yöneticime nasıl sunarım?",
    "Kongre katılım ücreti için kurumdan destek istemek istiyorum.",
  ],

  "staj-linkedin-network-mesaji": [
    "Staj veya iş fırsatı için LinkedIn'de profesyonel bir mesaj atmak istiyorum.",
    "Sektördeki bir kişiye iş ağı kurmak için ulaşmak istiyorum; nasıl başlayalım?",
    "LinkedIn'de tanışmak ve mentorluk istemek istiyorum; ilk mesajı nasıl yazmalıyım?",
  ],

  // ─── GÜNLÜK YAŞAM ─────────────────────────────────────────────────────────

  "gurultucu-ust-komsu": [
    "Çocuklar koşuyor ne yapalım, apartmanda yaşamanın kuralları bunlar.",
    "Gece saatlerinde aşırı gürültü yapıyor; yüz yüze uyarmak istiyorum.",
    "Üst komşudan gelen sesler nedeniyle uyuyamıyorum; bunu kibarca ama net söylemek istiyorum.",
  ],

  "tesisatci-usta-gecikme": [
    "Usta diğer şantiyede acil işim çıktı, yarın sabah ilk iş oradayım.",
    "Yarım bırakıp gitmeyi alışkanlık haline getirmiş; bugün bitirmesini istiyorum.",
    "İşi günlerdir yarım bırakıyor; sınır koymam ve ya bitirmesini ya da iade vermesini istiyorum.",
  ],

  "apartman-park-kavgasi": [
    "Komşu selam, benim otopark numaram olan 12 numaralı yere aracını çekmişsin.",
    "Park yerime park etti; arabasını çekmesini istemek istiyorum.",
    "Tahsis edilen yerime sürekli başkası park ediyor; bunu çözmeliyim.",
  ],

  "kurye-paket-teslim-sikayet": [
    "Geldik ama zilinize bastık açan olmadı, paketinizi en yakın şubemizden alabilirsiniz.",
    "Evdeydim ama 'bulunamadı' notu bırakmış; bunu kurye firmasına bildirmek istiyorum.",
    "Kargo yanlış bilgi veriyor; paketi bugün getirmesini sağlamak istiyorum.",
  ],

  "internet-ariza-destek": [
    "Bölgenizde genel bir çalışma bulunmaktadır, kesintinin ne zaman düzeleceği belli değildir.",
    "İnternetim günlerdir kesik; müşteri hizmetleriyle somut çözüm almak istiyorum.",
    "Teknik ekibi yönlendirmelerini ve net bir tarih vermelerini istiyorum.",
  ],

  "apartman-yonetici-aidat-israfi": [
    "Apartmanın bakımı için aidatları bu ay 2.500 TL'ye çıkardık.",
    "Yapılmayan hizmetler için aidat artışı var; yöneticiden hesap sormak istiyorum.",
    "Aidatların nereye gittiğini anlamak istiyorum; şeffaflık talep edeceğim.",
  ],

  "komsuluk-evcil-hayvan-gerginligi": [
    "Benim köpeğim kimseye zarar vermez, aşızdır. Neden bu kadar korkuyorsunuz?",
    "Komşunun köpeği tasmasız geziyor ve çocuklarım korkuyor; bunu nazikçe uyarmak istiyorum.",
    "Ortak alanda tasmasız hayvan sorunu var; komşuluk ilişkisini bozmadan konuşmak istiyorum.",
  ],

  "restoran-hatali-hesap-itiraz": [
    "Bizde kuver ve sipariş sistemi otomatik işliyor efendim, o mezeler mutlaka servis edilmiştir.",
    "Hesapta almadığım kalemler var; garsonla veya müdürle konuşmam gerekiyor.",
    "Hatalı hesap geldi; saygılı ama kararlı bir şekilde düzeltilmesini istemek istiyorum.",
  ],

  "sokak-hyvani-besleme-tartismasi": [
    "Sokak hayvanı beslemek veya besletmemek konusunda komşumla anlaşmazlık yaşıyoruz.",
    "Komşum sokak hayvanlarına dokunmamı istiyor; sınırımı çizmek istiyorum.",
    "Hayvan besleme konusundaki görüş ayrılığını çözmek istiyorum.",
  ],

  "balkon-copu-komsu-uyari": [
    "Balkondan aşağıya çöp atıyor ya da suluyor; uyarmam gerekiyor.",
    "Balkonu düzgün kullanmıyor; düşman olmadan bunu söylemek istiyorum.",
    "Balkon sorunu yüzünden komşuyla konuşmam lazım; ama kavga çıkarmak istemiyorum.",
  ],

  "esnaf-bayat-urun-yuzlesme": [
    "Aldığım ürün bayat çıktı; esnafa bunu söylemek istiyorum.",
    "Dükkânda bayat ürün sattı; geri dönüp itiraz etmek istiyorum.",
    "Kalitesiz ürün aldım; satıcıyla yüzleşmek ama müzmin müşteri kalmak istiyorum.",
  ],

  "isten-cikarilma-haklari": [
    "İşten çıkarıldım; haklarımı talep etmem gerekiyor.",
    "Tazminatımı almak için işverenle konuşmam lazım.",
    "Haksız işten çıkarma mı? Yasal haklarımı talep etmek istiyorum.",
  ],

  "restoran-yanlis-siparis-sikayet": [
    "Yanlış sipariş getirdi; değiştirilmesini istemek istiyorum.",
    "Garson yanlış anlayıp farklı yemek getirdi; bunu kibarca söylemek istiyorum.",
    "Siparişim yanlış geldi; saygılı ama net biçimde değişim istemek istiyorum.",
  ],

  "kargo-kayip-hasar-sikayet": [
    "Kargom kayboldu veya hasarlı geldi; şikâyet etmem gerekiyor.",
    "Paket kaybolmuş; kargo firmasından sorumlu tutmak istiyorum.",
    "Hasarlı ürün geldi, kargo firmasına başvurmam gerekiyor.",
  ],

  "online-alisveris-iade-direnc": [
    "İade etmek istiyorum ama satıcı direnç gösteriyor.",
    "Tüketici haklarım var; iade talebimi reddeden satıcıya hakkımı anlatmam lazım.",
    "Yasal iade süresinde ürünü geri göndermek istiyorum ama sorun çıkartılıyor.",
  ],

  "tamirci-anlasma-ustu-ucret": [
    "Tamirci anlaşılan ücretten fazla istiyor; bunu kabul etmiyorum.",
    "Önceden konuşulan fiyatın üzerinde fatura kesti; itiraz etmek istiyorum.",
    "Söz verilen ücreti aşan bir fatura geldi; ödemeyi reddetmem gerekiyor.",
  ],

  "kalitesiz-hizmet-sikayeti": [
    "Aldığım hizmet beklentimin çok altında kaldı; şikâyet etmek istiyorum.",
    "Para ödedim ama hizmet kalitesi vaatlerle örtüşmüyor; geri bildirim vermek istiyorum.",
    "Hizmet berbat geçti; bunu sağlayıcıyla konuşmam gerekiyor.",
  ],

  "belediye-mahalle-sorunu": [
    "Mahalledeki bir sorun için belediyeyle muhatap olmam gerekiyor.",
    "Resmi bir şikâyet başvurusu yapmak istiyorum.",
    "Belediyeye sorunumuzu iletmem ve çözüm talep etmem lazım.",
  ],

  // ─── SOSYAL MEDYA / DİJİTAL ────────────────────────────────────────────────

  "wp-grubundan-cikma": [
    "Grupta sürekli siyaset ve asılsız haberler paylaşılıyor; gruptan ayrılmak istiyorum.",
    "WhatsApp grubundan çıkmadan önce kibar bir veda mesajı göndermek istiyorum.",
    "Akraba grubundan ayrılacağım; kırılmalarını istemiyorum ama artık katlanamıyorum.",
  ],

  "linkedin-satis-reddetme": [
    "Merhaba, şirketinizin süreçlerini optimize etmek için 15 dakikalık demo ayarlayabilir miyiz?",
    "LinkedIn'de satış teklifi geliyor; kısa ve kibarca reddetmek istiyorum.",
    "Sürekli demo talebi atıyor; net bir şekilde ilgilenmediğimi belirtmek istiyorum.",
  ],

  "instagram-fotograf-kaldirtma": [
    "Dünkü buluşmadan bir post paylaştım, bence harika çıktık!",
    "İzin almadan fotoğrafımı paylaştı; kaldırmasını istemek istiyorum.",
    "Kötü çıktığım fotoğraf paylaşıldı; arkadaşı kırmadan silmesini istemek istiyorum.",
  ],

  "wp-durum-israr-mesafe": [
    "Yine çok güzelsin/yakışıklısın, bir gün kahve içelim mi?",
    "WhatsApp hikayelerime sürekli yorum yapıyor; mesafeli tutmam gerekiyor.",
    "İlgisi var ama ben ilgilenmiyorum; flörtöz yorumları kesmek için ne demeliyim?",
  ],

  "wp-is-mesaj-siniri": [
    "Selam, pazartesi günkü sunum için şu raporu güncelleyebilir misin acaba?",
    "Hafta sonu iş mesajı atıyor; mesai sınırımı profesyonelce hatırlatmak istiyorum.",
    "Dinlenme hakkımı korumak istiyorum; sınırı net çizmem gerekiyor.",
  ],

  "linkedin-network-spam": [
    "Ağımı sizin gibi değerli profesyonellerle genişletmek istiyorum, çözümlerimizi incelemek ister misiniz?",
    "Satış niyetli bağlantı talebi geliyor; kibarca ama kesin reddetmek istiyorum.",
    "Bu bağlantı talebini kabullenmeye niyetim yok; nasıl yanıt veririm?",
  ],

  "dijital-eski-arkadas-istek": [
    "Selam kanka nasılsın? Uzun zamandır görüşemedik. Referans olabilir misin?",
    "Yıllardır habersiz, şimdi çıkar ilişkisiyle ulaşıyor; nazikçe reddedebilmeliyim.",
    "Yokluktan gelen istek var; kırmadan ama net 'yardım edemem' demek istiyorum.",
  ],

  "wp-sessize-alma-aciklamasi": [
    "Yazıyorum yazıyorum saatler sonra cevap veriyorsun. Eskisi gibi konuşmuyoruz hiç.",
    "Geç cevap vermemin onunla değil, dijital alışkanlıklarımla ilgili olduğunu anlatmak istiyorum.",
    "Dijital detoks yapıyorum; arkadaşımın yanlış anlamamasını sağlamak istiyorum.",
  ],

  "cocuk-fotografi-sosyal-medya": [
    "Bak ne güzel fotoğrafımızı paylaştım Instagram'da, herkes maşallah yazdı!",
    "Akrabam çocuğumun fotoğrafını paylaştı; bunu gönül kırmadan kaldırmasını istemek istiyorum.",
    "Çocuk güvenliğini gerekçe göstererek fotoğrafın kaldırılmasını kibarca talep edeceğim.",
  ],

  "linkedin-referans-istegi-red": [
    "Şirketinizdeki Senior Developer pozisyonuna başvuracağım. İK'ya CV'mi iletip referans olabilir misiniz?",
    "Tanımadığım biri LinkedIn'den referans istiyor; profesyonelce reddetmem lazım.",
    "Kefil olamayacağım biri için referans talep edildi; bunu açıklamam gerekiyor.",
  ],

  "icerik-calintisi-bildirme": [
    "Benim içeriğimi izinsiz kullanıyor; bunu bildirmem gerekiyor.",
    "Emek verdiğim içerik başkası tarafından çalınmış; haklarımı savunmak istiyorum.",
    "İçerik çalan kişiye bunu söylemem ve kaldırmasını talep etmem lazım.",
  ],

  "yanlis-yorumlanan-paylasim": [
    "Paylaşımım yanlış anlaşıldı; durumu açıklığa kavuşturmak istiyorum.",
    "Sosyal medyada bir paylaşımım olumsuz yorumlandı; nasıl yanıt vermeliyim?",
    "Niyetim farklıydı ama yanlış algılandı; savunmaya geçmeden açıklamak istiyorum.",
  ],

  "dm-israrci-yabanci-sinir": [
    "Sosyal medyada tanımadığım biri sürekli DM atıyor; sınır çizmem lazım.",
    "Mesaj bırakmaya devam eden yabancıya net bir sınır koymalıyım.",
    "İsrarla ulaşmaya çalışan birine 'artık yazmayın' demek istiyorum.",
  ],

  "grup-yanlis-bilgi-duzeltme": [
    "Grup içinde yanlış bilgi paylaşıldı; bunu düzeltmek istiyorum ama tartışma çıkmasın.",
    "Hatalı bilgiyi düzelteceğim; ama kişiyi küçük düşürmeden yapmak istiyorum.",
    "WhatsApp veya Slack grubundaki yanlışı kibarca düzeltmek istiyorum.",
  ],

  "eski-sevgili-sosyal-medya-takip": [
    "Ex'im sosyal medyadan takip etmeye devam ediyor; sınır koymak istiyorum.",
    "Ayrıldık ama dijital ortamda varlığını sürdürüyor; bunu konuşmam gerekiyor.",
    "Eski sevgiliye sosyal medya sınırı koymak veya engellemek istiyorum.",
  ],

  "linkedin-tavsiye-yazisi-isteme": [
    "Sizi tanıyan biri için LinkedIn'de tavsiye yazısı rica edeceksiniz.",
    "İş kolektifindeki birine tavsiye yazısı yazmasını istemek istiyorum.",
    "Bir profesyonelden LinkedIn tavsiyesi isteyeceğim; bunu kibarca nasıl yaparım?",
  ],

  "sahibinden-urun-anlasmazligi": [
    "Aldığım ürün ilan açıklamasıyla örtüşmüyor; satıcıyla konuşmam lazım.",
    "Satın aldığım ürün beklentimi karşılamadı; iade veya fiyat indirimi isteyeceğim.",
    "Satıcı yanlış tanıttı; diplomatik ama kararlı şekilde hakkımı arayacağım.",
  ],

  // ─── SAĞLIK & PSİKOLOJİ ────────────────────────────────────────────────────

  "terapiye-baslayacagim-aile": [
    "Terapiye başlamaya karar verdim; ailemin olumlu karşılamamasından çekiniyorum.",
    "Psikolog görmeye başlıyorum; bunu yakınlarıma söylemek istiyorum.",
    "Terapi desteği aldığımı açıklamak istiyorum; yargılanmaktan korkuyorum.",
  ],

  "depresyon-arkadasa-acilma": [
    "Arkadaşıma duygusal durumumu anlatmak istiyorum ama nasıl açayım?",
    "Bir süredir iyi değilim; güvendiğim birine bunu nasıl söylerim?",
    "Zor bir dönemden geçiyorum; yakınımla bunu paylaşmak istiyorum.",
  ],

  "burnout-is-yuku-azaltma": [
    "Tükenmişlik yaşıyorum; işverenimi bilgilendirip iş yükümü azaltmak istiyorum.",
    "Sağlığım bozulmaya başladı; iş yükü düzenlemesi için yöneticimle konuşmalıyım.",
    "Burnout yaşıyorum; bu durumu ifade ederken zayıf görünmek istemiyorum.",
  ],

  "aile-bagimlilik-yuzlesme": [
    "Aileme bağımlılık sorunum hakkında konuşmam gerekiyor.",
    "Madde bağımlılığı veya zararlı alışkanlık konusunu aileyle paylaşmak istiyorum.",
    "Bağımlılıkla mücadele ettiğimi yakınlarıma itiraf etmek istiyorum.",
  ],

  "kronik-hastalik-ise-bildirme": [
    "Kronik hastalığımı işverene bildirmem gerekiyor; nasıl yaklaşırım?",
    "Sağlık durumumu patronuma veya İK'ya bildirmek istiyorum; olası olumsuz tepkiden çekiniyorum.",
    "Hastalığım iş performansımı etkiliyor; bunu açıklamam gerekiyor.",
  ],

  "partner-duygusal-destek-isteme": [
    "Partnerimden daha fazla duygusal destek istiyorum; bunu nasıl dile getiririm?",
    "Zor bir dönemden geçiyorum; partnerimin daha yakın olmasını istiyorum.",
    "İhtiyaç duyduğum desteği alamıyorum; sitem etmeden bunu anlatmak istiyorum.",
  ],

  "arkadasin-yeme-aliskanliklarini-konusmak": [
    "Arkadaşımın sağlıksız beslenme veya yeme bozukluğu endişem var; söyleyebilir miyim?",
    "Endişelendiğimi söylemek istiyorum ama müdahaleci görünmekten korkuyorum.",
    "Sağlıklı olmayan bir davranış gözlemliyorum; bunu nazikçe dile getirmek istiyorum.",
  ],

  "ilac-kullanimi-aileye-paylasma": [
    "Psikiyatrik ilaç kullandığımı aileye söylemek istiyorum ama tepkilerinden çekiniyorum.",
    "İlaç kullanımım hakkında yakınlarıma bilgi vermek istiyorum.",
    "Tedavinin bir parçası olarak ilaç aldığımı açıklamak istiyorum.",
  ],

  "ikinci-gorusu-doktordan-isteme": [
    "Doktora ikinci görüş almak istediğimi söylemek istiyorum; nasıl açarım?",
    "Tedavi planını sorgulamak istiyorum; doktoru incitmeden nasıl yaparım?",
    "Farklı bir uzmanın görüşünü almak istiyorum; mevcut doktorum bunu yanlış anlayabilir.",
  ],

  "mental-saglik-izni-talebi": [
    "Ruh sağlığım nedeniyle izin almak istiyorum; bunu nasıl talep ederim?",
    "Zihinsel yorgunluk nedeniyle birkaç gün izin istemek istiyorum.",
    "Mental sağlık iznini nasıl alırım; yöneticim anlayış gösterir mi?",
  ],

  "terapistle-ilk-seans-acilma": [
    "Terapiste ilk kez gidiyorum; ne söyleyeceğimi bilmiyorum.",
    "Terapistime kendimi nasıl anlatırım; nereden başlayayım?",
    "İlk seansta neler beklediğimi ve ne anlatacağımı prova etmek istiyorum.",
  ],

  "stres-belirtileri-doktora-acma": [
    "Doktora gittiğimde stresten kaynaklanan belirtilerimi anlatmak istiyorum.",
    "Fiziksel semptomların stresle bağlantılı olduğunu düşünüyorum; doktora nasıl açıklarım?",
    "Belirtilerimi tam ve net anlatmak istiyorum; doktor küçümsemesin.",
  ],

  "doktora-zor-semptom-acma": [
    "Mahcup olduğum ya da zor olan bir semptomu doktora anlatmak istiyorum.",
    "Söylemekten çekindiğim bir sağlık sorunum var; doktora nasıl açarım?",
    "Belirtim utandırıcı geliyor ama tıbbi yardım almam lazım.",
  ],

  // ─── SOSYAL ANLAR ─────────────────────────────────────────────────────────

  "berber-saci-mahvetti": [
    "Berber saçımı beğenmediğim gibi kesti; bunu söylemek istiyorum.",
    "Berberde saçım istediğim gibi olmadı; memnun olmadığımı belirtmek istiyorum.",
    "Berberin yaptığı kesimden memnun değilim; nasıl söylerim?",
  ],

  "taksici-eksik-para-ustu": [
    "Taksici para üstümü tam vermedi; geri isteyeceğim.",
    "Ücreti ödedim ama bozuk para eksiği var; talep etmek istiyorum.",
    "Küçük bir miktar ama hakkım; taksiciye söylemek istiyorum.",
  ],

  "kafede-yanlis-siparis": [
    "Yanlış içecek getirdi; değiştirmesini istemek istiyorum.",
    "Sipariş yanlış geldi; garsonla konuşmak istiyorum.",
    "Doğru ürünü değil başkasını getirdi; nezaketle düzeltme istemek istiyorum.",
  ],

  "kuyrukta-sira-atlayan": [
    "Sıraya atladı; sıranızı aldığını nazikçe söylemek istiyorum.",
    "Benden sonra geldi ama önümü geçiyor; buna itiraz etmek istiyorum.",
    "Kuyruğa saygısız davranıldı; sert olmadan ama net sınır koymak istiyorum.",
  ],

  "akraba-evlilik-sorusu": [
    "Ne zaman evleniyorsunuz diye soruyor; bunu kesmek istiyorum.",
    "Her toplantıda evlilik sorusu geliyor; sınır koymak istiyorum.",
    "Evlilik konusunu kapatmak istiyorum; akrabayı kırmadan nasıl yaparım?",
  ],

  "ofis-mutfagi-bulasik": [
    "Ofis mutfağında bulaşık bırakan kolektif mesajı atmak istiyorum.",
    "Ortak alanda düzeni bozan biri var; uyarı mesajı nasıl yazarım?",
    "Bulaşık sorunu devam ediyor; kibar ama etkili bir hatırlatma yapmalıyım.",
  ],

  "toplantida-soz-kesen": [
    "Toplantıda sözümü kesti; dur demek istiyorum.",
    "Konuşuyor olduğum sırada dalıyor; bu davranışa sınır koymak istiyorum.",
    "Tekrar sözüm kesildi; ama çeviri ortamında şikâyet gibi görünmek istemiyorum.",
  ],

  "arkadas-habersiz-soz-verdi": [
    "Arkadaşım benim adıma söz verdi; razı olmadığımı söylemek istiyorum.",
    "Habersiz taahhüt verildi; bunu arkadaşıma kibarca ama net söylemek istiyorum.",
    "Beni sormadan bir şeye 'evet' dedi; ne hissettirdiğini anlatmak istiyorum.",
  ],

  "kilo-yorum-durdurmak": [
    "Kilomla ilgili yorum yapıyor; bunu kesmek istiyorum.",
    "Beden hakkında sürekli eleştiriler yapılıyor; dur demem lazım.",
    "Kilo yorumlarından rahatsız olduğumu söylemek istiyorum.",
  ],

  "arkadas-grubu-plana-katmadi": [
    "Arkadaş grubu plan yaptı ama beni dahil etmedi; bunu sormak istiyorum.",
    "Planlamadan beni hariç tuttular; nasıl hissettirdiğini anlatmak istiyorum.",
    "Gruba dahil edilmemek beni yaraladı; bunu nazikçe dile getirmek istiyorum.",
  ],

  "uçakta-koltuk-isguali": [
    "Koltuk numarasına rağmen başkası oturmuş; yerimden kalkmamı bekliyor.",
    "Bilet numarasına göre benim koltuk; ama işgal edilmiş, ne demeliyim?",
    "Koltuk paylaşımı konusunda uçakta nazikçe ama net konuşmam lazım.",
  ],

  "online-toplantida-kamera-reddi": [
    "Toplantıda kamerasını açmasını istediler, açmak istemiyor.",
    "Kamera açmak istemiyorum; bunu iletmek için nasıl yanıt vermeliyim?",
    "Görüntülü toplantı politikası hakkında itirazımı iletmek istiyorum.",
  ],

  "sigara-dumani-rahatsizlik": [
    "Sigara dumanından rahatsız oluyorum; bunu söylemek istiyorum.",
    "Ortak alanda sigara içilmesinden rahatsız oldum; uyarı yapmak istiyorum.",
    "Pasif içicilik rahatsızlığımı karşı tarafa nazikçe belirtmek istiyorum.",
  ],

  "sürekli-tavsiye-veren-birine-sinir": [
    "Her konuda tavsiye veriyor; artık bundan bıktım ama nasıl söylerim?",
    "Sürekli ne yapacağımı söylüyor; buna sınır koymak istiyorum.",
    "İstemediğim tavsiyeleri durdurmak istiyorum; nasıl söylerim?",
  ],

  "rekabetci-arkaşa-sinir": [
    "Her başarımı küçümsüyor ya da onunkiyle karşılaştırıyor; bunu durdurmak istiyorum.",
    "Rekabetçi tavrından bunaldım; bunu ona söylemek istiyorum.",
    "Sürekli rekabet duygusunu körüklüyor; bu davranıştan ne hissettirdiğimi anlatmak istiyorum.",
  ],
};
