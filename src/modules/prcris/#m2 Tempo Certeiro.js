// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22696e666f227d
var mID = '@prcris#m2';
var mUID = mID+''; 

//#import modules_generic_functions

function startup(module) { 

mUID = mID + module.id;
logState(module.settings.log, mUID, 'startup '+ mID);
 
}

function info() {
    return {
        id: mID,
        name: 'Tempo Certeiro',
        description: '• Cria uma contagem regressiva na tela de retorno nos versos nomeados como ##(Instrumental), '+
                     'permitindo ao intérprete da música saber quanto tempo ele ainda possui para ministrar. <br>'+
                     '• Recomendado para quem usa tracks ou VS para a adoração e slides automatizados via midi (para garantir o tempo de troca).<br>'+
                     infoVDDMM,
         allowed_requests: [
                     allowedPrcrisModuleRequests
         ]
    };
}

// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22636f6e74657874416374696f6e73227d
function contextActions(module) {
    return [
            {
             name: spanIcon("\ueaca")+ 
                   "Tempos Instrumentais Salvos - "+'(@prcris#m2)',
             types: ['song'],
             action: function(module) {
             var musicID = String(module.item.id);
             var instrCtdwn = restoreInstrumentalData();
             var slideTimes = instrCtdwn[musicID];            
             var reportData = '';
             for (var key in slideTimes) {
                  var slideNumber = ('0' + key).slice(-2); // garante que o número do slide tenha dois dígitos
                  var time = slideTimes[key];
                  reportData = reportData +'<br>Slide ' + slideNumber + '= ' + time + 's';
             }
             showMessage('Tempos Instrumentais Salvos',['Tempos atuais da música ','<b>'+module.item.title+':</b>', reportData]);
            }
        }
       ];
}
   
        
        
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2273797374656d56617273227d
function systemVariables(module) {
    return {
    prCris_m2_getCountDown : function() {
        if (h.getCountdown(h.getGlobal(mUID + '_countdownKey')).indexOf('-') == -1) {
           return h.getCountdown(h.getGlobal(mUID + '_countdownKey')).split(':')[2];
        }
        return '--';
        }
    };
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22747269676765727320227d
function triggers(module) {
 var triggs = [];
 triggs.push({
      id: mUID + "_countdown_interludio",
      when: "displaying",
      item: "any_song_slide",
      action: function(obj) {
        
        h.setGlobal(mUID + '_countdownKey',mUID + '_instr_ctdw_'+h.random(0, 100000, mUID + '_instr_ctdw_')); //
        
        h.log(mUID, 'trigg_countdown_interludio() Passando título: {} | sl: {}',[obj.slide_description, obj.slide_show_index]);
        if (obj.slide_description == module.settings.instrumentalVerseName) {
          h.log(mUID, 'trigg_countdown_interludio() iniciando countdown');
          h.startCountdown(h.getGlobal(mUID + '_countdownKey'), getInstrumentalTime(obj));
          h.startTimer(mID + '_slide_time');
        }

        var slideAnterior = h.getGlobal(mUID + '_slide_anterior');
        var slideTime = h.getTimerSeconds(mID + '_slide_time');

        if (slideAnterior == module.settings.instrumentalVerseName && slideTime > 0) {
           saveInstrumentalData(obj, slideTime);
        }
        h.setGlobal(mUID + '_slide_anterior', obj.slide_description);
      }
    });

  triggs.push({
      id: mUID + "_time_interludio_closing_any_song",
      when: "closing",
      item: "any_song",
      action: function(obj) {
       storeInstrumentalData();
       h.setGlobal('slide_anterior', '');
       h.log(mUID, 'Encerrando música.');
      }
    });

  triggs.push({
      id: mUID + "_time_interludio_displaying_any_song",
      when: "displaying",
      item: "any_song",
      action: function(obj) {
        storeInstrumentalData();
      }
    });
  return triggs;
};
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22616374696f6e73227d
function actions(module) {

    return [
        actionGravaTempos(),
        listUnrecordedCountdownSongs(module)
    ];
}

function actionGravaTempos() {
    return {
        id: 'gravatempos',
        label: '',
        hint : 'Rec',
        icon : 'system:fiber_manual_record',
        action: function(evt) {
            var interludio_time = !h.getGlobal(mUID + '_rec_interludio_time');
            h.setGlobal(mUID + '_rec_interludio_time', interludio_time);
        },
        status: function(evt) {
            if (h.getGlobal(mUID + '_rec_interludio_time')) {
                return {
                    active: true,           // default = false
                    foreground: 'E6E6E6',   // default = null
                    background: '790903',   // default = null
                    iconColor: 'E6E6E6'     // default = null
                };
            } else {
                return null; // default values
            }
        }
    };
}


function listUnrecordedCountdownSongs(module) {
    return {
        id: 'UnrecordedCountdownSongs',
        label: '',
        hint: 'Relatório de músicas sem Countdown',
        icon : 'system:insert_page_break',
        action: function (evt) {
            var schedule = h.hly('GetCurrentSchedule').data[0];
            var playlist_id = schedule.datetime;
            var instrCtdwn = restoreInstrumentalData();
            var medias = schedule.media_playlist;
            var list = [];
            for (var i = 0; i < medias.length; i++) {
                var item = medias[i];
                if (item.type === 'song') {
                    var id = String(item.song_id);
                    instrCtdwn[id] = repairInstrumentalData(instrCtdwn[id]);
                    if (!isValidCountdownData(instrCtdwn[id])) {
                        list.push(item.name + ' - ' + JSON.stringify(instrCtdwn[id]));
                    }
                }
            }
            if (list.length > 0) {
                h.log("", "Músicas sem countdown:");
                for (var i = 0; i < list.length; i++) {
                    h.log("", list[i]);
                }
                return;
            }
            h.log("", "Todas as músicas da lista possuem countdown.");
        }
    };
}

    function isValidCountdownData(data) {
        // Verifica se o objeto é válido com base nos critérios fornecidos
        if (typeof data !== 'object' || data === null || JSON.stringify(data).length < 3) {
            return false;
        }
        return true;
    }

// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2273657474696e6773227d
function settings() {
    //mesma sintaxe de function input
    return [
        {
            name: 'Sobre ' + mID,
            description: infoVDDMM,
            type: 'label'
        },
        {
            id: 'testScreen',
            label: 'Testar Nome das Telas',
            type: 'boolean'
        },
        {
            id: 'line_break',
            label: 'Quebra de linha',
            type: 'boolean'
        }, 
        {
            id: 'instrumentalVerseName',
            label: 'Nome do verso Instrumental',
            type: 'string',
            default_value: 'Instrumental'
        },
        {
            id: 'screen_id',
            label: 'Tela a Exibir',
            type: 'string',
            suggested_values: function(obj) {
              var r = h.hly('GetDisplaySettings');
              var displayNames = [];
              for (var i = 0; i < r.data.length; i++) {
                   displayNames.push(r.data[i].id);
                   }
              return displayNames;
            }
        },
          {
            type: 'separator'
        },
        {
            id: 'log',
            label: 'Habilitar log',
            type: 'boolean',
            onchange :  function(obj) {
                logState(obj.input.log, mUID,' onchange '+ mID); //habilita ou desabilita o log de acordo com a configuração  
              }
        }
    ];
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22746578745472616e73666f726d227d
function textTransform(module) {
    return {
        song: function(obj) {
            var text = {};
            
            //h.log(module.settings);
            if (module.settings.testScreen) {
                text.add_end = '<styled><color: #ffff00>' + obj.screen_id + '</color>'; 
            }
            
            
            if (obj.screen_id == module.settings.screen_id) {
             text.replace = "";   
            }
                      
            if (obj.slide_description == module.settings.instrumentalVerseName
                && obj.screen_id == module.settings.screen_id
                && obj.slide_number > 0 
                && obj.slide_number < (obj.total_slides - 1)) {
                text.add_start = "<styled><color: #ffff00><size:200> | @js{prCris_m2_getCountDown} | </size></color>" + (module.settings.line_break ? " \n " : "");
                text.line_break = false;
            }

            return Object.keys(text).length > 0 ? text : null;
        }
    };
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2266756e6374696f6e73227d
function getInstrumentalTime(obj) {

  var musicID = String(obj.id);
  if (musicID === 'id') { 
     h.log("sem id");
     return;
  }

  var instrCtdwn = restoreInstrumentalData();
  var slideToGet = String(obj.slide_show_index);   

  try {
    if (instrCtdwn[musicID] && instrCtdwn[musicID][slideToGet] !== undefined) {
      h.log(mUID, 'getInstrumentalTime() instrCtdwn[{}][{}] = {}', [musicID, slideToGet, instrCtdwn[musicID][slideToGet]]);
      return instrCtdwn[musicID][slideToGet];
    } else {
      h.log(mUID, 'getInstrumentalTime() instrCtdwn[{}][{}] = zerado', [musicID, slideToGet]);
      return 0;
    }
  } catch (e) {
    h.log(mUID, 'getInstrumentalTime() Erro: {}', [e.message]);
    return 0;  // Retorna 0 em caso de erro
  }
}

function saveInstrumentalData(obj, slideTime) {

 var musicID = String(obj.id);
 if (musicID == 'id') { 
    h.log("sem id");
    return;
 }
 var slideToSave = String(obj.slide_show_index - 1);    
 if (slideToSave > obj.slide_show_total -1 || slideToSave < 0  || slideToSave > 100) {
     h.log(mUID,'saveInstrumentalData() Ignorado slide {} - t{}s',[slideToSave,slideTime]);
     return;
 }
 
 var instrCtdwn = restoreInstrumentalData();
 
 if (!instrCtdwn[musicID]) {
    instrCtdwn[musicID] = {};  // Inicializa como um objeto vazio
    h.log(mUID, 'saveInstrumentalData() instrCtdwn[{}] inicializado []', [musicID]);
 }
 
 instrCtdwn[musicID] = repairInstrumentalData(instrCtdwn[musicID]); //remove lixo negativo da base antiga
 
 h.log(mUID,'saveInstrumentalData() dados atuais m{}: {}', [musicID, instrCtdwn[musicID]]);

 if (h.getGlobal(mUID + '_rec_interludio_time') || instrCtdwn[musicID][slideToSave] === undefined) {
    instrCtdwn[musicID][slideToSave] = slideTime;
    h.log(mUID,'saveInstrumentalData() Salvo m{}: s{}, t{}', [musicID, slideToSave, slideTime]);
 }
 h.setGlobal(mUID + '_instrCtdwn_addedData', true);
 h.setGlobal(mUID + '_instrCtdwn_data', instrCtdwn);
}

function repairInstrumentalData(data) {
    try {
        var repairedData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key) && parseInt(key, 10) >= 0) {
                repairedData[key] = data[key];
            }
        }
        return repairedData;
    } catch (e) {
        h.log("", "Erro ao reparar dados instrumentais: {}", e);
        return {}; // Retorna um objeto vazio em caso de erro
    }
}

