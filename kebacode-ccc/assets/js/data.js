/* ============================================================
   KebaCode CCC — Données métier
   ============================================================ */

export const PROFILES = [
  { id: 'enfant',   label: { fr: 'Enfant', en: 'Child',  ln: 'Mwana', sw: 'Mtoto' },  age: '6–12', initial: 'E', tone: 'child' },
  { id: 'ado',      label: { fr: 'Adolescent', en: 'Teen', ln: 'Elenge', sw: 'Kijana' }, age: '13–17', initial: 'A', tone: 'teen' },
  { id: 'parent',   label: { fr: 'Parent / Tuteur', en: 'Parent / Guardian', ln: 'Moboti', sw: 'Mzazi' }, age: '', initial: 'P', tone: 'adult' },
  { id: 'visiteur', label: { fr: 'Visiteur', en: 'Visitor', ln: 'Mopaya', sw: 'Mgeni' }, age: '', initial: 'V', tone: 'adult' },
];

export const I18N = {
  fr: {
    online: 'En ligne', offline: 'Hors ligne',
    welcome: 'Bienvenue à la Fondation CCC',
    langQ: 'En quelle langue souhaitez-vous échanger ?',
    langFr: 'Français', langEn: 'English', langLn: 'Lingala', langSw: 'Swahili',
    whoAreYou: 'Qui êtes-vous ?',
    candidate: 'Candidat',
    candidateHint: 'Je cherche mon parcours numérique',
    trainer: 'Formateur CCC',
    trainerHint: 'Espace réservé aux formateurs',
    letsTalk: 'Discutons',
    login: 'Connexion',
    tagline: 'Discutons ensemble pour trouver ton parcours idéal.',
    tapToStart: "Touchez l'écran pour commencer",
    startSurvey: 'Démarrer la conversation',
    trainerMode: 'Mode Formateur',
    nameQ: 'Comment vous appelez-vous ?',
    nameHint: 'Votre prénom nous aide à reprendre votre session si vous revenez.',
    namePlaceholder: 'Votre prénom',
    cityQ: 'Dans quelle ville habitez-vous ?',
    cityHint: 'Sélectionnez votre ville pour orienter les activités CCC près de chez vous.',
    continueBtn: 'Continuer',
    skipName: 'Anonyme',
    resumeTitle: 'Reprendre votre session ?',
    resumeFor: 'Session de',
    resumeBtn: 'Reprendre',
    newSession: 'Nouvelle session',
    hello: 'Bonjour',
    profileQ: 'Quel est votre profil ?',
    profileHint: 'Choisissez pour adapter la conversation.',
    back: 'Retour', next: 'Suivant', restart: 'Recommencer',
    question: 'Question', theme: 'Thème',
    yourAnswer: 'Votre réponse…',
    otherAnswer: 'Autre — j\'écris ma réponse',
    analyzing: 'Je relis notre conversation…',
    computing: 'Je prépare ton parcours sur mesure',
    recommended: 'PARCOURS RECOMMANDÉ',
    basedOn: 'Basé sur vos réponses',
    nextSteps: 'Étapes suivantes',
    joinCCC: 'Rejoindre un club CCC',
    downloadPdf: '↓ Télécharger PDF',
    sessionSaved: 'Session sauvegardée',
    needHelp: 'Besoin d\'aide pour continuer ?',
    yesHelp: 'Oui, aidez-moi', noThanks: 'Non merci',
    inactivity40: 'Je peux reformuler la question si besoin.',
    participants: 'Participants', dropouts: 'Abandons',
    completion: 'Taux de complétion', avgTime: 'Durée moyenne',
    stats: 'Statistiques', campaign: 'Campagne',
    byCity: 'Participants par ville', byProfile: 'Répartition par profil',
    perDay: 'Sessions par jour', export: 'Exporter',
    openStats: 'Ouvrir le tableau de bord', typeCommand: 'Tapez une commande…',
    suggestions: 'Suggestions',
    finTitle: 'Merci d\'avoir utilisé la Borne CCC', finSub: 'Retour à l\'accueil…',
    selectProfile: 'Choisir',
    scoresTitle: 'Scores calculés',
    closingIn: 'Retour à l\'accueil dans',
    seconds: 's…',
    chatProgress: 'Notre discussion',
    sendReply: 'Envoyer',
    finishChat: 'Voir mon parcours →',
    typing: 'Keba réfléchit…',
    participantsList: 'Liste des participants',
    noParticipants: 'Aucun participant trouvé pour ces critères.',
    colName: 'Prénom', colProfile: 'Profil', colCity: 'Ville',
    colPath: 'Parcours recommandé', colStatus: 'Statut', colDate: 'Date',
    statusProgress: 'En cours', statusDone: 'Terminée', statusDropped: 'Abandon',
    loadingParticipants: 'Chargement des participants…',
    resultsCount: 'résultat(s)', dataSource: 'source',
    filterAll: 'Tous', filterTeens: 'Adolescents', filterKids: 'Enfants',
    filterParents: 'Parents', filterVisitors: 'Visiteurs',
    anonymous: 'Anonyme',
    authTitle: 'Connexion formateur',
    authHint: 'Accès réservé aux encadreurs CCC. Utilisez votre email et votre code.',
    authEmail: 'Adresse email',
    authPassword: 'Code d\'accès',
    authSubmit: 'Se connecter',
    authLoading: 'Vérification…',
    authErrorInvalid: 'Email ou mot de passe incorrect.',
    authErrorMissing: 'Veuillez remplir tous les champs.',
    authClear: 'Effacer',
    authShowPassword: 'Afficher le code',
    authWelcome: 'Connecté en tant que',
    authLogout: 'Déconnexion',
    authKbdHint: 'Touchez un champ de saisie — le clavier apparaît automatiquement.',
  },
  en: {
    online: 'Online', offline: 'Offline',
    welcome: 'Welcome to the CCC Foundation',
    langQ: 'Which language would you like to use?',
    langFr: 'Français', langEn: 'English', langLn: 'Lingala', langSw: 'Swahili',
    whoAreYou: 'Who are you?',
    candidate: 'Candidate',
    candidateHint: 'I\'m looking for my digital path',
    trainer: 'CCC Trainer',
    trainerHint: 'Trainer access only',
    letsTalk: 'Let\'s talk',
    login: 'Sign in',
    tagline: 'Let\'s chat to find your ideal learning path.',
    tapToStart: 'Touch the screen to start',
    startSurvey: 'Start the conversation',
    trainerMode: 'Trainer mode',
    nameQ: 'What is your name?',
    nameHint: 'Your first name lets us resume your session if you come back.',
    namePlaceholder: 'Your first name',
    cityQ: 'Which city do you live in?',
    cityHint: 'Select your city so we can guide you to CCC activities near you.',
    continueBtn: 'Continue',
    skipName: 'Skip this step',
    resumeTitle: 'Resume your session?',
    resumeFor: 'Session of',
    resumeBtn: 'Resume',
    newSession: 'New session',
    hello: 'Hello',
    profileQ: 'What is your profile?',
    profileHint: 'Select to adapt the questions.',
    back: 'Back', next: 'Next', restart: 'Restart',
    question: 'Question', theme: 'Theme',
    yourAnswer: 'Your answer…',
    otherAnswer: 'Other — I\'ll write my answer',
    analyzing: 'Analyzing your answers…',
    computing: 'Computing recommended path',
    recommended: 'RECOMMENDED PATH',
    basedOn: 'Based on your answers',
    nextSteps: 'Next steps',
    joinCCC: 'Join a CCC club',
    downloadPdf: '↓ Download PDF',
    sessionSaved: 'Session saved',
    needHelp: 'Need help to continue?',
    yesHelp: 'Yes, help me', noThanks: 'No thanks',
    inactivity40: 'I can rephrase the question if needed.',
    participants: 'Participants', dropouts: 'Dropouts',
    completion: 'Completion rate', avgTime: 'Average time',
    stats: 'Statistics', campaign: 'Campaign',
    byCity: 'Participants by city', byProfile: 'Split by profile',
    perDay: 'Sessions per day', export: 'Export',
    openStats: 'Open dashboard', typeCommand: 'Type a command…',
    suggestions: 'Suggestions',
    finTitle: 'Thanks for using the CCC Kiosk', finSub: 'Returning to home…',
    selectProfile: 'Select',
    scoresTitle: 'Computed scores',
    closingIn: 'Returning home in',
    seconds: 's…',
    chatProgress: 'Our chat',
    sendReply: 'Send',
    finishChat: 'See my path →',
    typing: 'Keba is thinking…',
    participantsList: 'Participants list',
    noParticipants: 'No participants found for these criteria.',
    colName: 'First name', colProfile: 'Profile', colCity: 'City',
    colPath: 'Recommended path', colStatus: 'Status', colDate: 'Date',
    statusProgress: 'In progress', statusDone: 'Completed', statusDropped: 'Dropped',
    loadingParticipants: 'Loading participants…',
    resultsCount: 'result(s)', dataSource: 'source',
    filterAll: 'All', filterTeens: 'Teens', filterKids: 'Children',
    filterParents: 'Parents', filterVisitors: 'Visitors',
    anonymous: 'Anonymous',
    authTitle: 'Trainer sign-in',
    authHint: 'CCC trainers only. Enter your email and access code.',
    authEmail: 'Email address',
    authPassword: 'Access code',
    authSubmit: 'Sign in',
    authLoading: 'Checking…',
    authErrorInvalid: 'Incorrect email or password.',
    authErrorMissing: 'Please fill in all fields.',
    authClear: 'Clear',
    authShowPassword: 'Show code',
    authWelcome: 'Signed in as',
    authLogout: 'Sign out',
    authKbdHint: 'Tap a field — the keyboard appears automatically.',
  },
  ln: {
    online: 'Na ligne', offline: 'Hors ligne',
    welcome: 'Boyei malamu na Fondation CCC',
    langQ: 'Lolenge nini olingi kolobela ?',
    langFr: 'Français', langEn: 'English', langLn: 'Lingala', langSw: 'Swahili',
    whoAreYou: 'Ozali nani ?',
    candidate: 'Mokomi',
    candidateHint: 'Nazali koluka nzela na ngai',
    trainer: 'Molakisi CCC',
    trainerHint: 'Esika ya bamalakisi',
    letsTalk: 'Tolobela',
    login: 'Kokota',
    tagline: 'Luka nzela na yo ya koyekola coder.',
    tapToStart: 'Simba ekran mpo na kobanda',
    startSurvey: 'Banda motuna', trainerMode: 'Mode Molakisi',
    nameQ: 'Kombo na yo nani ?', namePlaceholder: 'Kombo na yo',
    nameHint: 'Kombo na yo esalisaka kozongisa session.',
    cityQ: 'Oza na mboka nini ?',
    cityHint: 'Pona mboka na yo mpo na kolakisa ba activités CCC.',
    continueBtn: 'Koba', skipName: 'Luka etape oyo',
    resumeTitle: 'Zongisa session na yo ?', resumeFor: 'Session ya',
    resumeBtn: 'Zongisa', newSession: 'Session ya sika', hello: 'Mbote',
    profileQ: 'Profil na yo nini ?', profileHint: 'Pona mpo na kobongisa mituna.',
    back: 'Zonga', next: 'Kobanda', restart: 'Bandela lisusu',
    yourAnswer: 'Eyano na yo…', otherAnswer: 'Mosusu — nakoma',
    analyzing: 'Analisi ya biyano…', computing: 'Kokita nzela',
    recommended: 'NZELA ELINGi', basedOn: 'Na biyano na yo',
    joinCCC: 'Kota na club CCC', sessionSaved: 'Session ebombami',
    needHelp: 'Osengeli lisalisi ?', yesHelp: 'Ee', noThanks: 'Te',
    finTitle: 'Matondo', finSub: 'Kozonga na ebandeli…',
    selectProfile: 'Pona', stats: 'Ba statistiques',
    participants: 'Bato', dropouts: 'Bato oyo batiki',
    completion: 'Taux', avgTime: 'Ntango',
    campaign: 'Campagne', byCity: 'Na mboka', byProfile: 'Na profil',
    perDay: 'Na mokolo', export: 'Kobimisa',
    openStats: 'Kofungola tableau', typeCommand: 'Koma commande…',
    suggestions: 'Ba suggestion',
    downloadPdf: '↓ PDF', scoresTitle: 'Ba score',
    closingIn: 'Kozonga na', seconds: 's…',
    participantsList: 'Liste ya bato', noParticipants: 'Moto moko te.',
    colName: 'Kombo', colProfile: 'Profil', colCity: 'Mboka',
    colPath: 'Nzela', colStatus: 'Statut', colDate: 'Mokolo',
    statusProgress: 'Ezali kosala', statusDone: 'Esili', statusDropped: 'Atiki',
    loadingParticipants: 'Kozonga bato…', resultsCount: 'biso', dataSource: 'source',
    filterAll: 'Nyonso', filterTeens: 'Bato ya moke', filterKids: 'Bana',
    filterParents: 'Baboti', filterVisitors: 'Bapaya', anonymous: 'Moto te',
    authTitle: 'Kokota — molakisi',
    authHint: 'Esika ya bamalakisi CCC. Email na code na yo.',
    authEmail: 'Email',
    authPassword: 'Code',
    authSubmit: 'Kokota',
    authLoading: 'Kozala kotala…',
    authErrorInvalid: 'Email to code ezali mabe.',
    authErrorMissing: 'Koma ba champs nyonso.',
    authClear: 'Effacer',
    authShowPassword: 'Komona code',
    authWelcome: 'Okati lokola',
    authLogout: 'Kobima',
    authKbdHint: 'Simba champ — clavier ezali koya yango moko.',
  },
  sw: {
    online: 'Mtandaoni', offline: 'Nje ya mtandao',
    welcome: 'Karibu kwenye Msingi wa CCC',
    langQ: 'Ungependa kuwasiliana kwa lugha gani?',
    langFr: 'Français', langEn: 'English', langLn: 'Lingala', langSw: 'Swahili',
    whoAreYou: 'Wewe ni nani?',
    candidate: 'Mgombea',
    candidateHint: 'Natafuta njia yangu ya kidijitali',
    trainer: 'Mkufunzi CCC',
    trainerHint: 'Eneo la makufunzi pekee',
    letsTalk: 'Tuzungumze',
    login: 'Ingia',
    tagline: 'Tafuta njia yako ya kujifunza kupanga programu.',
    tapToStart: 'Gusa skrini kuanza',
    startSurvey: 'Anza utafiti', trainerMode: 'Hali ya Mkufunzi',
    nameQ: 'Jina lako ni nani ?', namePlaceholder: 'Jina lako',
    nameHint: 'Jina lako linatusaidia kuendelea kipindi chako.',
    cityQ: 'Unaishi jiji gani?',
    cityHint: 'Chagua jiji lako ili tuonyeshe shughuli za CCC karibu nawe.',
    continueBtn: 'Endelea', skipName: 'Ruka hatua hii',
    resumeTitle: 'Endelea kipindi chako ?', resumeFor: 'Kipindi cha',
    resumeBtn: 'Endelea', newSession: 'Kipindi kipya', hello: 'Habari',
    profileQ: 'Wasifu wako ni upi ?', profileHint: 'Chagua ili kurekebisha maswali.',
    back: 'Rudi', next: 'Ifuatayo', restart: 'Anza tena',
    yourAnswer: 'Jibu lako…', otherAnswer: 'Nyingine — nitaandika',
    analyzing: 'Inachambua majibu…', computing: 'Inakokotoa njia',
    recommended: 'NJIA ILIYOPENDEKEZWA', basedOn: 'Kulingana na majibu yako',
    joinCCC: 'Jiunge na klabu ya CCC', sessionSaved: 'Kipindi kimehifadhiwa',
    needHelp: 'Unahitaji msaada ?', yesHelp: 'Ndiyo', noThanks: 'Hapana',
    finTitle: 'Asante', finSub: 'Kurudi nyumbani…',
    selectProfile: 'Chagua', stats: 'Takwimu',
    participants: 'Washiriki', dropouts: 'Waliacha',
    completion: 'Kiwango', avgTime: 'Muda',
    campaign: 'Kampeni', byCity: 'Kwa jiji', byProfile: 'Kwa wasifu',
    perDay: 'Kwa siku', export: 'Hamisha',
    openStats: 'Fungua dashibodi', typeCommand: 'Andika amri…',
    suggestions: 'Mapendekezo',
    downloadPdf: '↓ PDF', scoresTitle: 'Alama',
    closingIn: 'Kurudi nyumbani katika', seconds: 's…',
    participantsList: 'Orodha ya washiriki', noParticipants: 'Hakuna washiriki.',
    colName: 'Jina', colProfile: 'Wasifu', colCity: 'Jiji',
    colPath: 'Njia', colStatus: 'Hali', colDate: 'Tarehe',
    statusProgress: 'Inaendelea', statusDone: 'Imekamilika', statusDropped: 'Ameacha',
    loadingParticipants: 'Inapakia washiriki…', resultsCount: 'matokeo', dataSource: 'chanzo',
    filterAll: 'Wote', filterTeens: 'Vijana', filterKids: 'Watoto',
    filterParents: 'Wazazi', filterVisitors: 'Wageni', anonymous: 'Asiyejulikana',
    authTitle: 'Kuingia — mkufunzi',
    authHint: 'Makufunzi wa CCC pekee. Barua pepe na msimbo wako.',
    authEmail: 'Barua pepe',
    authPassword: 'Msimbo',
    authSubmit: 'Ingia',
    authLoading: 'Inakagua…',
    authErrorInvalid: 'Barua pepe au msimbo si sahihi.',
    authErrorMissing: 'Jaza sehemu zote.',
    authClear: 'Futa',
    authShowPassword: 'Onyesha msimbo',
    authWelcome: 'Umeingia kama',
    authLogout: 'Toka',
    authKbdHint: 'Gusa sehemu ya kuandika — kibodi inaonekana yenyewe.',
  },
};

