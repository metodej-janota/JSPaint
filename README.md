# JSPaint
Hlavní rysy projektu zahrnují:

Malování na canvas: Uživatelé mohou vybírat z různých nástrojů a barev a přímo na canvas tvořit své pixelové umění.

Funkce a nástroje: Aplikace nabízí různé funkce, jako jsou malování volnou rukou, plnění barvou, změna velikosti štětce, rozmazání, překrytí vrstev a další. To umožňuje uživatelům uplatnit svou kreativitu a dosáhnout požadovaného efektu.

Možnost multiplayeru: Kromě individuálního malování nabízíme také multiplayerový režim, ve kterém mohou uživatelé spolupracovat a malovat na stejném plátně s ostatními uživateli. To vytváří interaktivní a komunitní prostředí.

Ukládání a sdílení: Uživatelé mají možnost uložit své umělecké dílo a sdílet ho s ostatními prostřednictvím integrovaného sdílení na sociálních sítích.

Tento projekt je open-source a vítáme příspěvky a spolupráci od komunity. Připojte se k nám na Githubu a pomozte nám vylepšit tuto aplikaci a přidat nové funkce, aby byla ještě zajímavější a užitečnější pro uživatele.


# Celá dokumentace zde: 


Úvod
Důvod vytvoření projektu:
Tento projekt jsem si vybral pro klauzurní práce do předmětu JavaScript, který měl za úkol rozšířit ale také prověřit mé znalosti ohledně předmětu.

Dojmy z projektu:
Práce na tomhle projektu mě bavila a naučila mě spoustu nových věcí jako například rozšířenější prací s localstorage nebo také s knihovnu Socket.io která slouží pro multiplayer.

Cíl projektu:
Cílem tohoto projektu bylo vytvořit online kreslící plátno, které bude také nabízet funkce jako je ukládání a načítání kreseb, možnost změny velikosti plátna a různé nástroje pro kreslení jako je guma, krok vpřed a vzad, kreslení pixelových čar a další.

Socket.io
Socket.IO je knihovna pro komunikaci v reálném čase mezi webovými prohlížeči a serverem která umožňuje vytváření "socketů" na straně klienta i serveru. 
Socket.io bylo využito na:
1.	Zprávy neboli chat ve webové aplikace
2.	Sdílení plátna

Komentáře ve zdrojovém kódu
Komentáře ve zdrojovém kódu budou usnadňovat možnou budoucí údržbu, rozšíření kódu či přizvání nového vývojáře do projektu.

Popis funkcí, metod a proměnných
Proměnné
	Klientova část
1.	socket: Představuje instanci socketu pro komunikaci se serverem.
2.	canvas, ctx, canvasGRID, ctxGRID: Proměnné pro práci s plátnem a jeho kontextem.
3.	ifMouseDown: Proměnná indikující, zda je tlačítko myši stisknuto.
4.	drawingHistory: Pole uchovávající historii kreslených objektů.
5.	currentStep: Index aktuálního kroku v historii.
6.	steps: Počítadlo kroků pro kreslení čar.
7.	scale: Měřítko kreslení.
8.	clientRoom: Identifikátor místnosti pro klienta.
9.	name: Jméno klienta.
10.	saves: Pole pro ukládání objektů.
11.	zoomLevel: Proměnná která uchovává aktuální úroveň přiblížení plátna.
12.	zoomIncrement: Tato proměnná udává, o kolik se má změnit zoomLevel při každém přiblížení nebo oddálení. 

	Serverová část
1.	express: Proměnná pro modul Express, který je použit pro vytvoření a konfiguraci webového serveru.
2.	app: Instance Express aplikace, která představuje webový server.
3.	http: Proměnná pro vytvoření HTTP serveru pomocí modulu "http" a využití instance Express aplikace.
4.	port: Číslo portu, na kterém bude server naslouchat.
5.	io: Instance Socket.IO, která je inicializována s využitím HTTP serveru a konfigurací pro povolení CORS (Cross-Origin Resource Sharing) pro komunikaci s klienty, kdyby kód tuhle část neobsahoval tak by se server vůbec nemohl napojit na klienty.
6.	totalUsers: Proměnná pro sledování celkového počtu uživatelů online.
7.	socket.id: Unikátní identifikátor připojeného socketu (klienta).
8.	socket: Instance Socket.IO, která představuje spojení mezi serverem a klientem.
Funkce
	Klientova část
1.	draw(x, y, range, colorMult): Vykresluje pixely na základě zadaných souřadnic, rozsahu a barvy.

2.	loadSaves(x, y, range, color): Načítá objekty uložené v localStorage a vykresluje je na plátno.

3.	earser(): Nastavuje barvu inputu kreslící barvy na barvu pozadí, čímž simuluje efekt gumy.

4.	downloadSave(): Stahuje data z localStorage ve formátu JSON jako soubor "saves.json".

5.	saveAsik(): Spouští funkci downloadSave() pro uložení dat z localStorage.

