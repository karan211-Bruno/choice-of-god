(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.es = {
    langCode: 'es',
    langName: 'Spanish',
    langNative: 'Español',
    appTitle: 'Choice of God · Elección de Dios',
    appSubtitle: 'Aventura Narrativa Multigénero de Génesis y Éxodo',
    appTagline: '¿Qué elegirá la humanidad ante la Palabra de Dios — desde guardar el Edén hasta el pacto del Sinaí?',
    metaTitle: 'Choice of God — Juego Narrativo de Génesis y Éxodo',
    ui: {
      close: 'Cerrar',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      retry: 'Reintentar',
      nextLevel: 'Siguiente nivel',
      backToMap: 'Mapa cronológico',
      playStage: 'Iniciar etapa',
      startGame: 'Comenzar viaje',
      continueJourney: 'Continuar viaje',
      selectChapter: 'Selección libre de capítulo y punto de vista',
      freeSelectHint: 'Salta libremente a cualquier historia o punto de vista de Génesis y Éxodo en el orden que prefieras. ¡La puntuación más alta se obtiene defendiendo el Edén en el Capítulo 1!',
      highestScoreBadge: 'Ruta máxima (+5,000)',
      score: 'Puntos',
      level: 'Nivel',
      faith: 'Fe',
      wisdom: 'Sabiduría',
      mercy: 'Misericordia',
      route: 'Rama del Edén',
      routeUndecided: 'Sin decidir (Explorando)',
      routePreserved: 'Edén guardado (Paraíso)',
      routeFallen: 'Fuera del Edén (Redención)',
      soundOn: 'Sonido activado',
      soundOff: 'Sonido desactivado',
      language: 'Idioma',
      settings: 'Ajustes e Idioma',
      codex: 'Códice Bíblico',
      inventory: 'Reliquias y Guías',
      help: 'Cómo jugar',
      resetProgress: 'Reiniciar progreso',
      resetConfirm: '¿Deseas reiniciar todas las puntuaciones y niveles completados?',
      touchControls: 'Panel táctil',
      actionBtn: 'Palabra / Acción (Espacio)',
      itemBar: 'Reliquias (Clic para activar)',
      unlocked: 'Desbloqueado',
      locked: 'Bloqueado',
      requiresLevel: 'Se desbloquea en Nivel {lv}',
      activeGuide: 'Guía acompañante',
      selectGuide: 'Elegir guía',
      selected: 'Seleccionado',
      viewpointLabel: 'Perspectiva',
      genreLabel: 'Género',
      controlsHint: 'Mover: WASD / Flechas · Acción: Espacio / Clic',
      allChapters: 'Todos',
      genesisBook: 'Génesis',
      exodusBook: 'Éxodo',
      danielBook: 'Daniel',
      endingTitle: 'Final del Viaje — Choice of God',
      endingClose: 'Volver al Mapa',
      edenChoiceTitle: 'Encrucijada ante el Árbol del Conocimiento',
      edenChoiceBody: 'El susurro de la serpiente resuena bajo las ramas. ¿Comerás del fruto prohibido para entrar en la historia de redención, o guardarás el Edén con la Palabra?',
      edenChoiceEat: 'Comer del fruto (Rama histórica: Redención)',
      edenChoiceResist: 'Resistir y guardar el Edén (Ruta de mayor puntuación)',
      levelClear: '¡Etapa completada!',
      levelFailed: 'Desafío fallido — Levántate de nuevo',
      starsEarned: 'Estrellas',
      bonusAwarded: 'Bonificación',
      itemObtained: 'Reliquia obtenida',
      guideUnlocked: '¡Nuevo guía celestial se ha unido!',
      subLevelLabel: 'Etapa',
      completedBadge: 'Listo',
      itemUsed: '¡{name} activado!',
      noEffectHere: 'Este objeto no tiene efecto manual en esta etapa.',
      skipToStage: 'Jugar desde aquí',
      helpBody1: '1. Elige libremente cualquiera de los 6 capítulos bíblicos y perspectivas (Adán y Eva, Noé, Abraham, Moisés) desde el mapa.',
      helpBody2: '2. Cada capítulo ofrece 4 subniveles crecientes (Introducción -> Aplicación -> Maestría -> Recompensa) con distintos géneros.',
      helpBody3: '3. Resistir la tentación hasta completar 1-4 en el Edén otorga la corona máxima (+5,000 pts). Comer el fruto abre la transición histórica hacia toda la salvación en Génesis y Éxodo.',
      helpBody4: '4. Al subir de nivel se desbloquean guías bíblicos y puedes activar tus reliquias durante cada partida.'
    },
    viewpoints: {
      adam_eve: 'Adán y Eva (Creación y Edén)',
      noah: 'Noé (El Arca y el Pacto)',
      abraham: 'Abraham (Padre de la Fe)',
      moses: 'Moisés (Éxodo y la Ley)'
    },
    genres: {
      topdown: 'Acción 2D cenital de defensa',
      builder: 'Recolección y equilibrio en tormenta',
      rpg: 'RPG narrativo de decisiones y constelación',
      tactics: 'Estrategia por turnos y Pascua',
      arcade: 'Carrera arcade en el Mar Rojo y ritmo',
      management: 'Gestión del desierto y Tabernáculo'
    },
    books: {
      genesis: 'Génesis',
      exodus: 'Éxodo',
      daniel: 'Daniel'
    },
    chapters: {
      eden: {
        title: 'Cap. 1. Jardín del Edén — La Primera Elección',
        period: 'Génesis 1–3',
        summary: 'Camina en la luz de la creación como Adán y Eva, cuida los cuatro ríos, defiende el Árbol de la Vida o cruza las puertas de la historia.',
        genreDesc: 'Movimiento 2D cenital, ondas de Luz y decisión ramificada'
      },
      ark: {
        title: 'Cap. 2. El Arca de Noé — Diluvio y Arcoíris',
        period: 'Génesis 6–9',
        summary: 'Reúne madera de gofer y brea, empareja animales de dos en dos, mantén el Arca equilibrada en 40 días de lluvia y espera a la paloma.',
        genreDesc: 'Recolección, emparejamiento y reparación en tormenta'
      },
      abraham: {
        title: 'Cap. 3. Abraham — Viaje de Estrellas y Promesa',
        period: 'Génesis 12–22',
        summary: 'Deja Ur y Harán equilibrando Fe, Provisiones y Paz, resuelve la disputa con Lot, cuenta las estrellas del cielo y sube al Monte Moriah.',
        genreDesc: 'RPG estratégico por decisiones y puzle de constelaciones'
      },
      plagues: {
        title: 'Cap. 4. Moisés y las Diez Plagas — Zarza a Pascua',
        period: 'Éxodo 3–12',
        summary: 'Responde ante la zarza ardiente, enfrenta la dureza de Faraón con cartas tácticas protegiendo a Gosén y marca los dinteles en la noche de Pascua.',
        genreDesc: 'Secuencia de señales, duelo táctico y sellado contrarreloj'
      },
      redsea: {
        title: 'Cap. 5. Cruce del Mar Rojo — Columna y Tierra Seca',
        period: 'Éxodo 13–15',
        summary: 'Sigue la columna de fuego nocturna, alza la vara para abrir las aguas y corre por el fondo seco ante los carros egipcios.',
        genreDesc: 'Seguimiento de luz, precisión milagrosa y corredor 3 carriles'
      },
      sinai: {
        title: 'Cap. 6. Monte Sinaí — Maná, Ley y Tabernáculo',
        period: 'Éxodo 16–40',
        summary: 'Recoge el maná exacto de cada día, gira los canales desde la roca de Horeb, une los Diez Mandamientos y arma el Tabernáculo.',
        genreDesc: 'Cuota diaria, puzle de tuberías y montaje del pacto final'
      }
    },
    levels: {
      'eden-1': {
        title: '1-1. Primera Luz de la Creación',
        objective: 'Recoge 6 orbes dorados de Luz de la Creación junto a los cuatro ríos del Edén.',
        intro: 'En el principio creó Dios los cielos y la tierra, y confió a la humanidad un jardín perfecto.',
        outro: '¡La luz llena el jardín y los cuatro ríos cantan con vida nueva!',
        hint: 'Muévete con WASD o flechas para recoger los orbes dorados.'
      },
      'eden-2': {
        title: '1-2. Cuidando el Árbol de la Vida',
        objective: 'Reúne 8 gotas de rocío vital hasta hacer florecer al 100% el Árbol de la Vida.',
        intro: 'Cuida el Árbol de la Vida entre los ríos Pisón, Gihón, Hidekel y Éufrates.',
        outro: 'El Árbol de la Vida resplandece, mas una sombra reptante se aproxima desde el oeste.',
        hint: 'Recoge el rocío azul verdoso evitando tocar la sombra de la serpiente.'
      },
      'eden-3': {
        title: '1-3. Susurro de la Serpiente y Escudo de Luz',
        objective: 'Resiste 25 s repeliendo orbes oscuros con Espacio (o acércate al árbol occidental para decidir).',
        intro: 'La serpiente susurra: «No moriréis; serán abiertos vuestros ojos».',
        outro: '¡Sostuviste la Palabra y superaste la primera tormenta de tentación!',
        hint: 'Pulsa Espacio o Acción para emitir una onda dorada que disipa los orbes oscuros.'
      },
      'eden-4': {
        title: '1-4. Guardar el Paraíso — Corona o Historia',
        objective: '¡Protege el Edén 35 s sin comer del fruto prohibido para ganar la Ruta Corona (+5,000 pts)!',
        intro: 'Llega la hora decisiva del Edén. ¿Guardarás el paraíso intacto o saldrás al camino de la redención?',
        outro: 'Tu elección resuena por la eternidad y marca el rumbo de toda la historia.',
        hint: '¡Usa ondas de Espacio y recoge orbes verdes de gracia para mantener el escudo!'
      },
      'ark-1': {
        title: '2-1. Madera de Gofer y Brea',
        objective: 'Reúne 8 maderos de gofer y 6 jarras de brea para impermeabilizar el Arca.',
        intro: 'Dios ordena a Noé construir un arca de madera de gofer calafateada por dentro y por fuera con brea.',
        outro: 'El casco del Arca queda firmemente sellado contra las aguas.',
        hint: 'Esquiva los escombros y reúne toda la madera y las jarras negras.'
      },
      'ark-2': {
        title: '2-2. De Dos en Dos al Arca',
        objective: 'Haz clic en las 6 parejas iguales de animales para embarcarlos a salvo.',
        intro: 'Antes de que caiga la lluvia, todas las criaturas acuden en parejas buscando refugio.',
        outro: 'Todos están a bordo y el Señor mismo cerró la puerta.',
        hint: 'Haz clic en dos tarjetas idénticas seguidas para formar la pareja.'
      },
      'ark-3': {
        title: '2-3. Cuarenta Días y Noches de Diluvio',
        objective: 'Equilibra el Arca con Izquierda/Derecha y haz clic en las fugas rojas durante 30 s.',
        intro: 'Se abrieron las cataratas de los cielos y llovió cuarenta días y cuarenta noches.',
        outro: 'Las aguas menguan y el Arca reposa sobre los montes de Ararat.',
        hint: 'Usa A/D para centrar la inclinación mientras sellas con clic las grietas rojas.'
      },
      'ark-4': {
        title: '2-4. La Paloma y el Arcoíris del Pacto',
        objective: 'Guía a la paloma esquivando nubes de tormenta, recoge 5 hojas de olivo y vuelve al Arca.',
        intro: 'Al atardecer, Noé envía una paloma sobre las aguas para buscar tierra seca.',
        outro: 'Regresa con una hoja verde de olivo y Dios pone Su arcoíris en las nubes.',
        hint: 'Vuela con las flechas/WASD, toma 5 hojas y regresa al icono del Arca.'
      },
      'abraham-1': {
        title: '3-1. El Llamado a Dejar Ur y Harán',
        objective: 'Supera 3 decisiones rumbo a Canaán manteniendo Fe, Provisiones y Paz sobre cero.',
        intro: 'El Señor dijo a Abram: «Vete de tu tierra y de tu parentela a la tierra que te mostraré».',
        outro: 'Siguiendo la promesa, Abram levanta su primer altar en Canaán.',
        hint: 'Equilibra tus elecciones para que ningún recurso caiga a cero.'
      },
      'abraham-2': {
        title: '3-2. Pacificador junto a Lot',
        objective: 'Resuelve contiendas entre pastores y reyes con la generosidad fiel de Abraham.',
        intro: 'Los rebaños crecieron tanto que los pastores de Abram y de Lot empezaron a reñir.',
        outro: '«Si vas a la izquierda, iré a la derecha.» La paz abrió toda la tierra prometida.',
        hint: 'Las decisiones que priorizan paz y misericordia dan mayor recompensa.'
      },
      'abraham-3': {
        title: '3-3. Cuenta las Estrellas del Cielo',
        objective: 'Conecta las estrellas del pacto en orden exacto del 1 al 9 en el cielo nocturno.',
        intro: 'Dios sacó a Abram afuera: «Mira ahora los cielos, y cuenta las estrellas, si las puedes contar».',
        outro: 'Y creyó al Señor, y le fue contado por justicia.',
        hint: 'Haz clic en las estrellas de la 1 a la 9 en orden.'
      },
      'abraham-4': {
        title: '3-4. Jehová-Jireh en el Monte Moriah',
        objective: 'Supera la prueba suprema de fe y contempla la provisión del carnero.',
        intro: 'Subiendo el Monte Moriah, Isaac pregunta: «¿Dónde está el cordero para el holocausto?»',
        outro: 'Dios proveyó un carnero en el zarzal: «El Señor Proveerá».',
        hint: 'Responde con confianza firme en la fidelidad divina.'
      },
      'plagues-1': {
        title: '4-1. Zarza Ardiente y Tres Señales',
        objective: 'Ejecuta las tres señales (Vara, Mano y Agua del Nilo) en el orden bíblico exacto.',
        intro: 'Desde la zarza que ardía sin consumirse, Dios llama a Moisés.',
        outro: 'Con la vara de Dios en mano, Moisés parte hacia Egipto para liberar a su pueblo.',
        hint: 'Pulsa en orden: 1. Vara -> 2. Mano en el pecho -> 3. Agua del Nilo.'
      },
      'plagues-2': {
        title: '4-2. Frente a Faraón (Primeras Plagas)',
        objective: 'Usa cartas tácticas para quebrantar la dureza de Faraón (100 -> 0) protegiendo a Gosén.',
        intro: 'Faraón endurece su corazón: «¿Quién es el Señor para que yo oiga su voz?»',
        outro: 'Hasta los magos de Egipto confiesan: «Dedo de Dios es este».',
        hint: 'Combina cartas de plaga con [Escudo de Gosén] para proteger la paz del pueblo.'
      },
      'plagues-3': {
        title: '4-3. Granizo, Langostas y Tinieblas',
        objective: 'Resiste los contraataques más duros y vence manteniendo la luz en Gosén.',
        intro: 'Hubo densas tinieblas en todo Egipto por tres días, mas los hijos de Israel tenían luz.',
        outro: 'La luz protegió a Israel en la oscuridad. Solo queda la última noche.',
        hint: 'Prepara cartas defensivas antes de los ataques fuertes de Faraón.'
      },
      'plagues-4': {
        title: '4-4. La Noche de Pascua',
        objective: 'Marca los marcos de las 6 casas israelitas antes de la medianoche.',
        intro: '«Y veré la sangre y pasaré de vosotros, y no habrá en vosotros plaga de mortandad.»',
        outro: 'Faraón llama a Moisés de noche: «¡Salid de en medio de mi pueblo!»',
        hint: 'Haz clic rápido en cada puerta luminosa para aplicar el sello pascual.'
      },
      'redsea-1': {
        title: '5-1. Columna de Nube y Fuego',
        objective: 'Permanece dentro del círculo luminoso de la columna de fuego durante 25 s en el desierto.',
        intro: 'De día columna de nube y de noche columna de fuego guiaban cada paso de Israel.',
        outro: 'El pueblo acampó a salvo en Pi-hahirot, frente al Mar Rojo.',
        hint: '¡Sigue moviéndote dentro del aura dorada que avanza!'
      },
      'redsea-2': {
        title: '5-2. Extiende Tu Vara Sobre el Mar',
        objective: 'Pulsa Espacio (o Clic) dentro de la zona dorada 3 veces para desatar el viento del este.',
        intro: 'Carros detrás, olas profundas delante. Moisés alza su vara sobre las aguas.',
        outro: 'Un recio viento oriental dividió las aguas en murallas a izquierda y derecha.',
        hint: 'Pulsa justo cuando la aguja cruce el centro dorado.'
      },
      'redsea-3': {
        title: '5-3. Carrera por el Fondo Seco',
        objective: 'Esquiva olas y carros por 3 carriles durante 400 m reuniendo a los viajeros.',
        intro: 'Los hijos de Israel marchan por tierra seca en medio del mar mientras Egipto los persigue.',
        outro: '¡Todo el pueblo llegó a la orilla oriental antes de que el mar cubriera a los carros!',
        hint: 'Cambia entre los 3 carriles con Arriba/Abajo o Izquierda/Derecha.'
      },
      'redsea-4': {
        title: '5-4. Cántico de María y Moisés',
        objective: 'Atrapa 12 notas doradas de alabanza en los carriles para completar el himno.',
        intro: 'María tomó un pandero en su mano y todas las mujeres salieron tras ella con cánticos.',
        outro: '«El Señor es mi fortaleza y mi cántico, y ha sido mi salvación.»',
        hint: 'Muévete a izquierda/derecha para atrapar todas las notas doradas.'
      },
      'sinai-1': {
        title: '6-1. El Maná Diario — Solo lo Necesario',
        objective: 'Recoge exactamente 7 manás blancos sin excederte ni tocar maná rojo corrompido.',
        intro: 'Dios hace llover pan del cielo cada mañana para enseñar confianza diaria.',
        outro: 'Cada uno recogió conforme a lo que necesitaba y reposó en el séptimo día.',
        hint: '¡Detente exactamente en 7 manás blancos! Evita los copos rojos.'
      },
      'sinai-2': {
        title: '6-2. Agua Viva de la Roca de Horeb',
        objective: 'Gira las losetas de canal para conectar la Roca (arriba-izq.) con el Campamento (abajo-der.).',
        intro: 'Sedientos en Refidim, Moisés golpea la roca en Horeb por mandato divino.',
        outro: '¡Brota agua cristalina de la peña y sacia a todo Israel!',
        hint: 'Haz clic en los tubos para girarlos hasta unir ambos extremos y pulsa Confirmar.'
      },
      'sinai-3': {
        title: '6-3. Diez Mandamientos y Rechazo al Ídolo',
        objective: 'Empareja 5 mandamientos con su significado y rechaza al Becerro de Oro cuando aparezca.',
        intro: 'Entre truenos y nube en el Sinaí, Dios entrega las tablas de Su pacto.',
        outro: 'El ídolo fue rechazado y los Diez Mandamientos brillaron en piedra.',
        hint: 'Haz clic en un mandamiento a la izquierda y luego en su significado a la derecha.'
      },
      'sinai-4': {
        title: '6-4. El Tabernáculo y la Gloria del Señor',
        objective: 'Coloca los 5 objetos sagrados en sus lugares exactos dentro del Tabernáculo.',
        intro: 'Con corazones dispuestos, el pueblo erige el santuario según el diseño celestial.',
        outro: 'La nube cubrió el tabernáculo y la gloria del Señor lo llenó todo.',
        hint: 'Elige primero un objeto sagrado y luego su ranura correcta.'
      }
    },
    guides: {
      cherubim: {
        name: 'Querubín',
        role: 'Guardián del Edén y Árbol de la Vida',
        desc: 'Descrito en Génesis 3:24 con espada encendida. Te acompaña desde el Nivel 1 fortaleciendo el discernimiento.',
        quote: '«Guardar el camino de la vida no nace del temor, sino del amor santo.»'
      },
      angel_lord: {
        name: 'Ángel del Señor',
        role: 'Voz en la Zarza Ardiente',
        desc: 'Apareció en Éxodo 3:2 en medio de la llama inextinguible para despertar valor y llamado.',
        quote: '«El lugar en que estás, tierra santa es; no temas responder al llamado.»'
      },
      pillar_fire: {
        name: 'Columna de Nube y Fuego',
        role: 'Guía de Día y de Noche',
        desc: 'De Éxodo 13:21, iluminando la travesía nocturna y las aguas abiertas.',
        quote: '«Nunca se apartará de delante del pueblo ni la nube de día ni el fuego de noche.»'
      },
      gabriel: {
        name: 'Ángel Gabriel',
        role: 'Mensajero de Entendimiento',
        desc: 'Enviado en Daniel 8:16 para revelar el sentido de las visiones y promesas.',
        quote: '«No temas el futuro oculto; toda promesa divina cumple su hora señalada.»'
      },
      michael: {
        name: 'Arcángel Miguel',
        role: 'Gran Príncipe Protector',
        desc: 'Nombrado en Daniel 10:13 como defensor incansable del pueblo del pacto.',
        quote: '«Para quienes perseveran en la fe hasta el fin, el escudo del cielo camina contigo.»'
      }
    },
    items: {
      word_of_light: {
        name: 'Palabra de Luz Creadora',
        desc: 'El «Sea la luz» de Génesis 1:3. Amplía las ondas protectoras y otorga bonificación.',
        effectLabel: 'Potencia Onda de Luz / +150 Pts'
      },
      tree_of_life_leaf: {
        name: 'Hoja del Árbol de la Vida',
        desc: 'Gracia del árbol central del Edén. Restaura 1 punto de vida o integridad.',
        effectLabel: 'Restaura +1 Vida/Integridad'
      },
      garment_of_skin: {
        name: 'Túnica de Pieles',
        desc: 'Cobertura misericordiosa de Génesis 3:21. Protege de 1 golpe o error.',
        effectLabel: 'Escudo de 1 Golpe'
      },
      olive_branch: {
        name: 'Hoja Verde de Olivo',
        desc: 'Señal de paz traída por la paloma. Calma tormentas y frena peligros.',
        effectLabel: 'Calma Tormenta y Peligros'
      },
      star_compass: {
        name: 'Brújula Estelar del Pacto',
        desc: 'Recuerdo de la promesa estelar a Abraham. Concede claridad y +200 puntos.',
        effectLabel: 'Claridad / +200 Puntos'
      },
      staff_of_moses: {
        name: 'Vara de Moisés',
        desc: 'El cayado de Éxodo 4:2. Carga energía milagrosa en plagas y mares.',
        effectLabel: 'Carga Poder Milagroso'
      },
      blood_of_lamb: {
        name: 'Sello Pascual',
        desc: 'Señal protectora de Gosén en Éxodo 12:13. Protege tu campamento y suma Fe.',
        effectLabel: 'Escudo Total + Fe'
      },
      stone_tablets: {
        name: 'Tablas del Testimonio',
        desc: 'Escritas en el Sinaí por el dedo de Dios. Añade +500 puntos de pacto.',
        effectLabel: '+500 Bono de Pacto'
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
    games: {
      eden: {
        treeOfLife: 'Árbol de la Vida',
        forbiddenTree: 'Árbol del Conocimiento',
        serpent: 'Serpiente',
        adamEve: 'Adán y Eva',
        orbsLeft: 'Luces restantes',
        timeLeft: 'Tiempo',
        graceHearts: 'Escudo del Edén',
        bloom: 'Floración',
        waveHint: 'Espacio: Onda de Palabra de Luz',
        approachWarning: 'Cerca del Árbol del Conocimiento — quédate aquí para elegir',
        preservedWinTitle: '¡Edén Guardado! (Ruta Corona Celestial)',
        preservedWinDesc: 'Adán y Eva mantuvieron firme la Palabra y vencieron la tentación. ¡El Edén permanece como un paraíso eterno! (+5,000 Puntos Bonus)',
        fallenTransitionTitle: 'Más Allá del Edén — Historia de Redención',
        fallenTransitionDesc: 'Al elegir el fruto comenzó la fatiga, pero Dios los vistió de misericordia y abrió la senda de salvación en Génesis y Éxodo.'
      },
      ark: {
        wood: 'Madera de Gofer',
        pitch: 'Brea',
        pairsLeft: 'Parejas restantes',
        hullIntegrity: 'Integridad del Casco',
        tilt: 'Equilibrio',
        leaksPatched: 'Fugas selladas',
        leaves: 'Hojas de Olivo',
        returnToArk: '¡Vuelve al Arca!',
        animals: ['León', 'Oveja', 'Ciervo', 'Paloma', 'Elefante', 'Buey'],
        patchPrompt: '¡Haz clic en fugas rojas para sellar! Equilibra con A / D'
      },
      abraham: {
        gaugeFaith: 'Fe',
        gaugeProvisions: 'Provisiones',
        gaugePeace: 'Paz',
        nextStar: 'Siguiente estrella',
        starDone: '¡Constelación del Pacto Completa!',
        scenarios: {
          'abraham-1': [
            {
              prompt: 'El Señor ordena a Abram dejar Ur de los caldeos hacia una tierra prometida. ¿Cómo respondes?',
              options: [
                { text: 'Confiar en la Palabra al instante y partir con fe (Fe +20, Provisiones -10)', faith: 20, provisions: -10, peace: 10, score: 250 },
                { text: 'Esperar para acumular más mercancías antes de salir (Provisiones +15, Fe +5)', faith: 5, provisions: 15, peace: 5, score: 160 }
              ]
            },
            {
              prompt: 'Al llegar a Canaán tras Harán, una severa hambruna azota la tierra.',
              options: [
                { text: 'Alzar un altar en fe y compartir raciones con todos (Fe +20, Paz +15)', faith: 20, provisions: -15, peace: 15, score: 260 },
                { text: 'Bajar temporalmente hacia Egipto buscando grano (Provisiones +20, Fe -5)', faith: -5, provisions: 20, peace: 0, score: 170 }
              ]
            },
            {
              prompt: 'De regreso al altar en Betel, renuevas tu compromiso ante Dios.',
              options: [
                { text: 'Invocar el nombre del Señor con adoración agradecida (Fe +25)', faith: 25, provisions: 5, peace: 15, score: 300 },
                { text: 'Priorizar el aumento de rebaños y muros del campamento (Provisiones +15, Paz +5)', faith: 5, provisions: 15, peace: 5, score: 180 }
              ]
            }
          ],
          'abraham-2': [
            {
              prompt: 'Los pastores de Abram y los de Lot discuten por pozos y pastos.',
              options: [
                { text: '«Somos hermanos; no haya contienda. Elige tú primero» (Paz +25, Fe +15)', faith: 15, provisions: -10, peace: 25, score: 320 },
                { text: 'Reclamar primero la fértil llanura del Jordán por antigüedad (Provisiones +20, Paz -20)', faith: -10, provisions: 20, peace: -20, score: 120 }
              ]
            },
            {
              prompt: 'Tras establecerse cerca de Sodoma, Lot es llevado cautivo por reyes invasores.',
              options: [
                { text: 'Guiar a 318 siervos fieles de noche para rescatar a Lot (Fe +20, Paz +15)', faith: 20, provisions: -10, peace: 15, score: 320 },
                { text: 'Permanecer a salvo protegiendo tus propias tiendas (Provisiones +10, Paz -10)', faith: 0, provisions: 10, peace: -10, score: 140 }
              ]
            },
            {
              prompt: 'Tras la victoria, el rey de Sodoma te ofrece todo el botín.',
              options: [
                { text: 'Rechazar hasta un hilo o correa y dar toda gloria a Dios (Fe +25, Paz +15)', faith: 25, provisions: 0, peace: 15, score: 350 },
                { text: 'Aceptar parte del botín para cubrir gastos del campamento (Provisiones +20, Fe -10)', faith: -10, provisions: 20, peace: 0, score: 150 }
              ]
            }
          ],
          'abraham-4': [
            {
              prompt: 'Subiendo el Monte Moriah, Isaac pregunta: «Padre, ¿dónde está el cordero para el holocausto?»',
              options: [
                { text: '«Dios se proveerá de cordero para el holocausto, hijo mío.»', faith: 30, provisions: 0, peace: 20, score: 420 },
                { text: 'Seguir ascendiendo en oración silenciosa hacia la cumbre', faith: 20, provisions: 0, peace: 10, score: 300 }
              ]
            },
            {
              prompt: 'El Ángel del Señor detiene la mano de Abraham y muestra un carnero en el zarzal.',
              options: [
                { text: 'Ofrecer el carnero y nombrar el lugar «Jehová-Jireh» (El Señor Proveerá)', faith: 35, provisions: 15, peace: 25, score: 500 },
                { text: 'Abrazar a Isaac en silenciosa gratitud por la liberación divina', faith: 25, provisions: 10, peace: 20, score: 420 }
              ]
            }
          ]
        }
      },
      plagues: {
        bushTitle: 'Tres Señales en la Zarza Ardiente',
        bushPrompt: 'Activa las tres señales dadas a Moisés en el orden bíblico exacto.',
        signs: [
          { id: 'staff', label: '1. Vara arrojada al suelo' },
          { id: 'hand', label: '2. Mano en el seno' },
          { id: 'nile', label: '3. Agua del río Nilo' }
        ],
        pharaohStubborn: 'Dureza de Faraón',
        goshenFaith: 'Paz de Gosén',
        turn: 'Turno',
        cards: [
          { id: 'blood', name: 'Nilo convertido en Sangre', dmg: 22, shield: 0, desc: 'Dureza -22' },
          { id: 'frogs', name: 'Ranas, Piojos y Moscas', dmg: 26, shield: 0, desc: 'Dureza -26' },
          { id: 'hail', name: 'Granizo y Fuego del Cielo', dmg: 32, shield: 0, desc: 'Golpe fuerte -32' },
          { id: 'darkness', name: '3 Días de Tinieblas / Luz en Gosén', dmg: 20, shield: 20, desc: 'Dureza -20 y Gosén +20' },
          { id: 'goshen', name: 'Escudo de Gosén', dmg: 0, shield: 28, desc: 'Restaura Gosén +28' }
        ],
        passoverHouses: 'Casas selladas',
        passoverTimer: 'Hasta medianoche'
      },
      redsea: {
        pillarDistance: 'Refugio de la Columna',
        staffHits: 'Viento del Este',
        distanceLeft: 'Distancia a la Orilla',
        israelSaved: 'Pueblo guiado',
        notesCaught: 'Notas de alabanza',
        pressAction: '¡Pulsa Espacio / Clic en la zona dorada!',
        laneHint: '¡Cambia entre los 3 carriles con Arriba/Abajo o Izq/Der!'
      },
      sinai: {
        mannaTarget: 'Cuota diaria de Maná',
        mannaCount: 'Maná recogido',
        pipeBtn: 'Comprobar flujo de agua',
        pipeHint: 'Gira las tuberías haciendo clic para unir Horeb (arriba-izq.) con el Campamento (abajo-der.).',
        cmdTitle: 'Une los Diez Mandamientos y Rechaza Ídolos',
        calfWarning: '⚠️ ¡El pueblo pide un Becerro de Oro! ¡Pulsa [Rechazar Ídolo] para mantener el Pacto!',
        calfDestroy: '¡Rechazar y Mantener el Pacto!',
        cmdPairs: [
          { num: '1.er Mandamiento', meaning: 'No tendrás dioses ajenos delante de Mí' },
          { num: '2.º Mandamiento', meaning: 'No te harás imagen ni escultura' },
          { num: '4.º Mandamiento', meaning: 'Acuérdate del día de reposo para santificarlo' },
          { num: '5.º Mandamiento', meaning: 'Honra a tu padre y a tu madre' },
          { num: '6.º y 8.º', meaning: 'No matarás ni hurtarás; ama a tu prójimo' }
        ],
        tabernacleSlots: ['Lugar Santísimo (Oeste)', 'Lugar Santo Norte', 'Lugar Santo Sur', 'Lugar Santo Centro', 'Atrio Exterior'],
        tabernaclePieces: [
          { id: 'ark', name: 'Arca del Pacto', correctSlot: 0 },
          { id: 'bread', name: 'Mesa de los Panes', correctSlot: 1 },
          { id: 'lamp', name: 'Candelero de Oro', correctSlot: 2 },
          { id: 'incense', name: 'Altar del Incienso', correctSlot: 3 },
          { id: 'laver', name: 'Fuente de Bronce y Altar', correctSlot: 4 }
        ],
        tabernacleHint: '¡Elige primero un objeto sagrado y haz clic en su zona correcta!',
        endings: {
          crown: {
            title: 'Corona del Edén — Guardián Fiel del Paraíso',
            desc: '¡Protegiste el Edén sin caer, lograste el bono máximo de +5,000 puntos y completaste Génesis y Éxodo en gloria!'
          },
          covenant: {
            title: 'Portador del Pacto — Gloria sobre el Sinaí',
            desc: 'Atravesando el diluvio, la promesa, las plagas y el mar abierto, edificaste el Tabernáculo en fidelidad.'
          },
          pilgrim: {
            title: 'Peregrino de la Fe — Alba de la Promesa',
            desc: '¡Completaste el final en el Sinaí! Explora los capítulos restantes o defiende el Edén para lograr la Corona.'
          }
        }
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.es;
  }
})(typeof window !== 'undefined' ? window : globalThis);
