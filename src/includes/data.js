var booksAliases = {
    "ru": {
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
        "Притчи": ["При", "Прит", "Притч", "Притчей", "Притчи"],
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
        "Откровение": ["Откровения", "Откр", "От", "Ои"]
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

var slideDescriptionMap = {
    verse: ['verse', 'verso', 'стих', 'versetto'],
    chorus: ['chorus', 'coro', 'refrao', 'припев', 'coro'],
    instrumental: ['instrumental', 'инструментальныи', 'strumentale']
};

var styles = {
    'light': {
        'colors': {
            primary: "448aff",
            info: "17a2b8",
            success: "00c800",
            warning: "ffc107",
            danger: "ff0000",
            dark: "fcfcfc",
            secondary: "707070",
            light: "303030",
            white: "070707"
        }
    },
    'dark': {
        'colors': {
            primary: "6fa5ff",
            info: "66d1ff",
            success: "008e00",
            warning: "ffc107",
            danger: "790903",
            dark: "1e1e1e",
            secondary: "a4a4a4",
            light: "c8c8c8",
            white: "e6e6e6"
        }
    },
    'dark_medium': {
        'colors': {
            primary: "6fa5ff",
            info: "66d1ff",
            success: "008e00",
            warning: "ffc107",
            danger: "ff8080",
            dark: "3b3b3b",
            secondary: "acacac",
            light: "d0d0d0",
            white: "ececec"
        }
    },
    'dark_soft': {
        'colors': {
            primary: "6fa5ff",
            info: "66d1ff",
            success: "008e00",
            warning: "ffc107",
            danger: "ffbaba",
            dark: "606060",
            secondary: "c8c8c8",
            light: "dcdcdc",
            white: "f8f8f8"
        }
    }
};
var style = null;
