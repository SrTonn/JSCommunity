utils = {
    example: function () {
        return h.log('jsc.utils.example OK');
    },
    //
    fixBibleReferences: function (references) {
        var booksAliases = jsc.data.booksAliases;
        var lang = jslib.getLanguage();
        if (booksAliases[lang] === undefined) {
            return references;
        }

        for (var book in booksAliases[lang]) {
            for (var i in booksAliases[lang][book]) {
                var alias = booksAliases[lang][book][i];
                // regex group 1: line start or space or punctuation marks
                // regex group 2: alternative alias itself
                // regex group 3 space or dot or digits
                var regex = '(^|\\s|[,;])(' + alias + ')(\\s|\\.|\\d)(?i)';
                // leave group 1 and 3, but replace 2nd group with canonical name.
                references = references.replaceAll(regex, '\u00241' + book + '\u00243');
            }
        }
        return references;
    },
    //
    format: function (msg, arr) {
        try {
            if (arr == null || arr.length == null || arr.length == 0 || typeof arr === 'string') {
                return msg;
            }
            var placeHolder = "{}";
            var r = "";
            for (var current = 0, argIndex = 0; current < msg.length(); ) {
                var token = msg.indexOf(placeHolder, current);
                if (token > -1) {
                    r += msg.substring(current, token);
                    r += arr[argIndex++];
                    current = token + placeHolder.length();
                } else {
                    r += msg.substring(current);
                    break;
                }
            }
            return r;
        } catch (e) {
            return msg;
        }
    }
};
