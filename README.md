# Blog Platforma — Backend (CS310)

REST API za Blog platformu, izrađen u Node.js + Express + MongoDB (Mongoose).
Zamenjuje `json-server` simulaciju iz IT354 projekta pravim backendom.

## Tehnologije

- **Node.js + Express** — serverski deo i REST API
- **MongoDB + Mongoose** — baza podataka i modeli (3 entiteta: User, Post, Comment)
- **JWT (jsonwebtoken)** — autentifikacija
- **bcryptjs** — heširanje lozinki
- **JOI** — validacija ulaznih podataka (eksterna biblioteka)

## Pokretanje

1. Instaliraj zavisnosti:
   ```bash
   npm install
   ```

2. Napravi `.env` fajl (po uzoru na `.env.example`):
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/blogplatforma
   JWT_SECRET=neki_dug_nasumican_string
   PORT=3001
   ```
   - Za lokalni MongoDB treba ti instaliran Mongo (ili Docker).
   - Alternativa bez instalacije: napravi besplatan **MongoDB Atlas** nalog i
     iskopiraj connection string u `MONGO_URI`.

3. Napuni bazu test podacima:
   ```bash
   npm run seed
   ```

4. Pokreni server:
   ```bash
   npm start
   ```
   Server radi na `http://localhost:3001`.

## Test nalozi (nakon seed-a)

- Admin: `admin@blog.com` / `admin123`
- Korisnik: `marko@email.com` / `marko123`

## REST API rute

| Metoda | Ruta                 | Pristup            | Opis                                  |
|--------|----------------------|--------------------|---------------------------------------|
| POST   | /auth/register       | javno              | Registracija (vraća JWT)              |
| POST   | /auth/login          | javno              | Prijava (vraća JWT)                   |
| GET    | /auth/me             | prijavljen         | Podaci o trenutnom korisniku          |
| GET    | /posts               | javno              | Lista postova (sort, paginacija, filter, pretraga) |
| GET    | /posts/:id           | javno              | Jedan post                            |
| POST   | /posts               | prijavljen         | Kreiranje posta                       |
| PUT    | /posts/:id           | autor ili admin    | Izmena posta                          |
| POST   | /posts/:id/like      | prijavljen         | Lajk / odlajk (posebna funkcionalnost)|
| DELETE | /posts/:id           | **admin**          | Brisanje posta                        |
| GET    | /comments            | javno              | Komentari (filter `?postId=`)         |
| POST   | /comments            | prijavljen         | Dodavanje komentara                   |
| DELETE | /comments/:id        | autor ili admin    | Brisanje komentara                    |
| GET    | /users               | **admin**          | Lista korisnika                       |
| DELETE | /users/:id           | **admin**          | Brisanje korisnika                    |

### Sortiranje, paginacija, pretraga (GET /posts)

- `?_sort=createdAt&_order=desc` — sortiranje
- `?_page=1&_limit=6` — paginacija (ukupan broj u `X-Total-Count` zaglavlju)
- `?category=Programiranje` — filter po kategoriji
- `?q=react` — pretraga po naslovu/sadržaju

## Struktura

```
config/        — konekcija na bazu
models/        — Mongoose šeme (User, Post, Comment)
middleware/    — auth (JWT, RBAC) i validacija (JOI)
validation/    — JOI šeme
controllers/   — logika ruta
routes/        — definicije ruta
seed/          — punjenje baze test podacima
server.js      — ulazna tačka
```
