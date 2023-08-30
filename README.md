# jsramverk

## Säkerhetshål och Åtgärder

Vi genomförde en säkerhetsgranskning med `npm audit` och identifierade följande sårbarheter. Här är de åtgärder vi vidtog:

### 1. debug <=2.6.8

- **Allvarlighetsgrad:** Hög
- **Sårbarhetstyp:** Otillräcklig komplexitet i reguljära uttryck
- **Åtgärd:** Uppdaterade `debug` till en säker version.

### 2. fresh <0.5.2

- **Allvarlighetsgrad:** Hög
- **Sårbarhetstyp:** Reguljära uttryck som kan utnyttjas för att orsaka tjänsteförnekande
- **Åtgärd:** Uppdaterade `fresh` till en säker version.

### 3. mime <1.4.1

- **Allvarlighetsgrad:** Måttlig
- **Sårbarhetstyp:** Mime-uppslag som kan utnyttjas för tjänsteförnekande
- **Åtgärd:** Uppdaterade `mime` till en säker version.

### 4. ms <2.0.0

- **Allvarlighetsgrad:** Måttlig
- **Sårbarhetstyp:** Otillräcklig komplexitet i reguljära uttryck
- **Åtgärd:** Uppdaterade `ms` till en säker version.

### 5. node-fetch <2.6.7

- **Allvarlighetsgrad:** Hög
- **Sårbarhetstyp:** Exponering av känslig information
- **Åtgärd:** Uppdaterade `node-fetch` till en säker version.

### 6. qs <=6.2.3

- **Allvarlighetsgrad:** Hög
- **Sårbarhetstyp:** Prototypförorening
- **Åtgärd:** Uppdaterade `qs` till en säker version.

### 7. semver

- **Allvarlighetsgrad:** Måttlig
- **Sårbarhetstyp:** Reguljära uttryck som kan utnyttjas för tjänsteförnekande
- **Åtgärd:** Uppdaterade `semver` till en säker version.

### Lösning

- Vi löste alla problemen genom att köra `npm audit fix`.

## Åtgärder för att starta appen

### Backend

- **Steg 1:** Försök starta upp app.js och analysera och lokalisera problemet.
- **Steg 2:** Använde oss av "Optional Chaining" för att applikationen inte skulle krascha på raden med felet.
- **Steg 3:** Loggade ut resultatet och lokaliserade felet.

```  "RESPONSE": {
    "RESULT": [
      {
        "ERROR": {
          "SOURCE": "Security",
          "MESSAGE": "Invalid authentication"
        }
      }
    ]
  }
```
- **Steg 4:** Skapade API-nyckel på Trafikverket och lade in nyckeln i en dotENV fil i backend.
- **Steg 5:** Starta backend med `node app.js` och sedan gå till localhost:1337 för kontrollera att uppstart lyckades.

### Frontend
- **Steg 1:** python -m http.server 9000 i Frontend foldern.
- **Steg 2:** Använda sig av exploratory testing för att lokalisera problem.
- **Steg 3:** Kolla Backendserverns felmeddelande.
- **Steg 4:** Kontrollerade DBn och table "Tickets" finns ej.
- **Steg 5:** Injicerade migrate.sql in i databasen.


## Val av frontend ramverk

- Vi kollade igenom materialet under [/frontend](https://jsramverk.se/frontend) och gjorde som John Papa och gick på magkänslan. Detta gjorde att vi valde Vue.js då vi föredrar JS i vår html.