6.	display(event): Získává pozici kurzoru a volá funkci draw() pro vykreslení pixelu na dané pozici a vypočítává položení pixelu do rastru.

7.	redrawCanvas(): Překresluje plátno na základě historie kroků vykreslených pixelů.

8.	addKrok(x, y, width, height, color): Přidává krok do historie vykreslených pixelů pro funkce undo() a redo().

9.	undo(): Vrací se o jeden krok zpět v historii vykreslených pixelů a překresluje plátno.

10.	redo(): Přechází o jeden krok vpřed v historii vykreslených pixelů a překresluje plátno.

11.	mouseMove(): Sleduje stav myši a volá funkci display() a draw() pro vykreslení pixelů při pohybu myši.

12.	showGrid(range): Vykresluje mřížku na druhé plátno (canvasGRID) na základě zadaného rozsahu.

13.	getRandomColor(): Generuje náhodnou barvu v hex formátu.

14.	clearCanvas(): Vyčištění plátna (canvas) a smazání dat v localStorage.

15.	zoomInCanvas(): Tato funkce zvyšuje úroveň přiblížení (zoomLevel) o hodnotu zoomIncrement. Následně volá funkci applyZoom(), která upravuje velikost plátna na základě aktuální úrovně přiblížení.

16.	zoomOutCanvas(): Tato funkce snižuje úroveň přiblížení (zoomLevel) o hodnotu zoomIncrement. Před snížením se provádí kontrola, zda je aktuální úroveň přiblížení větší než hodnota zoomIncrement. Pokud ano, dojde ke snížení. V opačném případě se úroveň přiblížení nastaví na hodnotu 1. Následně volá funkci applyZoom(), která upravuje velikost plátna na základě aktuální úrovně přiblížení.

17.	zoomReset(): Tato funkce nastavuje úroveň přiblížení (zoomLevel) na hodnotu 1, čímž se vrátí k výchozímu stavu.

18.	applyZoom(): Tato funkce upravuje velikost plátna na základě aktuální úrovně přiblížení (zoomLevel). Používá vlastnost style.transform plátna a nastavuje hodnotu scale(${zoomLevel}), což způsobí zvětšení nebo zmenšení plátna podle aktuální úrovně přiblížení.

19.	setCanvasClear(): Vyčištění plátna v případě multiplayeru.

20.	drawLines(x0, y0, x1, y1, color, range): Vykresluje čáru mezi zadanými body na základě algoritmu Bresenhamovy pixelové čáry.

21.	load(): Načítá data z localStorage a vykresluje je na plátno.

22.	changeCanvasSize(): Mění velikost všech pláten (canvas, canvasGRID, canvasHOVER) na základě zadaných rozměrů.

	Serverová část
