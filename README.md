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