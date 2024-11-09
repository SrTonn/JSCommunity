function clearPlaylist(lyricsPlaylist, mediaPlaylist) {
    var indexes = [];
    for (var i = 0; i < 256; i++) {
        indexes.push(i);
    }
    if (lyricsPlaylist) {
        h.hly('RemoveFromLyricsPlaylist', {'indexes': indexes});
    }
    if (mediaPlaylist) {
        h.hly('RemoveFromMediaPlaylist', {'indexes': indexes});
    }
}

function addToMediaPlaylist(item) {
    var r = h.hly('AddToPlaylist', {items: [item]});
    if (r.status != 'ok') {
        if (item.type == 'verse') { // if verse not find, try to fix Bible book name
            item.references = fixBibleNames(item.references);
            r = h.hly('AddToPlaylist', {items: [item]});
	   if (r.status == 'ok') {
   		return;
	   }
        }
        var msg = jsc.i18n('Error') + ": {}";
        log(msg, [r.error]);
    }
}

function addSongToPlaylist(id, lyricsPlaylist, mediaPlaylist) {
    if (mediaPlaylist) {
        addToMediaPlaylist({type: 'song', id: id});
    }
    if (lyricsPlaylist) {
        h.hly('AddLyricsToPlaylist', {id: id});
    }
}

function log(msg, params) {
    h.log("", msg, params);
}

function hGetItemInputParams() {
    return [
        {
            id: 'playlist_target',
            name: jsc.i18n('Playlist'),
            description: '',
            type: 'string',
            allowed_values: [
                {value: 'media', label: jsc.i18n('Medias')},
                {value: 'lyrics', label: jsc.i18n('Lyrics')},
                {value: 'both', label: jsc.i18n('Both')}
            ],
            default_value: 'media'
        }, {
            id: 'clear_playlist',
            name: jsc.i18n('Clear playlist'),
            description: '',
            type: 'boolean',
            default_value: true
        }
    ];
}