1.	http.listen(port, function..: Funkce pro spuštění serveru a naslouchání na zadaném portu. 

2.	io.on("connection", function (socket)..: Funkce pro zachycení události "connection" (připojení klienta) pomocí Socket.IO.

3.	socket.on("draw", function (obj)..: Funkce pro zachycení události "draw" (kreslení) od klienta. V této funkci jsou data o kreslení odeslána všem klientům ve stejné místnosti (room) pomocí metody socket.to("room" + obj.clientRoom).emit("draw-mult", obj).

4.	socket.on("disconnect", function (socket)..: Funkce pro zachycení události "disconnect" (odpojení klienta). V této funkci je logováno odpojení klienta a aktualizován počet celkových uživatelů online.

5.	socket.on("createRoom", function (room)..: Funkce pro zachycení události "createRoom" (vytvoření místnosti) od klienta. V této funkci je klient přidán do místnosti (room) pomocí metody socket.join(room) a odeslán klientovi aktualizovaný název místnosti pomocí socket.emit("updateRoom", room).

6.	socket.on("joinRoom", function (roomCode)..: Funkce pro zachycení události "joinRoom" (připojení do místnosti) od klienta. V této funkci je klient přidán do existující místnosti (room) s kódem roomCode pomocí metody socket.join(roomCode) a odeslán klientovi aktualizovaný kód místnosti pomocí socket.emit("updateRoom", roomCode).

7.	socket.on("clearCanvas", function (clientRoom)..: Funkce pro zachycení události "clearCanvas" (smazání plátna) od klienta. V této funkci je odeslán signál všem klientům ve stejné místnosti (room) pomocí socket.to("room" + clientRoom).emit("setCanvasClear"), aby smazali svá plátna.

8.	socket.on("chatmessage", function  (data)..: Funkce pro zachycení události "chatmessage" (chatová zpráva) od klienta. V této funkci je přijatá chatová zpráva odeslána všem klientům pomocí io.emit("chatmessage", data).
Event Listenery
1.	Pokud je stisknuta kombinace kláves Ctrl + Z, zavolá se funkce undo().
2.	Pokud je stisknuta kombinace kláves Ctrl + Y, zavolá se funkce redo().
3.	Pokud je stisknuta kombinace kláves Ctrl + C, zavolá se funkce clearCanvas().
4.	Pokud je stisknuta kombinace kláves Ctrl + 1, zavolá se funkce zoomInCanvas().
5.	Pokud je stisknuta kombinace kláves Ctrl + 2, zavolá se funkce zoomOutCanvas().
6.	Pokud je stisknuta kombinace kláves Ctrl + 3, zavolá se funkce zoomReset().
7.	Pokud je stisknut mezerník, zavolá se funkce getRandomColor().

Závěr:
Vytvořil jsem webovou aplikaci, ve které jsem si během vývoje osvojil technologie jako HTML5, CSS3, a hlavně programovací jazyk JavaScript. Svůj výsledek na projektu bych zhodnotil kladně a jsem s výsledkem spokojený. Při práci s knihovnou Socket.io jsem měl lehké potíže i přestože ji znám a již několikrát jsem s ní pracoval. Můj napsaný kód bych řekl že vypadá poněkud jednoduše ale orientovat se v něm mi dělalo někdy potíže což mně naučilo, že do příště budu více využívat moduly a více si organizovat napsaný kód.

Dosažené výsledky:
1.	Možnost základního kreslení na plátno.
2.	Možnost změny barvy pozadí a vyčistění plátna.
3.	Funkce „Undo“ a „Redo“.
4.	Ukládání a načítání dat.
5.	Posílání zpráv.
6.	Možnost multiplayeru/sdílení plátna.
7.	Exportování do PNG.
8.	Ukládání momentálního plátna do JSON a možnost ho načíst.

Možnosti budoucího vývoje
Optimalizace výkonu
V současné době aplikace pracuje s jedním hlavním plátnem a ukládá všechny kroky do historie, což může ovlivnit výkon při práci s velkým množstvím kroků.
Rozšíření nástrojů
V současném stavu aplikace jsou dostupné základní nástroje pro manipulaci s plátnem. V budoucnu by byla možnost přidat další nástroje, jako je například výběr objektů, úprava jejich vlastností nebo více druhů štětců.
Vylepšení uživatelského rozhraní / UI
Uživatelské rozhraní je momentálně velmi jednouché což bych chtěl v budoucnu napravit tak aby vše bylo více přehledné a intuitivní.
Rozšíření importu a exportu
Momentálně je podporován import a export plátna pomocí JSON formátu. V budoucnu bych mohl přidat podporu dalších formátů jako je například PNG, JPEG nebo SVG.

Návod ke spuštění a používání JSPaint
Návod pro Připojení se do místnosti
1.	Spuštění Live Serveru
2.	Otevření terminálu/konzole
3.	Do terminálu napište: „npm run devStart“
4.	Obnovení stránky

Návod pro Připojení se do místnosti
1.	Najdeme sekci „Multiplayer“ pravém dolním rohu
2.	Najdeme zde svoji místnost a input
3.	Do inputu zadejte místnost, do které se chcete připojit

Klávesové zkratky
o	Mezerník: Náhodná barva
o	CTRL + Z: Krok dozadu
o	CTRL + Y: Krok dopředu
o	CTRL + C: Smazání plátna
o	CTRL + 1: Přiblížení plátna
o	CTRL + 2: Oddálení plátna
o	CTRL + 3: Resetování přiblížení plátna
Orientace v UI
o	Slider
o	Brush size: Velikost štětce
o	Input
o	Color input
	Brush color: Barva, která se vztahuje na vše, čím kreslíme
	Background color: Barva pozadí
o	Text input
	Room input: Zde zadáváme jméno místnosti, kam se připojujeme
	Chat input: Zde píšeme zprávu, co chceme odeslat do chatu
o	Checkbox
o	Grid: Zapne se nám mřížka/rastr ve velikosti našeho štětce
o	Alight: Normálně kreslíme na 10x10 pixelů, tohle nastavení nás zarovnává na velikost štětce
o	Lines:
	První kliknutí – Klikneme tam kde chceme, aby čára začínala
	Druhé kliknutí – Klikneme tam kde chceme, aby čára končila
•	Na čáry se dá aplikovat Rainbow effect
o	Buttons
o	Clear canvas: Vyčistí canvas/plátno i local storage
o	More tools
	Otevření dalších nastavení a nástrojů
	Obsahuje:
	galerii filtrů
	Exportování
	Ukládání momentálního plátna
	Duhové kreslení
	Načítání obrázku
	Změna velikosti plátna
	Přidání textu

Seznam použitých zdrojů:
Socket.IO:
•	Oficiální dokumentace: https://socket.io/docs/v4
Pixelové čáry
•	Wikipedia o samotném algoritmu: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
•	YouTube video o generování pixelových čár v Minecraftu: https://www.youtube.com/watch?v=vfPGuUDuwmo&ab_channel=mattbatwings
Ostatní:
•	W3Schools: https://www.w3schools.com/js/
•	JST: https://www.javascripttutorial.net/
•	GFG: https://www.geeksforgeeks.org/
![Uploading image.png…]()