export function t(lang, key) {
  return (I18N[lang]?.[key]) || I18N.fr[key] || key;
}

/** @deprecated Utiliser conversation.js — conservé pour compatibilité formateur */
export const QUESTIONS = [];

export function getQuestionsForProfile() {
  return [];
}

export function getToneKey(profileId) {
  if (profileId === 'enfant') return 'child';
  if (profileId === 'ado') return 'teen';
  return 'adult';
}

export const RECOS = {
  enfant: {
    key: 'enfant',
    track: 'Scratch Junior → Blockly Games',
    tag: 'Enfant curieux · apprentissage par le jeu',
    steps: ['Atelier Scratch Junior (6 séances)', 'Défis Blockly en groupe', 'Mini-projet : ton premier jeu'],
    club: 'Club CCC Kids — mercredi après-midi',
  },
  ado: {
    key: 'ado',
    track: 'Scratch avancé → Python débutant',
    tag: 'Adolescent motivé · logique & création',
    steps: ['Projet jeu sur Scratch avancé', 'Initiation Python (algorithmes)', 'Hackathon junior CCC'],
    club: 'Club CCC Teens — samedi matin',
  },
  parent: {
    key: 'parent',
    track: 'Découverte CCC → Atelier parents',
    tag: 'Accompagnant · comprendre le numérique',
    steps: ['Visite guidée des parcours CCC', 'Atelier « coder avec son enfant »', 'Sensibilisation cybersécurité famille'],
    club: 'Sessions familles — un samedi par mois',
  },
  visiteur: {
    key: 'visiteur',
    track: 'Parcours Découverte CCC',
    tag: 'Visiteur · première approche',
    steps: ['Démo interactive des langages', 'Rencontre avec un formateur', 'Inscription à une séance d\'essai'],
    club: 'Portes ouvertes CCC — chaque vendredi',
  },
  mentor: {
    key: 'mentor',
    track: 'Mentor Junior CCC',
    tag: 'Leader · aider les autres à apprendre',
    steps: ['Formation mentor junior (4 séances)', 'Accompagnement de pairs débutants', 'Certification CCC Mentor'],
    club: 'Programme Mentor — vendredi soir',
  },
  cybersec: {
    key: 'cybersec',
    track: 'Cybersécurité Jeunes',
    tag: 'Protection numérique · sécurité en ligne',
    steps: ['Atelier mots de passe & vie privée', 'Simulation de phishing', 'Projet sécurité personnelle'],
    club: 'Club Cyber CCC — mardi après-midi',
  },
  robotique: {
    key: 'robotique',
    track: 'Robotique Initiation',
    tag: 'Maker · construire & programmer',
    steps: ['Montage robot éducatif', 'Programmation capteurs', 'Défi robotique CCC'],
    club: 'Lab Robotique — samedi après-midi',
  },
  python_avance: {
    key: 'python_avance',
    track: 'Python Avancé',
    tag: 'Développeur · algorithmes & projets',
    steps: ['Structures de données Python', 'Projet web Flask', 'Contribution open source junior'],
    club: 'Club Python Pro — jeudi soir',
  },
};

