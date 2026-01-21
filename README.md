# Milionerzy PŁ

Gra "Milionerzy PŁ" to interaktywna aplikacja edukacyjna stworzona na wzór popularnego teleturnieju. Projekt został zrealizowany w ramach przedmiotu **Komunikacja Człowiek-Komputer**.

Głównym celem aplikacji jest sprawdzanie wiedzy studentów w formie quizu, z możliwością zarządzania pytaniami przez wykładowców (administratorów).

---

## Technologie

**Frontend:**
- **React.js**: Biblioteka do budowy interfejsu użytkownika.
- **React Bootstrap**: Gotowe komponenty UI dla szybkiego i responsywnego designu.
- **React Router**: Obsługa nawigacji między podstronami.

**Backend:**
- **Node.js + Express.js**: Serwer aplikacji obsługujący logikę aplikacji oraz API.
- **SQLite**: Lekka, plikowa baza danych do przechowywania użytkowników, pytań i wyników.

---

## Instalacja i Uruchomienie

Aby uruchomić projekt na lokalnej maszynie, wykonaj poniższe kroki.

### Wymagania wstępne
- Zainstalowane środowisko [Node.js](https://nodejs.org/) (wersja 14+).
- Zainstalowany menedżer pakietów `npm` (domyślnie z Node.js).
- System kontroli wersji [Git](https://git-scm.com/).

### 1. Pobranie projektu
```bash
git clone https://github.com/ArturTkaczuk/KCK-Milionerzy
cd "Milionerzy PŁ"
```

### 2. Konfiguracja Backend'u
Przejdź do katalogu serwera, zainstaluj zależności i uruchom go:

```bash
cd backend
npm install
node server.js
```
Serwer uruchomi się domyślnie na porcie `5000` (http://localhost:5000).

### 3. Konfiguracja Frontend'u
W nowym oknie terminala przejdź do katalogu klienta:
```bash
cd frontend
npm install
npm start
```
Aplikacja kliencka uruchomi się na porcie `3000` (http://localhost:3000) i powinna otworzyć się automatycznie w przeglądarce.

---

## Funkcjonalności

### Dla Studenta (Użytkownik)
*   **Symulacja Logowania**: Wybór użytkownika z listy (logowanie bez hasła dla celów demonstracyjnych).
*   **Wybór Przedmiotu**: Przeglądanie dostępnych quizów tematycznych.
*   **Rozgrywka**:
    *   12 pytań o rosnącym stopniu trudności.
    *   Drabina wygranych (od 0 $ do 1 000 000 $).
    *   Gwarantowane progi punktowe (1000 $ i 40 000 $).
    *   **3 Koła Ratunkowe**:
        *   Ask the Audience (Pytanie do publiczności).
        *   50:50 (Pół na pół).
        *   Phone a Friend (Telefon do przyjaciela).
    *   Możliwość wycofania się z gry z obecną wygraną.
*   **Menu Boczne**:
    *   **Globalny Ranking**: Lista najlepszych wyników wszystkich graczy.
    *   **Historia Gier**: Szczegółowy podgląd własnych rozgrywek, w tym poprawności odpowiedzi na każde pytanie.

### Dla Wykładowcy (Administrator)
*   **Panel Administratora**: Dostępny po zalogowaniu jako wykładowca (`Lecturer`).
*   **Zarządzanie Przedmiotami**: Tworzenie i usuwanie przedmiotów (kategorii quizów).
*   **Edytor Pytań**:
    *   Dodawanie nowych pytań.
    *   Edycja treści, odpowiedzi i poziomu trudności istniejących pytań.
    *   Usuwanie pytań.

---

## Struktura Bazy Danych (SQLite)

Baza `backend/data/database.sqlite` zawiera tabele:

*   **users**: ID, nazwa, rola (student/admin).
*   **subjects**: ID, nazwa, slug (przyjazny URL).
*   **questions**: ID, treść, odpowiedzi (A-D), poprawna odpowiedź, trudność (1-4).
*   **leaderboard**: Wyniki gier (użytkownik, przedmiot, wynik, data).
*   **game_answers**: Szczegółowa historia odpowiedzi w danej grze.

---

## Autor
Projekt wykonany przez: **Artur Tkaczuk**
