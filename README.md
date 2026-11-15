# Støyperiet – nettsida

Nettsida til folkepuben Støyperiet på Husnes.

> «Fellesskap i flytande form»

## Korleis sida kjem på nett

Sida ligg på **Netlify**, som er kopla til dette repoet. Kvar gong noko blir endra i greina `main`, byggjer Netlify sida på nytt og publiserer ho automatisk etter eit par minutt. Ingen manuell opplasting trengst.

Innstillingane for bygginga ligg i `netlify.toml`:

- Byggkommando: `npm run build`
- Publiseringsmappe: `dist`

Sida brukar ingen API-nøklar eller hemmelege verdiar. Skulle det kome til slike seinare, skal dei leggjast inn i Netlify under *Site configuration → Environment variables*, aldri i dette repoet.

## Kva ligg kvar

| Kvar | Kva |
|---|---|
| `App.tsx` | Oppsettet av heile sida, kva seksjonar som kjem i kva rekkjefølgje |
| `components/` | Kvar del av sida (meny, program, kviss, dugnad, opningstider, botn o.l.) |
| `seasonConfig.ts` | Sesongtilpassingar, t.d. julepynt og juleopningstider |
| `index.html` | Sidetittel, skildring for Google og sosiale medium |
| `public/` | Bilete, PDF-ar, favicon, `robots.txt` og `sitemap.xml` |
| `src/assets/images/` | Bilete som blir brukte inne i komponentane |

## Teknisk

Laga med React, TypeScript og Vite (opphavleg generert i Google AI Studio).

Køyre lokalt (krev Node.js):

```bash
npm install
npm run dev      # utviklingsserver på http://localhost:3000
npm run build    # lagar ferdig side i dist/
```