export function recommander(answers, profileId) {
  const scores = {};
  const flags = {};

  answers.forEach((a) => {
    if (a.flags) Object.assign(flags, a.flags);
    if (a.score) {
      Object.entries(a.score).forEach(([k, v]) => {
        scores[k] = (scores[k] || 0) + v;
      });
    }
  });

  const parcoursScores = {};

  if (profileId === 'parent') {
    parcoursScores.parent = 100;
  } else if (profileId === 'visiteur') {
    parcoursScores.visiteur = 100;
  } else {
    parcoursScores.enfant = profileId === 'enfant' ? 30 : 0;
    parcoursScores.ado = profileId === 'ado' ? 30 : 0;
  }

  if (flags.jamais_internet) parcoursScores.enfant = (parcoursScores.enfant || 0) + 40;
  if (flags.connait_scratch) parcoursScores.ado = (parcoursScores.ado || 0) + 50;
  if (flags.aime_python) parcoursScores.python_avance = (parcoursScores.python_avance || 0) + 60;
  if (flags.aime_aider && profileId === 'ado') parcoursScores.mentor = (parcoursScores.mentor || 0) + 70;
  if (flags.probleme_motdepasse) parcoursScores.cybersec = (parcoursScores.cybersec || 0) + 50;
  if (flags.aime_robots) parcoursScores.robotique = (parcoursScores.robotique || 0) + 40;
  if (flags.connait_scratch && !flags.aime_python) parcoursScores.ado = (parcoursScores.ado || 0) + 50;

  let bestKey = profileId === 'parent' ? 'parent'
    : profileId === 'visiteur' ? 'visiteur'
    : profileId === 'enfant' ? 'enfant' : 'ado';
  let bestScore = parcoursScores[bestKey] || 0;

  Object.entries(parcoursScores).forEach(([k, v]) => {
    if (v > bestScore) { bestScore = v; bestKey = k; }
  });

  return {
    key: bestKey,
    reco: RECOS[bestKey],
    parcoursScores,
    flags,
    scores,
  };
}

export const STATS = {
  campaign: 'Cybersécurité',
  participants: 48,
  dropouts: 12,
  completionRate: 75,
  avgTime: '4m 12s',
  cities: [
    { label: 'Kinshasa', value: 22 },
    { label: 'Lubumbashi', value: 11 },
    { label: 'Goma', value: 8 },
    { label: 'Bukavu', value: 4 },
    { label: 'Matadi', value: 3 },
  ],
  profiles: [
    { label: 'Adolescent', value: 20, color: 'var(--orange)' },
    { label: 'Enfant', value: 18, color: 'var(--cyan)' },
    { label: 'Parent', value: 6, color: 'var(--orange-light)' },
    { label: 'Visiteur', value: 4, color: 'var(--cyan-light)' },
  ],
  perDay: [
    { d: 'Lun', v: 4 }, { d: 'Mar', v: 7 }, { d: 'Mer', v: 11 },
    { d: 'Jeu', v: 6 }, { d: 'Ven', v: 9 }, { d: 'Sam', v: 8 }, { d: 'Dim', v: 3 },
  ],
};
