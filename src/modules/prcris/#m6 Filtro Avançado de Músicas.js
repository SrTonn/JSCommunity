// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22696e666f227d
var mID = '@prcris#m6';
var mUID = mID + ''; 

//#import modules_generic_functions 

function startup(module) { 
  mUID = mID + module.id;
  logState(module.settings.log, mUID, 'startup '+ mID);
}

function info() {
    return {
        id: mID,
        name: 'Filtro Avançado de Músicas',
        description: '<html>'+
                     '<b>Cria tags para filtrar músicas no campo pesquisa, filtra músicas por:</b><br>'+
                     '• Grupos (diversos)<br>'+
                     '• Artista <br>'+
                     '• Cantor <br>'+
                     '• Faixa de BPM<br>'+
                     '• Dias sem cantar<br>'+
                     infoVDDMM,
         allowed_requests: [
                     allowedPrcrisModuleRequests
         ]
    };
}


// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2253657474696e6773227d
// esta aba é responsável pelo ícone da engrenagem, onde se configuram os parâmetros de funcionamento do módulo

function settings(module) {
    var arr = [
        {
            name: 'Sobre ' + mID,
            description: infoVDDMM,
            type: 'label'
        },{
            type: 'separator'
        },{
            id: 'group',
            label: 'Letra ID inicial das categorias de música no grupo',
            type: 'string',
            description: '<html><hr>O módulo procura grupos iniciando com este caractere.',
            default_value: 'G'
        },{
            id: 'multitrack',
            label: 'Letra ID inicial dos tipos de trilha/playback',
            type: 'string',
            description: '<html><hr>O módulo procura grupos iniciando com este caractere.',
            default_value: 'T'
        },{
            id: 'singer',
            label: 'Letra ID inicial dos cantores no grupo',
            type: 'string',
            description: '<html><hr>O módulo procura os cantores iniciando com este caractere, no exemplo "C Fulano" representa o vocalista "Fulano" da sua equipe.',
            default_value: 'C'
        },{
            id: 'scheduled',
            label: 'Usar Escala para Cantores',
            type: 'boolean'
        },{
            id: 'vocalname',
            name: jsc.i18n('<html>Nome <b>função</b> integrantes cantores'),
            description: '<html><hr>Nome comum que foi dado no cadastro de funções aos cantores cadastrados (todos os cantores precisam ter esta palavra na função ex: (Vocal 1, Backing-Vocal 1, Vocal 2, Vocal 3)',
            type: 'string',
            default_value: 'Vocal'
        },{
            type: 'separator'
        },{
            id: 'log',
            label: 'Habilitar log',
            type: 'boolean',
            onchange :  function(obj) {
                logState(obj.input.log, mUID, 'onchange '+ mID); //habilita ou desabilita o log de acordo com a configuração  
              }
        }
    ];
    return arr;
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22616374696f6e73536574227d
function actions(module) {
    
    return [
        actionSongsFilter(module)       // na aba eventSingers
        ]
}

//--rgx (G Exaltação|G Louvor)

function actionSongsFilter(module) {
    return {
        id: 'channels',
        label: 'Filtrar Músicas',
        icon: 'system:filter_list',
        action: function(evt) {
            var s = module.settings;
            var inputs = [];
                
            var groups = filterGroups(s.group) || [];
            if (groups) {
               inputs.push({ 
                    type: 'title', 
                    label: 'Marque os grupos:'
               });
               for (var i = 0; i < groups.length; i++) {
               inputs.push({
                    id: 'groups|'+groups[i],
                    type: 'boolean',
                    name: groups[i]
                });
              }
            }
            inputs.push({
                    type: 'separator'
                },
                { 
                    type: 'title', 
                    label: 'Preencha os parâmetros:'
                },
                {
                    id: 'multitrack|%group: ',
                    type: 'text',
                    name: 'Trilha',
                    suggested_values: filterGroups(s.multitrack)
                },
                {
                    id: 'artist|%artist: ',
                    type: 'text',
                    name: 'Artista',
                    allowed_values: listArtists(),
                    show_as_combobox : true
                },
                {
                    id: 'singer|%group: ',
                    type: 'combobox',
                    name: 'Cantor',
                    suggested_values: s.scheduled ? listScheduledSingers(s) : filterGroups(s.singer)
                },
                {
                    id: 'bpm_start|%bpm: >= ',
                    type: 'text',
                    name: 'BPM Inicial'
                },
                {
                    id: 'bpm_finish|%bpm: <= ',
                    type: 'text',
                    name: 'BPM final'
                },
                {
                    id: 'days_start|%played_days: >= ',
                    type: 'text',
                    name: 'Dias sem tocar inicial'
                },
                {
                    id: 'days_finish|%played_days: <= ',
                    type: 'text',
                    name: 'Dias sem tocar final'
                }
            );

            var q = module.inputSettings('custom_search', inputs);
            if (q !== null) {
                h.log(mUID,"Valores escolhidos = {}",[q]);
                filterApply(q);
            }
        }
    };
}



// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2266756e6374696f6e73227d

// aqui estão as funções responsáveis por salvar, ler, capturar e aplicar volumes
//

function filterApply(q) {
    var groups = [];
    var otherFilters = [];

    for (var key in q) {
        var keyParts = key.split('|');
        if (keyParts[0] === "groups" && q[key]) {
            groups.push(keyParts[1]);
        } else if (q[key]) {
            otherFilters.push(keyParts[1] + q[key]);
        }
    }

    var groupsFilter = "";
    if (groups.length == 1) {
        groupsFilter = "%group: " + groups[0];
    } else if (groups.length > 1) {
        groupsFilter = "%group: --rgx (" + replaceAccents(groups.join('|')) + ")";
    }

    var combinedFilters = otherFilters.length > 0 ? otherFilters.join(' && ') : "";

    var filter = groupsFilter;
    if (groupsFilter && combinedFilters) {
        filter += " && " + combinedFilters;
    } else if (combinedFilters) {
        filter = combinedFilters;
    }

    h.hly('SetInterfaceInput', {
        id: 'main_lyrics_tab_search',
        value: filter,
        focus: true
    });
}




function listScheduledSingers(settings) { // Obter nomes dos cantores escalados

  var schedule = h.hly('GetCurrentSchedule').data[0];
  var scheduledSingers = [];
 
  if (schedule && schedule.roles && schedule.roles.length > 0) {
       schedule.roles.forEach(function(role) {
         if (role.member && role.member.name && role.name) {
             if (role.name.contains(settings.vocalname)) {
                scheduledSingers.push(settings.singer + ' ' + role.member.name);
             }
         }
       });
  }
  return scheduledSingers;
}


function filterGroups(startsWith) {
    var songs = h.hly('GetSongs');
    var groupsSet = {}; // Object to track group names
    var groups = [];

    for (var i = 0; i < songs.data.length; i++) {
        var song = songs.data[i];
        for (var j = 0; j < song.groups.length; j++) {
            var groupName = song.groups[j].name;
            if (groupName.substring(0, startsWith.length()) == startsWith && !groupsSet[groupName]) {
                groups.push(groupName);
                groupsSet[groupName] = true; // Marking the group name as found
            }
        }
    }
    return groups;
}

function replaceAccents(text) {
    var acentuados = /[áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]/g;
    return text.replace(acentuados, '.');
}



function listArtists() {
    // Obtém os dados
    var r = h.hly('GetSongs').data;

    // Cria um array de artistas
    var artists = [];

    // Itera sobre os dados e coleta os nomes dos artistas sem repetição
    for (var i = 0; i < r.length; i++) {
        var s = r[i];
        // Adiciona o nome do artista à lista apenas se ainda não estiver lá
        if (artists.indexOf(s.artist) === -1) {
            artists.push(s.artist);
        }
    }

    // Ordena os artistas em ordem alfabética
    artists.sort();

    return artists;
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22636f6e746578745f616374696f6e227d
function contextActions(module) {
    return [
        {
            name: spanIcon("\ueaca") + "Listar músicas desta data (log)- " + mID,
            types: ['song_history'],
            action: function(module) {
              listaMusicas(module,'log');
           }
        },
        {
            name: spanIcon("\ueaca") + "Adicionar músicas desta data na aba Mídia - " + mID,
            types: ['song_history'],
            action: function(module) {
              listaMusicas(module,'playlist');
           }
        }
    ];
}


function listaMusicas(module, local) {

    var itemDate = new Date(module.item.date);

    // Pegar os schedules de acordo com o mês e ano
    var r = h.hly('GetSchedules', {
        month: itemDate.getMonth() + 1,
        year: itemDate.getFullYear()
    });

    for (var i = 0; i < r.data.length; i++) {
        var s = r.data[i];
        var scheduleDate = new Date(s.datetime);

        // Verificar se a data do schedule é anterior à data do item e está no mesmo dia
        if (scheduleDate.toDateString() === itemDate.toDateString()) { // && scheduleDate <= itemDate) {
            h.log("Schedule encontrado:");
            h.log(s.datetime);
            h.log(s.name);

            // Processar o media_playlist
            var mediaPlaylist = s.media_playlist;
            var currentTitle = null;
            var hasSong = false;
            var result = [];
            var items = [];  // Lista que será usada para AddToPlaylist
            var currentSongs = [];

            for (var j = 0; j < mediaPlaylist.length; j++) {
                var item = mediaPlaylist[j];

                if (item.type === 'title') {
                    // Se houver um título anterior com músicas, logar no formato correto
                    if (hasSong) {
                        if (local === 'log') {
                            h.log("==" + currentTitle);
                            for (var k = 0; k < currentSongs.length; k++) {
                                h.log(currentSongs[k].name); // Logar o nome da música
                            }
                        }

                        // Adicionar título e suas músicas à lista de items
                        items.push({
                            type: 'title',
                            name: currentTitle,
                            background_color: item.background_color || "000080" // Cor padrão caso não exista
                        });

                        // Adicionar as músicas associadas a este título
                        for (var k = 0; k < currentSongs.length; k++) {
                            items.push({
                                type: 'song',
                                id: currentSongs[k].song_id // Usar o song_id para adicionar ao playlist
                            });
                        }
                    }
                    // Reiniciar para o próximo título
                    currentTitle = item.name;
                    currentSongs = [];
                    hasSong = false;
                }

                if (item.type === 'song') {
                    currentSongs.push(item);
                    hasSong = true;
                }
            }

            // Adicionar o último grupo se houver músicas associadas
            if (hasSong) {
                if (local === 'log') {
                    h.log("==" + currentTitle);
                    for (var k = 0; k < currentSongs.length; k++) {
                        h.log(currentSongs[k].name); // Logar o nome da música
                    }
                }

                // Adicionar título e músicas ao items
                items.push({
                    type: 'title',
                    name: currentTitle,
                    background_color: "000080"
                });

                for (var k = 0; k < currentSongs.length; k++) {
                    items.push({
                        type: 'song',
                        id: currentSongs[k].song_id
                    });
                }
            }

            if (local === 'playlist') {
                var rAdd = h.hly('AddToPlaylist', {
                    items: items
                });
                if (rAdd.status != 'ok') {
                    h.log(rAdd.error);
                }
            }
        }
    }
}