function restoreInstrumentalData() {
  var tmp = h.getGlobal(mUID + '_instrCtdwn_data');
  var origin = 'carregado da memória';

      if (!tmp) {
         tmp = h.restore(mID + '_instrCtdwn_data') ;
         origin = 'carregado do arquivo';
      }
      if (!tmp) {
         tmp = {};
         origin = 'zerado';
      }
  var tmp2 = JSON.stringify(tmp);
  h.log(mUID,"restoreInstrumentalData() - {} - {} bytes",[origin, tmp2.length()]);  
  return tmp;
}

function storeInstrumentalData() {

  if (h.getGlobal(mUID + '_instrCtdwn_addedData')) {
     var instrCtdwn = restoreInstrumentalData();
     h.store(mID + '_instrCtdwn_data', instrCtdwn);
     h.log(mUID,'Dados salvos no arquivo: {}',[instrCtdwn]);
     h.setGlobal(mUID + '_instrCtdwn_addedData',null);
     }
}

function showMessage(title, message) {
    var content = [{ type: 'title', label: title }, { type: 'separator' }];

    if (typeof message === 'string') {
        content.push({ type: 'title', label: message });
    } else if (Array.isArray(message)) {
        for (var i = 0; i < message.length; i++) {
            content.push({ type: 'title', label: '<html>'+message[i] });
        }
    }

    h.input(content);
}


function spanIcon(iconCodePoint){
    return '<html><span style="font-family: Material Icons;">' + iconCodePoint + ' </span>';
}