var booksAliases = {
    "ru" : {
        "Бытие": ["Берешит", "Бы", "Быт", "Бытие", "Бытия", "Бт"],
        "Исход": ["Исх", "Исхо", "Исходе", "Ид"],
        "Левит": ["Лев", "Левите", "Левия", "Лев"],
        "Чисел": ["Числ", "Числа", "Чсл", "Чс"],
        "Втоp": ["Вт", "Втор"],
        "Нав": ["И.Нав", "Иеошуа", "Иис.Н", "Нав", "Нв"],
        "Судей": ["Судьи", "Сд"],
        "Руфь": ["Рут", "Руф", "Руфи", "Рф"],
        "1 Царств": ["1 Цар", "1Цар", "1Ц"],
        "2 Царств": ["2 Цар", "2Цар", "2Ц"],
        "3 Царств": ["3 Цар", "3Цар", "3Ц"],
        "4 Царств": ["4 Цар", "4Цар", "4Ц"],
        "1Пap": ["ІПар", "І Пар", "Пар", "1Х"],
        "2Пар": ["ІІПар", "ІІ Пар", "2Х"],
        "Ездра": ["Ездр", "Езд", "Ездры", "Езр", "Ез"],
        "Неемия": ["Неемии", "Неем", "Нее", "Не", "Веем", "Нм"],
        "Есфирь": ["Есфири", "Ес"],
        "Иов": ["Иова", "Иове", "Ив"],
        "Псалтирь": ["Псал", "Псалм", "Псалмов", "Псалмы", "Псалом", "Псалтири"],
        "Притчи": ["При", "Прит", "Притч", "Притчей", "Притчи", "Пр"],
        "Екк": ["Ек", "Еккл"],
        "Песн": ["П.Песн", "Пес", "Песней", "Песнь", "Пн"],
        "Иc": ["Исаи", "Исаии", "Исаия", "Исайи", "Исайя", "Исайя"],
        "Иер": ["Ие", "Иеремии", "Иеремия", "Йеремия"],
        "Плач": ["Пл", "Пл.Иер", "Плач Иер", "Плач Иеремии", "ПлачИер"],
        "Иез": ["Езек", "Иезек", "Иезекииля", "Йез", "Из"],
        "Дан": ["Даниила", "Даниэль", "Дн"],
        "Осия": ["Осии"],
        "Иоиль": ["Иоил", "Иоиля", "Иол", "Йоиль", "Йоэль", "Ил"],
        "Амоса": ["Аммос"],
        "Авдий": ["Авдия", "Аи", "Авд"],
        "Иона": ["Ион", "Ионы", "Ио", "Ион"],
        "Михей": ["Миха", "Михее", "Михея", "Мх"],
        "Наум": ["Наума", "На"],
        "Аввакум": ["Ав", "Аваккума"],
        "Софонии": ["Софония", "Сф"],
        "Аггей": ["Аг", "Аггея"],
        "Захария": ["Зехария", "Захар", "Захарии", "Зр"],
        "Малахия": ["Малах", "Малахии", "Мл", "Мал"],
        // ---------- Новый завет ----------
        "Матфея": ["Матф", "Мт", "Мтф", "Мф", "Мат"],
        "Mapка": ["Map", "Мак", "Мар", "Марка", "Мр", "Марк"],
        "Луки": ["Лук", "Лука"],
        "Иоанна": ["Ин", "Иоан", "Иоана", "Иоанн"],
        "Деяния": ["Дея", "Д.Ап", "Деяниями", "Деят", "Де"],
        "Иакова": ["Иаков", "Йак", "Яак", "Яакова", "Ик"],
        "1 Петра": ["1 Петр", "1Кеф", "1Киф", "1Петр", "1Пет", "1П", "1-е Пет"],
        "2 Петра": ["2 Петр", "2Кеф", "2Киф", "2Петр", "2Пет", "2П", "2-е Пет"],
        "1 Иоанна": ["1Иоан", "1И", "1-е Иоан"],
        "2 Иоанна": ["2Иоан", "2И", "2-е Иоан"],
        "3 Иоанна": ["3Иоан", "3И", "3-е Иоан"],
        "Иуда": ["Иуды", "Иу"],
        "Римлянам": ["Римл", "Рм"],
        "1Кор": ["1-е Кор", "1К"],
        "2Кор": ["2-е Кор", "2К"],
        "Галатам": ["Галат", "Гл"],
        "Ефесянам": ["Ефес"],
        "Филиппийцам": ["Филип", "Фил", "Фл"],
        "Колоссянам": ["Ко", "Колос", "Кл"],
        "1Фессалоникийцам": ["1 Фесс", "1Фесс", "1Фессал", "1Ф", "1-е Фес"],
        "2Фессалоникийцам": ["2 Фесс", "2Фесс", "2Фессал", "2Ф", "2-е Фес"],
        "1Тим": ["1Т", "1-е Тим"],
        "2Тим": ["2Т", "2-е Тим"],
        "Тит": ["Ти"],
        "Флм": ["Фм", "Филим"],
        "Евреям": ["Ев", "Ер"],
        "Откровение": ["Откровения", "Откр", "От", "Ои", "Отк"]
    },
    "en": {
        "Genesis": ["Ge", "Gen"],
        "Exodus": ["Ex", "Exo"]
    },
    "pt": {
        "Gênesis": ["Gên"],
        "Êxodo": ["Êx"],
        "1 João": ["1Jn"],
        "2 João": ["2Jn"],
        "3 João": ["3Jn"]
    }
};

function fixBibleNames(originalQuery){
    var lang = jslib.getLanguage();
    if (booksAliases[lang] === undefined) {
        return originalQuery;
    }

    for(var book in booksAliases[lang]) {
       for (var i in booksAliases[lang][book]) {
            var alias = booksAliases[lang][book][i];
            // regex group 1: line start or space or punctuation marks
            // regex group 2: alternative alias itself
            // regex group 3 space or dot or digits
            var regex = '(^|\\s|[,;])('+ alias +')(\\s|\\.|\\d)(?i)';
            // leave group 1 and 3, but replace 2nd group with canonical name.
            originalQuery = originalQuery.replaceAll(regex, '\u00241'+ book +'\u00243');
       }
    }
    return originalQuery;
}