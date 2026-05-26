# Ne Desem?

Ne Desem?, kullanicinin zor konusmalari ve mesajlari guvenli bir simulasyon akisi icinde prova etmesini hedefleyen bir web uygulamasidir.

Bu depoda Next.js App Router, Prisma, PostgreSQL, cookie tabanli auth, mock AI ve Zor Mesajlar odakli ilk MVP iskeleti bulunur.

## Yerel Kurulum

Gereksinimler:

- Docker Desktop
- Node.js ve npm, sadece scaffold ve lokal gelistirme komutlari icin

Next.js scaffold tamamlandiktan sonra yerel Docker akisi:

```bash
docker compose up -d
```

Uygulama:

- Local URL: `http://localhost:3000`
- App container portu: `3000`
- Postgres hostname: `db`

Local `docker-compose.yml` dosyasinda PostgreSQL icin `5432:5432` host port mapping bulunur. Bu sadece local/dev kolayligi icindir. Production/Coolify tarafinda DB host portu acilmaz.

## Docker Ile Calistirma

Local servisler:

- `ne_desem_app`: Next.js uygulamasi
- `ne_desem_db`: PostgreSQL

Local varsayilan AI modu `mock` olarak ayarlanmistir. DeepSeek API key olmadan da UI ve akisin test edilebilmesi hedeflenir.

Not: Ilk calistirmadan once Prisma migration komutunun uygulanmasi gerekir.

## Environment Variables

`.env.example` gercek secret icermez; sadece ornek degerler vardir.

| Degisken | Aciklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL baglanti adresi. Compose network icinde host `db` olmalidir. |
| `AUTH_SECRET` | Auth/session imzalama icin uzun rastgele deger. Production'da mutlaka degistirilmelidir. |
| `AI_MODE` | `mock` veya `deepseek`. Varsayilan: `mock`. |
| `DEEPSEEK_API_KEY` | DeepSeek modu icin server-side API key. Frontend'e gitmemelidir. |
| `DEEPSEEK_MODEL` | DeepSeek model id. Varsayilan: `deepseek-v4-pro`. |
| `NEXT_PUBLIC_APP_URL` | Uygulamanin public URL adresi. |

Local ornek:

```env
DATABASE_URL=postgresql://ne_desem:change_me@db:5432/ne_desem
AUTH_SECRET=change_me_long_random_string
AI_MODE=mock
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-pro
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Production'da `AUTH_SECRET`, `DATABASE_URL` ve PostgreSQL parolasi guclu ve benzersiz degerlerle verilmelidir.

## Mock AI Modu

`AI_MODE=mock` iken uygulama gercek AI servisine baglanmadan sahte ama gercekci cevaplar uretmelidir.

Bu mod:

- Ilk UI ve akis testleri icin varsayilandir.
- `DEEPSEEK_API_KEY` olmadan calismalidir.
- Frontend tarafina hicbir AI credential gondermemelidir.

## DeepSeek AI Modu

`AI_MODE=deepseek` secildiginde DeepSeek API cagirilari yalnizca server-side yapilir.
Varsayilan model `deepseek-v4-pro` olarak ayarlanmistir. API key yoksa uygulama mock moda geri duser.

Gerekli degisken:

```env
AI_MODE=deepseek
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-pro
```

`DEEPSEEK_API_KEY` kod icine, Dockerfile icine, compose dosyasina veya loglara yazilmamalidir. Coolify veya sunucu environment variable alani uzerinden verilmelidir.

## Prisma Migrate ve Seed

Gelistirme icin:

```bash
npx prisma migrate dev
```

Production icin:

```bash
npx prisma migrate deploy
```

Seed script'i eklendikten sonra:

```bash
npx prisma db seed
```

Production container startup sirasinda otomatik migration calistirmak riskli olabilir. Ilk kurulum ve deploy surecinde migration komutunun bilincli olarak ayrica calistirilmesi onerilir.

## Coolify Kurulum Notlari

Coolify uzerinde Docker Compose resource olustururken `docker-compose.prod.yml` kullanilabilir.

Kisa adimlar:

1. Repository'yi Coolify'a bagla.
2. Compose dosyasi olarak `docker-compose.prod.yml` sec.
3. Domain/proxy ayarini Coolify UI uzerinden yap.
4. App icin host port acma; compose dosyasi `expose: 3000` kullanir.
5. DB icin host port acma; PostgreSQL sadece compose network icinde kalir.
6. Environment variables alanindan gerekli degerleri gir.

Coolify icin app environment variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@db:5432/ne_desem
AUTH_SECRET=long_random_production_secret
AI_MODE=mock
DEEPSEEK_API_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.example
```

Bundled PostgreSQL servisi icin ayrica su degerleri Coolify environment alanindan vermek onerilir:

```env
POSTGRES_USER=USER
POSTGRES_PASSWORD=PASSWORD
POSTGRES_DB=ne_desem
```

`DATABASE_URL` icindeki user/password degerleri PostgreSQL servisindeki degerlerle ayni olmalidir.

## Guvenlik Notlari

- Gercek secret, API key, token, password veya `.env` icerigi commit edilmemelidir.
- DeepSeek API key hicbir zaman frontend'e gitmemelidir.
- AI cagirilari sadece server-side yapilmalidir.
- Production'da PostgreSQL host portu acilmamalidir.
- Loglarda secret veya kullanici ozel icerikleri gereksiz detayli tutulmamalidir.
- Uygulama terapi, hukuk, IK veya profesyonel danismanlik iddiasi tasimamalidir.

## Sonraki Scaffold Komutu

Next.js proje iskeleti icin onerilen komut:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --skip-install
```

Bu komut onay alinmadan calistirilmamalidir.
