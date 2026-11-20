(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.es = {
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    appTitle: 'Choice of God · Elección de Dios',
    appSubtitle: 'Aventura RPG Multigénero Ilustrada (Génesis y Éxodo)',
    appTagline: '¡Un cuento ilustrado bíblico donde cada etapa cambia completamente de género de juego!',
    metaTitle: 'Choice of God v3.0 — Cuento RPG Multigénero',
    ui: {
      galleryTitle: 'Elige Libremente Tu Historia y Género',
      galleryHint: '¡Escoge cualquier héroe y etapa en el orden que prefieras! Proteger el Edén en la Etapa 1 otorga +5,000 puntos.',
      highestScoreBadge: 'Ruta Máxima (+5,000)',
      score: 'Puntos',
      level: 'Nv',
      faith: 'Fe',
      wisdom: 'Sabiduría',
      mercy: 'Misericordia',
      route: 'Rama Edén',
      routeUndecided: 'Explorando',
      routePreserved: 'Edén Guardado',
      routeFallen: 'Historia y Redención',
      activeGuide: 'Compañero',
      playStage: 'Jugar Este Género',
      replayStage: 'Repetir Etapa',
      backToGallery: 'Mapa de Cuento',
      retry: 'Reintentar',
      nextStage: 'Siguiente Etapa',
      codex: 'Códice Bíblico',
      inventory: 'Reliquias y Ángeles',
      help: 'Cómo Jugar',
      settings: 'Ajustes · Idioma',
      soundOn: 'Sonido Activo',
      soundOff: 'Sonido Silencio',
      language: 'Idioma',
      close: 'Cerrar',
      confirm: 'Aceptar',
      resetProgress: 'Reiniciar Progreso',
      resetConfirm: '¿Reiniciar puntuaciones, nivel, reliquias y etapas completadas?',
      touchControls: 'Panel Táctil',
      actionBtn: 'Acción / Ataque (Espacio)',
      dashBtn: 'Rodar / Esquivar (Shift)',
      endDialogue: 'Fin del Diálogo',
      unlocked: 'Obtenido',
      locked: 'Bloqueado',
      requiresLevel: 'Se une en Nv.{lv}',
      selectGuide: 'Elegir Guía',
      selected: 'Siguiéndote',
      completedBadge: 'Listo',
      stageClear: '¡Etapa Completada!',
      stageFailed: '¡Casi lo logras! — Inténtalo otra vez',
      viewEnding: 'Ver Final del Cuento',
      endingTitle: 'Final Ilustrado — Choice of God',
      endingClose: 'Volver al Mapa',
      allChapters: 'Todos',
      genesisBook: 'Génesis',
      exodusBook: 'Éxodo',
      danielBook: 'Daniel',
      controlsHint: 'Mover: WASD/Flechas · Atacar/Apuntar: Espacio/Clic · Esquivar: Shift · ¡6 Géneros!',
      helpBody1: '1. Elige libremente cualquiera de las 6 etapas ilustradas (Adán y Eva, Noé, Abraham, Moisés) desde el Mapa.',
      helpBody2: '2. Cada etapa cambia de género: 1. Action RPG -> 2. Simulación de Construcción -> 3. Estrategia Hexagonal -> 4. Batalla JRPG -> 5. Defensa RTS 3 Carriles -> 6. Disparo de Luz en 1.ª Persona!',
      helpBody3: '3. Vencer a la Serpiente en la Etapa 1 sin comer del fruto otorga +5,000 puntos; comer abre el camino de la redención.',
      helpBody4: '4. Al subir de nivel se unen 5 tiernos ángeles guías y 8 reliquias sagradas.'
    },
    viewpoints: { adam_eve: 'Adán y Eva', noah: 'Noé', abraham: 'Abraham', moses: 'Moisés' },
    genres: {
      action_rpg: '⚔️ Action RPG (Estilo Zelda)',
      city_sim: '🏡 Simulación de Construcción (Aldea)',
      hex_tbs: '♟️ Estrategia Hexagonal (Estilo Civ)',
      jrpg_battle: '🃏 Batalla JRPG por Turnos (FF)',
      rts_defense: '🛡️ Estrategia en Tiempo Real RTS',
      fps_light: '✨ Disparo de Luz 1.ª Persona (FPS)'
    },
    books: { genesis: 'Génesis', exodus: 'Éxodo', daniel: 'Daniel' },
    stages: {
      eden: {
        title: 'Etapa 1. Jardín del Edén — Action RPG',
        period: 'Génesis 1–3',
        objective: '¡Reúne 5 Estrellas de Creación, habla con el Querubín y purifica a la Serpiente o decide en el Árbol!',
        desc: 'Corre y esquiva por el prado soleado como Adán y Eva chibi con espada de luz.',
        outroPreserved: '¡Guardaste la Palabra y el Edén brilla como Paraíso eterno! (+5,000 Bono Corona)',
        outroFallen: '¡Vestidos con la cálida Túnica de Pieles, comienza la historia de redención!'
      },
      ark: {
        title: 'Etapa 2. Arca de Noé — Aldea Constructora',
        period: 'Génesis 6–9',
        objective: '¡Construye aserraderos, pozos de brea y refugios animales en la pradera para completar el Arca al 100%!',
        desc: 'Construye talleres en una cuadrícula 6x4, cosecha recursos y recibe crías de animales adorables.',
        outro: '¡Todos los animalitos subieron a salvo y un arcoíris pastel iluminó el valle!'
      },
      abraham: {
        title: 'Etapa 3. Abraham — Estrategia Hexagonal',
        period: 'Génesis 12–22',
        objective: '¡Avanza turno a turno por hexágonos, enciende 3 Altares de Estrellas y alcanza el Monte Moriah!',
        desc: 'Dirige a Abraham en un mapa hexagonal con diplomacia junto a Lot y duelos tácticos.',
        outro: '¡Una fe más brillante que las estrellas te llevó hasta Jehová-Jireh en Moriah!'
      },
      plagues: {
        title: 'Etapa 4. Moisés y Plagas — Batalla JRPG',
        period: 'Éxodo 3–12',
        objective: '¡Lidera a Moisés y Aarón en combate por turnos usando habilidades milagrosas contra Faraón!',
        desc: 'Combate clásico lateral con Olas del Nilo, Ranas Saltarinas, Granizo, Escudo y Pascua.',
        outro: '¡Gosén brilló bajo el escudo dorado y amaneció la libertad de Israel!'
      },
      redsea: {
        title: 'Etapa 5. Mar Rojo — Defensa RTS 3 Carriles',
        period: 'Éxodo 13–15',
        objective: '¡Usa Maná de Fe para invocar Ángeles, Caballeros y a María en 3 carriles y lanza la Ola de la Vara!',
        desc: 'Estrategia en tiempo real entre muros de agua con pececitos frente a los carros egipcios.',
        outro: '¡Todo el pueblo cruzó en seco mientras el canto de María llenaba el cielo!'
      },
      sinai: {
        title: 'Etapa 6. Monte Sinaí — Luz en 1.ª Persona',
        period: 'Éxodo 16–40',
        objective: '¡Apunta la vara brillante para recoger 8 Manás, purificar 8 sombras e iluminar el Tabernáculo!',
        desc: 'Acción de puntería en primera persona sobre el Monte Sinaí culminando el Tabernáculo dorado.',
        outro: '¡La gloria llenó el Tabernáculo dorado completando el cuento de Génesis y Éxodo!'
      }
    },
    stageUi: {
      eden: {
        stars: 'Estrellas', bossHp: 'Serpiente Chibi Jefe', hearts: 'Corazones',
        hint: 'WASD/Flechas: Mover · Espacio/Clic: Corte de Luz · Shift: Rodar · E: Hablar'
      },
      ark: {
        timber: 'Madera Gofer', pitch: 'Brea', animals: 'Crías A Bordo', arkProg: 'Progreso del Arca',
        tools: { mill: '🪵 Aserradero (Gratis)', well: '🏺 Pozo Brea (3 Mad)', pen: '🐑 Refugio Animal (4 Mad)', buildArk: '🚢 Construir Arca (+25% · 6 Mad, 4 Brea)' },
        harvestTip: '¡Haz clic en la hierba para construir y vuelve a hacer clic en tus talleres para cosechar!'
      },
      abraham: {
        turn: 'Turno', faith: 'Fe', food: 'Víveres', shrines: 'Altares Estelares',
        hint: '¡Haz clic en hexágonos adyacentes iluminados para guiar a Abraham hasta Moriah (arriba-der.)!'
      },
      plagues: {
        mosesParty: 'Moisés y Aarón', enemyParty: 'Faraón y Mago',
        turnPlayer: 'Turno de Moisés — ¡Elige un Milagro!',
        turnEnemy: 'Faraón prepara un contraataque...',
        skills: [
          { id: 'nile', name: '🌊 Ola Carmesí del Nilo', desc: 'Daña a todos 28 (0 MP)' },
          { id: 'frogs', name: '🐸 Ranas Saltarinas', desc: 'Golpe único 42 (15 MP)' },
          { id: 'hail', name: '☄️ Granizo Estelar', desc: 'Gran golpe grupal 48 (24 MP)' },
          { id: 'shield', name: '🛡️ Escudo de Gosén', desc: 'Cura +35 y Escudo (12 MP)' },
          { id: 'passover', name: '🕊️ Sello de Pascua', desc: 'Definitiva 65 y Cura (32 MP)' }
        ]
      },
      redsea: {
        mana: 'Maná de Fe', lane: 'Carril Activo', wave: 'Carros Detenidos', baseHp: 'Caravana de Israel',
        lanes: ['Carril Superior (1)', 'Carril Central (2)', 'Carril Inferior (3)'],
        units: [
          { id: 'angel', name: '👼 Ángel Guardián (20)', cost: 20 },
          { id: 'knight', name: '🛡️ Caballero Escudo (30)', cost: 30 },
          { id: 'miriam', name: '🎵 María Sanadora (25)', cost: 25 },
          { id: 'wave', name: '🌊 ¡Marea de la Vara! (45)', cost: 45 }
        ]
      },
      sinai: {
        manna: 'Maná Recogido', purified: 'Sombras Purificadas', time: 'Luz Restante',
        hint: '¡Apunta con ratón o dedo y Clic (o Espacio) para disparar luz! ¡Recoge Maná y purifica sombras!'
      }
    },
    speakers: {
      cherubim: 'Querubín Bebé Guardián',
      serpent: 'Serpiente Traviesa y Árbol',
      lot: 'Sobrino Lot',
      aaron: 'Aarón y el Becerro'
    },
    dialogues: {
      eden_cherubim: {
        n1: '¡Hola Adán y Eva! Cayeron Estrellas de Creación junto a los ríos y una serpiente traviesa acecha al oeste. ¿Qué harán?',
        c1: '¡Confiaremos en la Palabra y cuidaremos el Edén con todo el corazón! (+4 Fe, Curación)',
        c2: '¡Vigilaré sabiamente el bosque occidental! (+5 Sabiduría, +150 Pts)',
        n2: '¡Qué gran corazón! ¡Que chispas doradas fortalezcan tu espada!',
        n3: '¡Cuidado! Dulces tentaciones aguardan bajo el árbol del oeste.'
      },
      eden_crossroads: {
        n1: 'La serpiente morada sonríe bajo las manzanas brillantes: «¿En verdad dijo Dios que no comáis? ¡Un mordisco abrirá vuestros ojos!»',
        c_resist: '«¡Nunca! ¡Guardaremos la Palabra!» — Rechazar y Proteger el Paraíso (+5,000 Corona)',
        c_eat: '«Probaré un poco...» — Entrar en la Historia y Redención (Desbloquea Túnica de Pieles)',
        n_resist: '¡Luz dorada estalla! ¡Vence a la Serpiente Jefe para guardar el Edén por siempre!',
        n_eat: '¡Aunque empieza el esfuerzo, Dios los abriga con la Túnica de Pieles y abre el camino de Noé, Abraham y Moisés!'
      },
      abraham_lot: {
        n1: '¡Tío Abraham! Nuestros rebaños crecieron demasiado para una sola colina. ¿Cómo dividimos la tierra?',
        c_peace: '«¡Somos familia! No discutamos — escoge tú primero el valle más verde.» (+6 Fe, +8 Misericordia)',
        c_firm: '«Tracemos límites amables para que ambos campamentos vivan en paz.» (+6 Sabiduría)',
        n_peace: '¡Tu bondad me conmueve! ¡Que Dios multiplique tu descendencia como las estrellas!',
        n_firm: '¡Sabia idea! ¡Sigamos marchando a encender los Altares Estelares!'
      },
      sinai_calf: {
        n1: '¡Moisés! El pueblo se impacientó y quiere fabricar un Becerro de Oro. ¿Qué hacemos?',
        c_shatter: '«¡Solo el Señor es Dios!» Rechazar el ídolo y alzar los Mandamientos (+10 Fe)',
        c_pray: 'Orar con ternura para devolver los corazones a Dios (+9 Misericordia)',
        n_shatter: '¡Todos celebran arrepentidos! ¡Ahora apunta la Vara de Luz contra las sombras!',
        n_pray: '¡El cielo sonríe! ¡Consagremos juntos el Tabernáculo!'
      }
    },
    guides: {
      cherubim: { name: 'Querubín Bebé', role: 'Guardián del Edén (+6 ATQ)', desc: 'Ángel alado esponjoso que te anima desde Nv.1.', quote: '«¡Cuidemos el jardín con luz chispeante!»' },
      angel_lord: { name: 'Ángel del Señor', role: 'Guía de la Zarza (+10 ATQ, +5% Pts)', desc: 'Mensajero luminoso de Éxodo 3:2.', quote: '«¡Ten ánimo — camino justo a tu lado!»' },
      pillar_fire: { name: 'Columna de Nube y Fuego', role: 'Guía del Desierto (+14 ATQ, +10% Pts)', desc: 'Brilla de día y de noche en el desierto.', quote: '«¡Ni la noche más oscura ocultará nuestra senda!»' },
      gabriel: { name: 'Ángel Gabriel', role: 'Mensajero Sabio (+18 ATQ, +15% Pts)', desc: 'Alegre mensajero de Daniel 8:16.', quote: '«¡Toda promesa hermosa florece a su hora!»' },
      michael: { name: 'Arcángel Miguel', role: 'Capitán Celestial (+24 ATQ, +22% Pts)', desc: 'Valiente defensor de Daniel 10:13.', quote: '«¡Mantente firme hasta el final — la victoria brilla!»' }
    },
    items: {
      word_of_light: { name: 'Espada Luz Chispeante', desc: 'De Génesis 1:3 (+6 ATQ)' },
      staff_of_moses: { name: 'Vara Dorada de Pastor', desc: 'Cayado milagroso de Éxodo 4:2 (+10 ATQ)' },
      tree_of_life_leaf: { name: 'Corona Hoja de la Vida', desc: 'Premio por guardar el Edén (+35 Salud, +4 Fe)' },
      garment_of_skin: { name: 'Túnica Cálida de Pieles', desc: 'Misericordia de Génesis 3:21 (+8 DEF, +4 Misericordia)' },
      olive_branch: { name: 'Ramita de Olivo', desc: 'Regalo de paz tras el diluvio (+25 Salud)' },
      star_compass: { name: 'Brújula Estelar', desc: 'Promesa de estrellas a Abraham (+8 ATQ, +5 Sabiduría)' },
      blood_of_lamb: { name: 'Escudo Dorado de Pascua', desc: 'Protegió Gosén en el Éxodo (+12 DEF)' },
      stone_tablets: { name: 'Tablas del Sinaí', desc: 'Reliquia suprema del pacto (+16 ATQ, +10 DEF)' }
    },
    bible: {
      gen_1_1: { ref: 'Génesis 1:1', text: 'En el principio creó Dios los cielos y la tierra.' },
      gen_1_3: { ref: 'Génesis 1:3', text: 'Y dijo Dios: Sea la luz; y fue la luz.' },
      gen_2_8_9: { ref: 'Génesis 2:8-9', text: 'Y Jehová Dios plantó un huerto en Edén, al oriente... y el árbol de vida en medio del huerto, y el árbol de la ciencia del bien y del mal.' },
      gen_2_16_17: { ref: 'Génesis 2:16-17', text: 'De todo árbol del huerto podrás comer; mas del árbol de la ciencia del bien y del mal no comerás.' },
      gen_3_1_6: { ref: 'Génesis 3:4-6', text: 'Entonces la serpiente dijo a la mujer: No moriréis... Y tomó de su fruto, y comió; y dio también a su marido, el cual comió así como ella.' },
      gen_3_21: { ref: 'Génesis 3:21', text: 'Y Jehová Dios hizo al hombre y a su mujer túnicas de pieles, y los vistió.' },
      gen_3_24: { ref: 'Génesis 3:24', text: 'Echó, pues, fuera al hombre, y puso al oriente del huerto de Edén querubines, y una espada encendida que se revolvía por todos lados, para guardar el camino del árbol de la vida.' },
      gen_6_14: { ref: 'Génesis 6:14', text: 'Hazte un arca de madera de gofer; harás aposentos en el arca, y la calafatearás con brea por dentro y por fuera.' },
      gen_7_2_3: { ref: 'Génesis 7:2-3', text: 'De todo animal limpio tomarás siete parejas, macho y su hembra; mas de los animales que no son limpios, una pareja... para conservar viva la especie.' },
      gen_7_12: { ref: 'Génesis 7:12', text: 'Y hubo lluvia sobre la tierra cuarenta días y cuarenta noches.' },
      gen_8_11: { ref: 'Génesis 8:11', text: 'Y la paloma volvió a él a la hora de la tarde; y he aquí que traía una hoja de olivo en el pico.' },
      gen_9_13: { ref: 'Génesis 9:13', text: 'Mi arco he puesto en las nubes, el cual será por señal del pacto entre mí y la tierra.' },
      gen_12_1_4: { ref: 'Génesis 12:1-2', text: 'Vete de tu tierra y de tu parentela, y de la casa de tu padre, a la tierra que te mostraré. Y haré de ti una nación grande, y te bendeciré.' },
      gen_13_8_9: { ref: 'Génesis 13:8-9', text: 'No haya ahora altercado entre nosotros dos... Si fueres a la mano izquierda, yo iré a la derecha.' },
      gen_15_5: { ref: 'Génesis 15:5', text: 'Mira ahora los cielos, y cuenta las estrellas, si las puedes contar. Y le dijo: Así será tu descendencia.' },
      gen_22_13_14: { ref: 'Génesis 22:13-14', text: 'Y llamó Abraham el nombre de aquel lugar, Jehová proveerá. En el monte de Jehová será provisto.' },
      exod_3_2_5: { ref: 'Éxodo 3:2, 5', text: 'Y se le apareció el Ángel de Jehová en una llama de fuego en medio de una zarza... Quita tu calzado de tus pies, porque el lugar en que tú estás, tierra santa es.' },
      exod_4_2: { ref: 'Éxodo 4:2', text: 'Y Jehová dijo: ¿Qué es eso que tienes en tu mano? Y él respondió: Una vara.' },
      exod_7_14_17: { ref: 'Éxodo 7:17', text: 'He aquí yo golpearé con la vara que tengo en mi mano el agua que está en el río, y se convertirá en sangre.' },
      exod_9_22_26: { ref: 'Éxodo 9:26', text: 'Solamente en la tierra de Gosén, donde estaban los hijos de Israel, no hubo granizo.' },
      exod_12_12_13: { ref: 'Éxodo 12:13', text: 'Y la sangre os será por señal en las casas donde vosotros estéis; y veré la sangre y pasaré de vosotros.' },
      exod_13_21: { ref: 'Éxodo 13:21', text: 'Y Jehová iba delante de ellos de día en una columna de nube para guiarlos por el camino, y de noche en una columna de fuego para alumbrarles.' },
      exod_14_13_16: { ref: 'Éxodo 14:13, 16', text: 'No temáis; estad firmes, y ved la salvación que Jehová hará hoy con vosotros... Y tú alza tu vara, y extiende tu mano sobre el mar, y divídelo.' },
      exod_14_21_22: { ref: 'Éxodo 14:21-22', text: 'Hizo Jehová que el mar se retirase por recio viento oriental toda aquella noche... Y los hijos de Israel entraron por en medio del mar, en seco.' },
      exod_15_1_2: { ref: 'Éxodo 15:2', text: 'Jehová es mi fortaleza y mi cántico, y ha sido mi salvación. Este es mi Dios, y lo alabaré.' },
      exod_16_4_15: { ref: 'Éxodo 16:4, 15', text: 'He aquí yo os haré llover pan del cielo; y el pueblo saldrá, y recogerá diariamente la porción de un día.' },
      exod_17_6: { ref: 'Éxodo 17:6', text: 'Golpearás la peña, y saldrán de ella aguas, y beberá el pueblo.' },
      exod_20_1_17: { ref: 'Éxodo 20:2-3', text: 'Yo soy Jehová tu Dios, que te saqué de la tierra de Egipto, de casa de servidumbre. No tendrás dioses ajenos delante de mí.' },
      exod_31_18: { ref: 'Éxodo 31:18', text: 'Y dio a Moisés, cuando acabó de hablar con él en el monte de Sinaí, dos tablas del testimonio, tablas de piedra escritas con el dedo de Dios.' },
      exod_40_34: { ref: 'Éxodo 40:34', text: 'Entonces una nube cubrió el tabernáculo de reunión, y la gloria de Jehová llenó el tabernáculo.' },
      dan_8_16: { ref: 'Daniel 8:16', text: '«Gabriel, enseña a este la visión.»' },
      dan_10_13: { ref: 'Daniel 10:13', text: 'Pero he aquí Miguel, uno de los principales príncipes, vino para ayudarme.' }
    },
    endings: {
      crown: {
        title: 'Corona del Edén — Radiante Guardián del Paraíso',
        desc: '¡Protegiste el Edén logrando el bono de +5,000 puntos y completaste con alegría los 6 géneros bíblicos!'
      },
      covenant: {
        title: 'Estrella del Pacto — Gloria sobre el Sinaí',
        desc: '¡Mediante Action RPG, Aldea, Hex, JRPG, RTS y Puntería de Luz levantaste el dorado Tabernáculo!'
      },
      pilgrim: {
        title: 'Peregrino Ilustrado de la Fe',
        desc: '¡Un hermoso comienzo por Génesis y Éxodo! ¡Prueba cada género y defiende el Edén para lograr la Corona!'
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.es;
  }
})(typeof window !== 'undefined' ? window : globalThis);
