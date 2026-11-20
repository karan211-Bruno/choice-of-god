(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.es = {
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    appTitle: 'Choice of God · Elección de Dios',
    appSubtitle: 'RPG de Acción en Campo Abierto de Génesis y Éxodo',
    metaTitle: 'Choice of God v2.0 — RPG de Acción Bíblico',
    ui: {
      hp: 'Salud',
      mp: 'Espíritu MP',
      xp: 'EXP',
      level: 'Nv',
      score: 'Puntos',
      atk: 'ATQ',
      def: 'DEF',
      speed: 'Velocidad',
      faith: 'Fe',
      wisdom: 'Sabiduría',
      mercy: 'Misericordia',
      route: 'Rama del Edén',
      routeUndecided: 'Sin decidir (Explorando)',
      routePreserved: 'Edén Guardado (Corona)',
      routeFallen: 'Fuera del Edén (Redención)',
      worldMap: 'Mapa Mundial / Viaje (M)',
      characterSheet: 'Héroe · Habilidades · Reliquias (C)',
      codex: 'Códice Bíblico',
      settings: 'Ajustes e Idioma',
      help: 'Controles y Guía',
      touchControls: 'Panel Táctil',
      soundOn: 'Sonido Activo',
      soundOff: 'Sonido Silencio',
      language: 'Idioma',
      close: 'Cerrar',
      confirm: 'Confirmar',
      resetProgress: 'Reiniciar Partida',
      resetConfirm: '¿Reiniciar nivel, equipo, misiones y puntuación?',
      questTracker: 'Misiones de la Zona',
      questsDone: 'Listas',
      bossAlert: '¡Encuentro de Jefe!',
      interactPrompt: '[E] Hablar / Interactuar',
      slashBtn: 'Atacar (Espacio)',
      dashBtn: 'Esquivar (Shift)',
      interactBtn: 'Interactuar (E)',
      skillPoints: 'Puntos de Habilidad',
      upgradeSkill: 'Mejorar (+1)',
      maxed: 'MÁX',
      equipped: 'Equipado',
      equip: 'Equipar',
      unlocked: 'Obtenido',
      locked: 'Bloqueado',
      requiresLevel: 'Se une en Nv.{lv}',
      activeGuide: 'Guía Compañero',
      selectGuide: 'Elegir Guía',
      selected: 'Activo',
      travelToZone: 'Viajar a Esta Zona',
      currentZone: 'Zona Actual',
      highestScoreBadge: 'Ruta Máxima (+5,000)',
      freeTravelHint: 'Viaja libremente en cualquier momento entre las 6 regiones de Génesis y Éxodo y los 4 protagonistas. ¡Derrotar a la Serpiente Antigua en el Edén sin comer el fruto otorga +5,000 puntos!',
      slotWeapon: 'Arma',
      slotCloak: 'Manto',
      slotRelic: 'Reliquia',
      slotEmpty: 'Vacío',
      levelUpToast: '¡Subida de Nivel! Nv.{lv} (+1 PH)',
      questDoneToast: 'Misión Completada: {title}',
      bossDefeatedToast: '¡Jefe Purificado! +{score} pts',
      respawnToast: '¡Restaurado en el Santuario!',
      endingBtn: 'Ver Final del Viaje',
      endingTitle: 'Final de la Crónica — Choice of God',
      endingClose: 'Volver al Campo',
      endDialogue: 'Fin del Diálogo',
      controlsHint: 'Mover: WASD/Flechas · Atacar: Espacio/Clic · Esquivar: Shift · Habilidades: 1/2/3 · Hablar: E · Mapa: M · Héroe: C',
      allChapters: 'Todos',
      genesisBook: 'Génesis',
      exodusBook: 'Éxodo',
      danielBook: 'Daniel',
      helpBody1: '1. Explora 6 campos abiertos (1920x1280). Acércate a los PNJ dorados o cristales brillantes y pulsa [E] para hablar o recoger.',
      helpBody2: '2. Pulsa [Espacio] o haz clic para atacar, [Shift] para esquivar con invulnerabilidad y [1/2/3] para usar habilidades.',
      helpBody3: '3. Completa misiones de la esquina superior derecha para subir de nivel y equipar reliquias sagradas en [C].',
      helpBody4: '4. Abre el Mapa Mundial [M] en cualquier momento para cambiar entre Adán y Eva, Noé, Abraham y Moisés.'
    },
    viewpoints: {
      adam_eve: 'Adán y Eva (Creación y Edén)',
      noah: 'Noé (Arca y Diluvio)',
      abraham: 'Abraham (Viaje de Fe)',
      moses: 'Moisés (Éxodo y Sinaí)'
    },
    books: {
      genesis: 'Génesis',
      exodus: 'Éxodo',
      daniel: 'Daniel'
    },
    zones: {
      eden: {
        title: 'Zona 1. Jardín del Edén',
        period: 'Génesis 1–3',
        desc: 'Paraíso regado por cuatro ríos junto al Árbol de la Vida. Reúne la Luz de Creación y derrota a la Serpiente, o decide ante el Árbol del Conocimiento.'
      },
      ark: {
        title: 'Zona 2. Valle del Arca de Noé',
        period: 'Génesis 6–9',
        desc: 'Astillero bajo la lluvia donde surge el Arca. Reúne madera de gofer y brea, guía a las parejas de animales y vence a Leviatán.'
      },
      abraham: {
        title: 'Zona 3. Canaán y Monte Moriah',
        period: 'Génesis 12–22',
        desc: 'Colinas estrelladas de la promesa. Resuelve la contienda con Lot en paz, enciende 5 faros estelares y vence a Quedorlaomer.'
      },
      plagues: {
        title: 'Zona 4. Gosén y Corte de Faraón',
        period: 'Éxodo 3–12',
        desc: 'Responde ante la Zarza Ardiente, sella cinco casas de Gosén en Pascua y derrota al Sumo Mago de Egipto.'
      },
      redsea: {
        title: 'Zona 5. El Mar Rojo Dividido',
        period: 'Éxodo 13–15',
        desc: 'Corredor de tierra seca entre enormes murallas de agua turquesa. Enciende las balizas de fuego, guía a Israel y detén al Capitán de Carros.'
      },
      sinai: {
        title: 'Zona 6. Monte Sinaí y Tabernáculo',
        period: 'Éxodo 16–40',
        desc: 'Recoge el maná matutino, rechaza el Becerro de Oro, vence a Amalec y consagra el Tabernáculo en gloria.'
      }
    },
    quests: {
      'eden-q1': { title: 'Restaurar la Luz', desc: 'Recoge 5 cristales de Luz junto a los cuatro ríos [E].' },
      'eden-q2': { title: 'Consejo del Querubín', desc: 'Habla con el Querubín al este del santuario [E].' },
      'eden-q3': { title: 'Purificar Sombras', desc: 'Derrota a 5 serpientes sombrías y espíritus al oeste.' },
      'eden-q4': { title: 'Jefe: Serpiente Antigua o Encrucijada', desc: 'Vence a la Serpiente para guardar el Edén (+5,000) o elige en el Árbol.' },
      'ark-q1': { title: 'Madera de Gofer y Brea', desc: 'Recoge 6 lotes de madera y brea en el valle [E].' },
      'ark-q2': { title: 'Parejas de Animales', desc: 'Guía a 4 parejas de animales hacia el Arca [E].' },
      'ark-q3': { title: 'Espectros de Tormenta', desc: 'Derrota a 5 espectros que asedian el astillero.' },
      'ark-q4': { title: 'Jefe: Leviatán del Abismo', desc: 'Derrota a Leviatán para sellar el Pacto del Arcoíris.' },
      'abraham-q1': { title: 'Paz con Lot', desc: 'Habla con Lot en el campamento sur [E].' },
      'abraham-q2': { title: 'Faros del Pacto Estelar', desc: 'Enciende los 5 faros de estrellas en Canaán [E].' },
      'abraham-q3': { title: 'Rescate del Valle', desc: 'Derrota a 5 saqueadores en las colinas orientales.' },
      'abraham-q4': { title: 'Jefe: Rey Quedorlaomer', desc: 'Vence a Quedorlaomer al pie del Monte Moriah.' },
      'plagues-q1': { title: 'La Zarza Ardiente', desc: 'Recibe el llamado ante el Ángel del Señor [E].' },
      'plagues-q2': { title: 'Sellos de la Pascua', desc: 'Marca 5 dinteles en las casas de Gosén [E].' },
      'plagues-q3': { title: 'Patio del Palacio', desc: 'Derrota a 5 magos y guardias egipcios.' },
      'plagues-q4': { title: 'Jefe: Sumo Mago de Egipto', desc: 'Vence al Sumo Mago en la corte real.' },
      'redsea-q1': { title: 'Balizas de Fuego', desc: 'Enciende 4 antorchas de columna de fuego [E].' },
      'redsea-q2': { title: 'Reunir al Pueblo', desc: 'Guía a 4 grupos de israelitas en el fondo seco [E].' },
      'redsea-q3': { title: 'Frenar Persecución', desc: 'Destruye 5 carros y guardias egipcios.' },
      'redsea-q4': { title: 'Jefe: Capitán de Carros', desc: 'Derrota al Capitán Real ante la orilla oriental.' },
      'sinai-q1': { title: 'Maná de Cada Mañana', desc: 'Recoge 6 porciones de maná cerca de Horeb [E].' },
      'sinai-q2': { title: 'Prueba del Becerro', desc: 'Enfrenta a Aarón y rechaza al ídolo en el sur [E].' },
      'sinai-q3': { title: 'Defensa ante Amalec', desc: 'Derrota a 6 incursiones amalecitas.' },
      'sinai-q4': { title: 'Jefe: Señor de Amalec', desc: '¡Vence al caudillo amalecita y consagra el Tabernáculo!' }
    },
    bosses: {
      boss_serpent: { name: 'Serpiente Antigua', subtitle: 'Tentador del Edén' },
      boss_leviathan: { name: 'Leviatán del Abismo', subtitle: 'Soberano de la Tempestad' },
      boss_chedorlaomer: { name: 'Rey Quedorlaomer', subtitle: 'Caudillo de Oriente' },
      boss_magician: { name: 'Sumo Mago Real', subtitle: 'Maestro de Hechicería' },
      boss_chariot: { name: 'Capitán de Carros', subtitle: 'Vanguardia de Faraón' },
      boss_amalek: { name: 'Caudillo Amalecita', subtitle: 'Última Prueba del Desierto' }
    },
    speakers: {
      cherubim: 'Querubín Guardián',
      serpent: 'Serpiente y Árbol',
      shem: 'Sem, Hijo de Noé',
      lot: 'Lot, Sobrino de Abraham',
      angel_lord: 'Ángel en la Zarza',
      miriam: 'Profetisa María',
      aaron: 'Aarón y el Becerro'
    },
    skills: {
      nova: { name: 'Onda de Palabra de Luz', desc: 'Libera un anillo dorado que daña y empuja a los enemigos cercanos.' },
      beam: { name: 'Rayo de Vara Milagrosa', desc: 'Dispara un haz sagrado perforante en la dirección de ataque.' },
      grace: { name: 'Gracia del Árbol de la Vida', desc: 'Restaura salud al instante y crea un escudo dorado protector.' }
    },
    guides: {
      cherubim: {
        name: 'Querubín',
        role: 'Guardián del Edén (+5 ATQ, +2 DEF)',
        desc: 'Portador de la espada encendida en Génesis 3:24.',
        quote: '«Alza la luz de la Palabra y guarda el camino de la vida.»'
      },
      angel_lord: {
        name: 'Ángel del Señor',
        role: 'Voz en la Zarza (+9 ATQ, +Regen MP)',
        desc: 'De Éxodo 3:2; acelera la regeneración de Espíritu MP.',
        quote: '«Tierra santa pisas; avanza sin temor.»'
      },
      pillar_fire: {
        name: 'Columna de Nube y Fuego',
        role: 'Guía del Desierto (+18 Vel, +12 ATQ)',
        desc: 'De Éxodo 13:21; potencia la velocidad y fuerza en combate.',
        quote: '«Ni de día ni de noche se apartará de ti Mi guía.»'
      },
      gabriel: {
        name: 'Ángel Gabriel',
        role: 'Mensajero de Sabiduría (+2.8 MP/s, +12% Pts)',
        desc: 'De Daniel 8:16; mejora habilidades y puntuación.',
        quote: '«Toda promesa divina se cumple a su hora señalada.»'
      },
      michael: {
        name: 'Arcángel Miguel',
        role: 'Príncipe Protector (+22 ATQ, +14 DEF, +20% Pts)',
        desc: 'El gran defensor de Daniel 10:13 para la batalla final.',
        quote: '«Quien persevera hasta el fin lleva el escudo del cielo.»'
      }
    },
    items: {
      word_of_light: { name: 'Espada de Luz Creadora', desc: 'De Génesis 1:3 «Sea la luz». (+8 ATQ, +15 MP)' },
      staff_of_moses: { name: 'Vara de Moisés', desc: 'Cayado milagroso de Éxodo 4:2. (+12 ATQ, +20 MP, +10 Salud)' },
      stone_tablets: { name: 'Tablas del Testimonio', desc: 'Reliquia suprema del Sinaí. (+22 ATQ, +8 DEF, +30 Salud)' },
      garment_of_skin: { name: 'Túnica de Pieles', desc: 'Cobertura de Génesis 3:21. (+9 DEF, +40 Salud)' },
      blood_of_lamb: { name: 'Manto de la Pascua', desc: 'Protección de Gosén en Éxodo 12:13. (+15 DEF, +55 Salud)' },
      tree_of_life_leaf: { name: 'Hoja del Árbol de la Vida', desc: 'Corona por guardar el Edén. (+60 Salud, +25 MP, +8 ATQ)' },
      olive_branch: { name: 'Ramo de Olivo', desc: 'Señal de paz tras el diluvio. (+28 Velocidad, +35 Salud)' },
      star_compass: { name: 'Brújula Estelar', desc: 'Promesa celestial de Abraham. (+12 ATQ, +35 MP, +6 DEF)' }
    },
    dialogues: {
      eden_cherubim: {
        n1: 'Adán y Eva, los cuatro ríos fluyen en paz, pero una sombra susurra al oeste. ¿Qué decidirán?',
        c1: 'Sostendremos la Palabra y defenderemos el Edén hasta el fin. (+3 Fe, Curación)',
        c2: 'Vigilaremos con sabiduría esa sombra occidental. (+4 Sabiduría, +150 Pts)',
        n2: '¡Noble decisión! Que la luz fortalezca su espada.',
        n3: 'Permanezcan alerta; el engaño habla con dulzura.'
      },
      eden_crossroads: {
        n1: 'La Serpiente susurra desde el Árbol: «¿Conque Dios os dijo que no comáis? ¡Vuestros ojos serán abiertos!» Elige tu destino:',
        c_resist: '«¡Apártate!» Rechazar la tentación y purificar a la Serpiente Antigua (Ruta Máxima)',
        c_eat: 'Probar el fruto — entrar en la historia humana y la redención (Desbloquea Túnica de Pieles)',
        n_resist: '¡Luz radiante quiebra la sombra! Derrota a la Serpiente para conservar el Edén (+5,000 Bono)!',
        n_eat: 'Entra la fatiga, mas Dios los viste de misericordia y abre el camino de Noé, Abraham y el Éxodo.'
      },
      ark_shem: {
        n1: 'Padre Noé, oscuras nubes cubren el cielo. ¿Están listos la madera, la brea y los animales?',
        c1: 'Todo sigue el mandato divino; salvaremos cada vida. (+4 Fe, Curación)',
        c2: 'Reforcemos el astillero contra los espectros de la tormenta. (+4 Sabiduría, +120 Pts)',
        n2: '¡El Señor llevará el Arca a salvo sobre las aguas!'
      },
      abraham_lot: {
        n1: 'Tío Abraham, nuestros pastores riñen por los pastos. ¿Cómo dividiremos la tierra?',
        c_peace: '«Somos hermanos; no haya contienda. Elige tú primero.» (+6 Fe, +8 Misericordia)',
        c_firm: '«Establezcamos límites claros para mantener el orden.» (+5 Sabiduría)',
        n_peace: 'Tu generosidad me conmueve. ¡Que Dios multiplique tu descendencia como las estrellas!',
        n_firm: 'Sabia decisión. Enciende los faros de estrellas en Canaán.'
      },
      plagues_bush: {
        n1: '¡Moisés, Moisés! Quita el calzado, porque tierra santa pisas. Te envío ante Faraón para librar a Mi pueblo.',
        c_obey: '«¡Heme aquí, Señor! Con Tu vara libraré a Israel.» (+7 Fe, Curación)',
        c_humble: '«Soy tardo de palabra, mas confío en Tu compañía.» (+6 Misericordia, Curación)',
        n_obey: '¡Yo estaré contigo! Sella los dinteles de Gosén y enfrenta la corte.',
        n_humble: 'Mi poder obrará mediante tu vara. ¡Marcha con valor!'
      },
      redsea_miriam: {
        n1: '¡Hermano Moisés! Carros nos persiguen detrás y muros de agua se alzan a los lados. ¡El pueblo tiembla!',
        c1: '«¡No temáis; estad firmes y ved la salvación del Señor!» (+5 Fe, Curación)',
        c2: '«Seguid la columna de fuego en orden; ¡nadie quedará atrás!» (+5 Sabiduría, +4 Misericordia)',
        n2: '¡Vuelve el valor a Israel! Derrotemos al Capitán de Carros hacia la orilla!'
      },
      sinai_calf: {
        n1: 'Mientras tardabas en el monte, el pueblo forjó un Becerro de Oro. ¿Qué harás?',
        c_shatter: '«¡No tendrás dioses ajenos!» Destruir el ídolo y alzar la Ley (+10 Fe, +8 Sabiduría)',
        c_pray: 'Detener la idolatría e interceder con misericordia por el pueblo (+9 Misericordia, +6 Fe)',
        n_shatter: '¡El pueblo se arrepiente! Ahora rechaza a Amalec al norte y consagra el Tabernáculo.',
        n_pray: 'El cielo escucha tu clamor. ¡Erige el Tabernáculo en gloria!'
      }
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
        title: 'Corona del Edén — Guardián Eterno del Paraíso',
        desc: '¡Purificaste a la Serpiente Antigua sin comer del fruto (+5,000 Bono) y triunfaste en Génesis y Éxodo hasta el glorioso Tabernáculo!'
      },
      covenant: {
        title: 'Campeón del Pacto — Gloria sobre el Sinaí',
        desc: 'Atravesando el diluvio, Canaán, plagas y el Mar Rojo abierto, guiaste al pueblo en fe y erigiste el Tabernáculo.'
      },
      pilgrim: {
        title: 'Aventurero de la Fe — Alba de la Crónica',
        desc: '¡Tu travesía ha quedado grabada! Explora las zonas restantes o defiende el Edén intacto (+5,000) para lograr la Corona.'
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.es;
  }
})(typeof window !== 'undefined' ? window : globalThis);
