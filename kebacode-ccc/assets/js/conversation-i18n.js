/* ============================================================
   KebaCode CCC — Conversation i18n (en, ln, sw)
   French defaults remain in conversation.js
   ============================================================ */

const CONV = {
  enfant: {
    start: {
      message: {
        child: {
          en: (ctx) => `Hi ${ctx.userName || 'there'}! I'm Keba, your digital buddy at the CCC club.`,
          ln: (ctx) => `Mbote ${ctx.userName || 'yo'}! Nazali Keba, moninga na yo ya numérique na club CCC.`,
          sw: (ctx) => `Habari ${ctx.userName || 'rafiki'}! Mimi ni Keba, rafiki yako wa kidigitali kwenye klabu ya CCC.`,
        },
      },
    },
    devices: {
      message: {
        child: {
          en: () => 'Tell me: what do you use most often at home or at school?',
          ln: () => 'Loba ngai: nini olingaka mingi na ndako to na école?',
          sw: () => 'Niambie: unatumia nini zaidi nyumbani au shuleni?',
        },
      },
      choices: {
        tablet: {
          child: {
            en: 'A tablet',
            ln: 'Tablette moko',
            sw: 'Kompyuta kibao (tablet)',
          },
        },
        phone: {
          child: {
            en: 'The grown-ups\' phone',
            ln: 'Téléphone ya bakolo',
            sw: 'Simu ya wazee',
          },
        },
        computer: {
          child: {
            en: 'A computer',
            ln: 'Ordinateur moko',
            sw: 'Kompyuta',
          },
        },
        rarely: {
          child: {
            en: 'Almost never',
            ln: 'Mingi te',
            sw: 'Karibu kamwe',
          },
        },
      },
    },
    offline_welcome: {
      message: {
        child: {
          en: () => 'No worries! At the CCC club, we have computers for everyone. You\'ll get to explore.',
          ln: () => 'Ezali malamu! Na club CCC, tozali na ba ordinateur mpo na bato nyonso. Okokoma koyeba makambo.',
          sw: () => 'Hakuna shida! Kwenye klabu ya CCC, tuna kompyuta kwa kila mtu. Utaweza kujifunza.',
        },
      },
    },
    code_try: {
      message: {
        child: {
          en: (ctx) => ctx.access === 'high'
            ? 'Great! Have you tried coding before? It\'s a bit like putting puzzles together.'
            : 'Have you heard about coding? It\'s giving instructions to the computer.',
          ln: (ctx) => ctx.access === 'high'
            ? 'Malamu! Osali déjà komeka kokóta? Ezali lokola kotia ba puzzle na esika moko.'
            : 'Oyokaki déjà makambo ya kokóta? Ezali kopesa ba consigne na ordinateur.',
          sw: (ctx) => ctx.access === 'high'
            ? 'Vizuri! Je, umeshawahi kujaribu kuandika programu? Ni kama kuunganisha vipande vya puzzle.'
            : 'Je, umesikia kuhusu kuandika programu? Ni kutoa maagizo kwa kompyuta.',
        },
      },
      choices: {
        yes: {
          child: {
            en: 'Yes, I\'ve done it before!',
            ln: 'Ee, nasali yango déjà!',
            sw: 'Ndiyo, nimeshafanya!',
          },
        },
        heard: {
          child: {
            en: 'I\'ve heard about it',
            ln: 'Nayokaki yango',
            sw: 'Nimesikia kuhusu hilo',
          },
        },
        no: {
          child: {
            en: 'No, what is it?',
            ln: 'Te, yango ezali nini?',
            sw: 'Hapana, ni nini?',
          },
        },
      },
    },
    explain_code: {
      message: {
        child: {
          en: () => 'Imagine: you tell a character "take 10 steps, turn, jump"… and they do it! That\'s code. Fun, right?',
          ln: () => 'Kanisa: olobi na personnage « kende ba pas 10, zongisa, tumbuka »… mpe azali kosala yango! Yango ezali code. Ezali esengo, soki?',
          sw: () => 'Fikiria: unamwambia mhusika "tembea hatua 10, zunguka, ruka"… na anafanya! Hiyo ndiyo programu. Inafurahisha, sivyo?',
        },
      },
    },
    creation: {
      message: {
        child: {
          en: () => 'If you had a digital superpower, what would you create first?',
          ln: () => 'Soki ozali na nguya ya numérique, nini okokela liboso?',
          sw: () => 'Kama ungekuwa na uwezo wa kidigitali, ungeunda nini kwanza?',
        },
      },
      choices: {
        game: {
          child: {
            en: 'My own game',
            ln: 'Lisano na ngai',
            sw: 'Mchezo wangu mwenyewe',
          },
        },
        animation: {
          child: {
            en: 'A cartoon',
            ln: 'Dessin animé moko',
            sw: 'Katuni',
          },
        },
        robot: {
          child: {
            en: 'A robot',
            ln: 'Robot moko',
            sw: 'Roboti',
          },
        },
      },
    },
    react_game: {
      message: {
        child: {
          en: () => 'A game! I love that. With Scratch, you can move characters in just a few clicks. Want to try?',
          ln: () => 'Lisano! Nalingi yango. Na Scratch, okoki kosala ba personnage ekende na ba clic moke. Olingi?',
          sw: () => 'Mchezo! Napenda hilo. Kwa Scratch, unaweza kuhamisha wahusika kwa mibofyo michache. Ungependa?',
        },
      },
      choices: {
        yes: {
          child: {
            en: 'Yes, so cool!',
            ln: 'Ee, malamu mingi!',
            sw: 'Ndiyo, ni nzuri sana!',
          },
        },
        maybe: {
          child: {
            en: 'Maybe',
            ln: 'Mbala moko',
            sw: 'Labda',
          },
        },
      },
    },
    react_animation: {
      message: {
        child: {
          en: () => 'Cartoons are magic, frame by frame. Scratch is perfect for that too!',
          ln: () => 'Ba dessin animé ezali magie, image na image. Scratch ezali malamu mpo na yango!',
          sw: () => 'Katuni ni uchawi, picha kwa picha. Scratch pia ni nzuri kwa hilo!',
        },
      },
    },
    react_robot: {
      message: {
        child: {
          en: () => 'A robot! We build them at the CCC lab. You program their eyes and wheels. Exciting?',
          ln: () => 'Robot! Tosalaka yango na laboratoire CCC. Okokóta miso na ba roue na yango. Ezali esengo?',
          sw: () => 'Roboti! Tunazitengeneza kwenye maabara ya CCC. Unaweza kuandika programu ya macho na magurudumu yake. Inafurahisha?',
        },
      },
      choices: {
        yes: {
          child: {
            en: 'Totally!',
            ln: 'Ee, vraiment!',
            sw: 'Kabisa!',
          },
        },
        curious: {
          child: {
            en: 'I want to see',
            ln: 'Nalingi kotala',
            sw: 'Nataka kuona',
          },
        },
      },
    },
    learn_style: {
      message: {
        child: {
          en: () => 'When you learn, do you prefer being with other kids or going at your own pace?',
          ln: () => 'Mpo na koyekola, olingi kozala na baninga to kokende na ndenge na yo?',
          sw: () => 'Unapojifunza, unapenda kuwa na watoto wengine au kwenda kwa kasi yako mwenyewe?',
        },
      },
      choices: {
        group: {
          child: {
            en: 'With friends',
            ln: 'Na baninga',
            sw: 'Na marafiki',
          },
        },
        solo: {
          child: {
            en: 'All by myself',
            ln: 'Na ngai moko',
            sw: 'Peke yangu',
          },
        },
        both: {
          child: {
            en: 'Both',
            ln: 'Nyonso mibale',
            sw: 'Zote mbili',
          },
        },
      },
    },
    internet_check: {
      message: {
        child: {
          en: (ctx) => ctx.access === 'low'
            ? 'At home, do you sometimes manage to connect to the Internet?'
            : 'And does the Internet work well at home?',
          ln: (ctx) => ctx.access === 'low'
            ? 'Na ndako, mbala moko okoki kokóta na Internet?'
            : 'Internet na ndako, ezali kosala malamu?',
          sw: (ctx) => ctx.access === 'low'
            ? 'Nyumbani, je, wakati mwingine unaweza kuunganishwa kwenye Intaneti?'
            : 'Na Intaneti nyumbani, inafanya kazi vizuri?',
        },
      },
      choices: {
        yes: {
          child: {
            en: 'Yes',
            ln: 'Ee',
            sw: 'Ndiyo',
          },
        },
        sometimes: {
          child: {
            en: 'Sometimes',
            ln: 'Mbala moko',
            sw: 'Wakati mwingine',
          },
        },
        no: {
          child: {
            en: 'No / I don\'t know',
            ln: 'Te / nayebi te',
            sw: 'Hapana / sijui',
          },
        },
      },
    },
    security_simple: {
      message: {
        child: {
          en: () => 'Quick important question: do you know you should never give your password to anyone?',
          ln: () => 'Motuna moko ya ntina: oyebi ete osengeli kopesa mot de passe na yo na moto te?',
          sw: () => 'Swali muhimu: unajua usipaswi kumpa mtu yeyote nenosiri lako?',
        },
      },
      choices: {
        yes: {
          child: {
            en: 'Yes, it\'s secret!',
            ln: 'Ee, ezali secret!',
            sw: 'Ndiyo, ni siri!',
          },
        },
        learn: {
          child: {
            en: 'Teach me',
            ln: 'Yekolisa ngai',
            sw: 'Nifundishe',
          },
        },
      },
    },
    dream: {
      message: {
        child: {
          en: () => 'Last thing: when you grow up, what would you like to do with technology?',
          ln: () => 'Eloko ya nsuka: soki okomaki mokolo, nini olingi kosala na numérique?',
          sw: () => 'Jambo la mwisho: ukikua, ungependa kufanya nini na teknolojia?',
        },
      },
    },
    availability: {
      message: {
        child: {
          en: () => 'When could you come to the CCC club? (Wednesday, Saturday…)',
          ln: () => 'Lini okoki koya na club CCC? (mercredi, samedi…)',
          sw: () => 'Unaweza kuja klabuni CCC lini? (Jumatano, Jumamosi…)',
        },
      },
    },
  },

  ado: {
    start: {
      message: {
        teen: {
          en: (ctx) => `Hey ${ctx.userName || ''}! Let's chat for a couple of minutes to find a path that fits you.`,
          ln: (ctx) => `Mbote ${ctx.userName || ''}! Tosolola mwa minute moko mpo na kozwa parcours oyo ekoki na yo.`,
          sw: (ctx) => `Habari ${ctx.userName || ''}! Tuzungumze dakika chache ili kupata njia inayokufaa.`,
        },
      },
    },
    digital_life: {
      message: {
        teen: {
          en: () => 'Real talk — how much time do you spend online each week?',
          ln: () => 'Solola solo: ondimi ngonga boni na Internet chaque semaine?',
          sw: () => 'Tuongee ukweli: unatumia muda gani mtandaoni kila wiki?',
        },
      },
      choices: {
        lot: {
          teen: {
            en: 'A lot (+10h)',
            ln: 'Mingi (+10h)',
            sw: 'Sana (+10h)',
          },
        },
        moderate: {
          teen: {
            en: 'A bit (3–10h)',
            ln: 'Moke (3–10h)',
            sw: 'Kidogo (3–10h)',
          },
        },
        little: {
          teen: {
            en: 'Almost none',
            ln: 'Mingi te',
            sw: 'Karibu hakuna',
          },
        },
      },
    },
    offline_interest: {
      message: {
        teen: {
          en: () => 'No problem — the club has all the gear. What would interest you most?',
          ln: () => 'Ezali malamu — na club tozali na matériel nyonso. Nini ekosala yo esengo?',
          sw: () => 'Hakuna shida — klabuni kuna vifaa vyote. Nini ungependa zaidi?',
        },
      },
    },
    online_activity: {
      message: {
        teen: {
          en: () => 'And what do you mostly do online?',
          ln: () => 'Mpe osali nini mingi na Internet?',
          sw: () => 'Na unafanya nini zaidi mtandaoni?',
        },
      },
      choices: {
        social: {
          teen: {
            en: 'Social media & messaging',
            ln: 'Réseaux sociaux & messages',
            sw: 'Mitandao ya kijamii na ujumbe',
          },
        },
        games: {
          teen: {
            en: 'Games & videos',
            ln: 'Ba jeux & ba vidéos',
            sw: 'Michezo na video',
          },
        },
        learn: {
          teen: {
            en: 'Learning / creating',
            ln: 'Koyekola / kokela',
            sw: 'Kujifunza / kuunda',
          },
        },
        mix: {
          teen: {
            en: 'A bit of everything',
            ln: 'Mwa eloko nyonso',
            sw: 'Kidogo cha kila kitu',
          },
        },
      },
    },
    cyber_check: {
      message: {
        teen: {
          en: () => 'On social media, have you ever seen someone get harassed online?',
          ln: () => 'Na réseaux sociaux, omoni déjà moto azali kozangisama na Internet?',
          sw: () => 'Kwenye mitandao ya kijamii, umewahi kuona mtu akidhulumu mtandaoni?',
        },
      },
      choices: {
        yes_me: {
          teen: {
            en: 'Yes, me',
            ln: 'Ee, ngai',
            sw: 'Ndiyo, mimi',
          },
        },
        yes_other: {
          teen: {
            en: 'Yes, someone I know',
            ln: 'Ee, moto nayebi',
            sw: 'Ndiyo, mtu ninayemjua',
          },
        },
        no: {
          teen: {
            en: 'No',
            ln: 'Te',
            sw: 'Hapana',
          },
        },
      },
    },
    coding_level: {
      message: {
        teen: {
          en: () => 'Have you coded before? Scratch, Python, something else?',
          ln: () => 'Osali déjà kokóta? Scratch, Python, eloko mosusu?',
          sw: () => 'Umewahi kuandika programu? Scratch, Python, kitu kingine?',
        },
      },
      choices: {
        python: {
          teen: {
            en: 'Yes, Python or more',
            ln: 'Ee, Python to koleka',
            sw: 'Ndiyo, Python au zaidi',
          },
        },
        scratch: {
          teen: {
            en: 'Mostly Scratch',
            ln: 'Scratch mingi',
            sw: 'Zaidi Scratch',
          },
        },
        beginner: {
          teen: {
            en: 'Almost never',
            ln: 'Mingi te',
            sw: 'Karibu kamwe',
          },
        },
      },
    },
    passion: {
      message: {
        teen: {
          en: () => 'If you had to pick a personal project, it would be…',
          ln: () => 'Soki osengeli kopona projet moko, yango ekozala…',
          sw: () => 'Kama ungechagua mradi wa kibinafsi, ungechagua…',
        },
      },
      choices: {
        game: {
          teen: {
            en: 'A game or an app',
            ln: 'Lisano to application',
            sw: 'Mchezo au programu (app)',
          },
        },
        python: {
          teen: {
            en: 'Data / Python',
            ln: 'Data / Python',
            sw: 'Data / Python',
          },
        },
        robot: {
          teen: {
            en: 'Robotics / hardware',
            ln: 'Robotique / matériel',
            sw: 'Roboti / vifaa vya elektroniki',
          },
        },
        web: {
          teen: {
            en: 'A website',
            ln: 'Site web moko',
            sw: 'Tovuti',
          },
        },
      },
    },
    tech_interest: {
      message: {
        teen: {
          en: (ctx) => ctx.interest === 'python' || ctx.coding === 'advanced'
            ? 'Python interests you — are you more into building things or solving tough problems?'
            : 'Do you prefer learning by making something real or understanding the theory first?',
          ln: (ctx) => ctx.interest === 'python' || ctx.coding === 'advanced'
            ? 'Python ekosala yo esengo — olingi koleka kokela to kobongisa ba problème ya makasi?'
            : 'Olingi koyekola na kokela eloko ya solo to koyeba théorie liboso?',
          sw: (ctx) => ctx.interest === 'python' || ctx.coding === 'advanced'
            ? 'Python inakuvutia — ungependa kuunda vitu au kutatua matatizo magumu?'
            : 'Unapenda kujifunza kwa kutengeneza kitu halisi au kuelewa nadharia kwanza?',
        },
      },
      choices: {
        build: {
          teen: {
            en: 'Build a project',
            ln: 'Kokela projet moko',
            sw: 'Kutengeneza mradi',
          },
        },
        theory: {
          teen: {
            en: 'Understand deeply',
            ln: 'Koyeba na profondeur',
            sw: 'Kuelewa kwa kina',
          },
        },
        both: {
          teen: {
            en: 'Both',
            ln: 'Nyonso mibale',
            sw: 'Zote mbili',
          },
        },
      },
    },
    help_others: {
      message: {
        teen: {
          en: () => 'Do you like helping others once you\'ve figured something out?',
          ln: () => 'Olingi kosalisa bato mosusu soki oyebani eloko moko?',
          sw: () => 'Unapenda kuwasaidia wengine ukishajua kitu?',
        },
      },
      choices: {
        yes: {
          teen: {
            en: 'Yes, I love explaining',
            ln: 'Ee, nalingi kolimbola',
            sw: 'Ndiyo, napenda kuelezea',
          },
        },
        sometimes: {
          teen: {
            en: 'Sometimes',
            ln: 'Mbala moko',
            sw: 'Wakati mwingine',
          },
        },
        no: {
          teen: {
            en: 'I prefer going solo',
            ln: 'Nalingi kokende na ngai moko',
            sw: 'Napenda kwenda peke yangu',
          },
        },
      },
    },
    availability: {
      message: {
        teen: {
          en: () => 'To wrap up: which days are you free for the club?',
          ln: () => 'Mpo na kosilisa: mikolo nini ozali disponible mpo na club?',
          sw: () => 'Kumalizia: siku gani unaweza kuja klabuni?',
        },
      },
    },
  },

  parent: {
    start: {
      message: {
        adult: {
          en: (ctx) => `Hello ${ctx.userName || ''}. I'm Keba, the CCC club assistant. A few questions to guide you.`,
          ln: (ctx) => `Mbote ${ctx.userName || ''}. Nazali Keba, mosalisi ya club CCC. Mituna mike mpo na kotala yo.`,
          sw: (ctx) => `Habari ${ctx.userName || ''}. Mimi ni Keba, msaidizi wa klabu ya CCC. Maswali machache ili kukuongoza.`,
        },
      },
    },
    reason: {
      message: {
        adult: {
          en: () => 'What brings you here today?',
          ln: () => 'Nini ekomisi yo lelo?',
          sw: () => 'Nini imekuleta hapa leo?',
        },
      },
      choices: {
        child: {
          adult: {
            en: 'Enroll / accompany my child',
            ln: 'Kokóta / kokamba mwana na ngai',
            sw: 'Kumsajili / kumfuata mtoto wangu',
          },
        },
        learn: {
          adult: {
            en: 'Learn about technology myself',
            ln: 'Koyekola numérique moko',
            sw: 'Kujifunza teknolojia mwenyewe',
          },
        },
        visit: {
          adult: {
            en: 'Discover the club',
            ln: 'Koyeba club',
            sw: 'Kujua klabu',
          },
        },
      },
    },
    child_age: {
      message: {
        adult: {
          en: () => 'How old is your child?',
          ln: () => 'Mwana na bino azali na mbula boni?',
          sw: () => 'Mtoto wako ana umri gani?',
        },
      },
      choices: {
        young: {
          adult: {
            en: '6–9 years',
            ln: '6–9 ans',
            sw: 'Miaka 6–9',
          },
        },
        preteen: {
          adult: {
            en: '10–12 years',
            ln: '10–12 ans',
            sw: 'Miaka 10–12',
          },
        },
        teen: {
          adult: {
            en: '13–17 years',
            ln: '13–17 ans',
            sw: 'Miaka 13–17',
          },
        },
      },
    },
    child_interest: {
      message: {
        adult: {
          en: () => 'Does your child already show interest in technology or creative games?',
          ln: () => 'Mwana na bino azali déjà na esengo mpo na numérique to ba jeux créatifs?',
          sw: () => 'Je, mtoto wako anaonyesha hamu ya teknolojia au michezo ya ubunifu?',
        },
      },
      choices: {
        yes: {
          adult: {
            en: 'Yes, a lot',
            ln: 'Ee, mingi',
            sw: 'Ndiyo, sana',
          },
        },
        some: {
          adult: {
            en: 'A little',
            ln: 'Moke',
            sw: 'Kidogo',
          },
        },
        no: {
          adult: {
            en: 'Not yet',
            ln: 'Nanu te',
            sw: 'Bado hapana',
          },
        },
      },
    },
    family_cyber: {
      message: {
        adult: {
          en: () => 'Are you concerned about your family\'s online safety?',
          ln: () => 'Sécurité na Internet ya libota na bino esalisaka yo makanisi?',
          sw: () => 'Je, usalama wa mtandaoni wa familia yako unakuhangaisha?',
        },
      },
      choices: {
        yes: {
          adult: {
            en: 'Yes, it\'s a priority',
            ln: 'Ee, ezali priorité',
            sw: 'Ndiyo, ni kipaumbele',
          },
        },
        some: {
          adult: {
            en: 'A little',
            ln: 'Moke',
            sw: 'Kidogo',
          },
        },
        no: {
          adult: {
            en: 'Not especially',
            ln: 'Te mingi',
            sw: 'Si sana',
          },
        },
      },
    },
    self_goal: {
      message: {
        adult: {
          en: () => 'What would you like to learn first?',
          ln: () => 'Nini olingi koyekola liboso?',
          sw: () => 'Ungependa kujifunza nini kwanza?',
        },
      },
      choices: {
        support: {
          adult: {
            en: 'Help my child with technology',
            ln: 'Kosalisa mwana na ngai na numérique',
            sw: 'Kumsaidia mtoto wangu na teknolojia',
          },
        },
        basics: {
          adult: {
            en: 'Coding basics',
            ln: 'Ba bases ya kokóta',
            sw: 'Misingi ya kuandika programu',
          },
        },
        cyber: {
          adult: {
            en: 'Cybersecurity & privacy',
            ln: 'Cybersécurité & vie privée',
            sw: 'Usalama wa mtandaoni na faragha',
          },
        },
      },
    },
    visit_goal: {
      message: {
        adult: {
          en: () => 'Would you like a guided tour or to try an activity right away?',
          ln: () => 'Olingi visite guidée to komeka activité mbala moko?',
          sw: () => 'Ungependa ziara ya kuongozwa au kujaribu shughuli moja kwa moja?',
        },
      },
      choices: {
        tour: {
          adult: {
            en: 'Guided tour',
            ln: 'Visite guidée',
            sw: 'Ziara ya kuongozwa',
          },
        },
        trial: {
          adult: {
            en: 'Trial session',
            ln: 'Séance d\'essai',
            sw: 'Kipindi cha majaribio',
          },
        },
      },
    },
    parent_availability: {
      message: {
        adult: {
          en: () => 'What availability do you have for family sessions or parent workshops?',
          ln: () => 'Disponibilité nini bozali na yango mpo na ba sessions familles to ateliers parents?',
          sw: () => 'Una muda gani kwa vipindi vya familia au warsha za wazazi?',
        },
      },
    },
  },

  visiteur: {
    start: {
      message: {
        adult: {
          en: (ctx) => `Welcome ${ctx.userName || ''}! I'm Keba. Let's see together what the CCC can offer you.`,
          ln: (ctx) => `Boyei malamu ${ctx.userName || ''}! Nazali Keba. Tosala moko mpo na koyeba nini CCC ekoki kopesa bino.`,
          sw: (ctx) => `Karibu ${ctx.userName || ''}! Mimi ni Keba. Tuone pamoja CCC inaweza kukupa nini.`,
        },
      },
    },
    discovery: {
      message: {
        adult: {
          en: () => 'What interests you most about the world of code?',
          ln: () => 'Nini esalisaka yo esengo mingi na mokili ya code?',
          sw: () => 'Nini kinakuvutia zaidi kuhusu ulimwengu wa programu?',
        },
      },
      choices: {
        see: {
          adult: {
            en: 'See a live demo',
            ln: 'Kotala démo na solo',
            sw: 'Kuona onyesho la moja kwa moja',
          },
        },
        kids: {
          adult: {
            en: 'Youth programs',
            ln: 'Ba programmes mpo na bana',
            sw: 'Programu za vijana',
          },
        },
        tech: {
          adult: {
            en: 'Local tech & innovation',
            ln: 'Tech & innovation ya mboka',
            sw: 'Teknolojia na ubunifu wa ndani',
          },
        },
      },
    },
    background: {
      message: {
        adult: {
          en: () => 'Do you already have any programming experience?',
          ln: () => 'Bozali déjà na expérience na programmation?',
          sw: () => 'Je, una uzoefu wowote wa kuandika programu?',
        },
      },
      choices: {
        yes: {
          adult: {
            en: 'Yes, a little',
            ln: 'Ee, moke',
            sw: 'Ndiyo, kidogo',
          },
        },
        no: {
          adult: {
            en: 'No, pure curiosity',
            ln: 'Te, curiosité moko',
            sw: 'Hapana, udadisi tu',
          },
        },
      },
    },
    visitor_note: {
      message: {
        adult: {
          en: () => 'Is there anything else you\'d like to discover during your visit?',
          ln: () => 'Ezali na eloko mosusu olingi koyeba na ntango ya visite na bino?',
          sw: () => 'Kuna kitu kingine ungependa kujua wakati wa ziara yako?',
        },
      },
    },
  },
};

/**
 * Returns a translated message or null (null = use French default from graph).
 * @param {string} profileId
 * @param {string} nodeId
 * @param {string} tone
 * @param {string} lang
 * @param {object} ctx
 * @returns {string|null}
 */
export function getConvMessage(profileId, nodeId, tone, lang, ctx) {
  if (lang === 'fr') return null;
  if (!['en', 'ln', 'sw'].includes(lang)) return null;

  const entry = CONV[profileId]?.[nodeId]?.message?.[tone]?.[lang];
  if (entry == null) return null;

  return typeof entry === 'function' ? entry(ctx || {}) : entry;
}

/**
 * Returns a translated choice label or null (null = use French default from graph).
 * @param {string} profileId
 * @param {string} nodeId
 * @param {string} choiceId
 * @param {string} tone
 * @param {string} lang
 * @returns {string|null}
 */
export function getConvChoiceLabel(profileId, nodeId, choiceId, tone, lang) {
  if (lang === 'fr') return null;
  if (!['en', 'ln', 'sw'].includes(lang)) return null;

  return CONV[profileId]?.[nodeId]?.choices?.[choiceId]?.[tone]?.[lang] ?? null;
}
