// ======================================================================
// TRANSLATIONS – FR & EN
// ======================================================================

export type Locale = 'fr' | 'en';

export interface Translations {
  nav: {
    accueil: string;
    mission: string;
    activites: string;
    camps: string;
    galerie: string;
    contact: string;
  };
  hero: {
    llbSubtitle: string;
    description: string;
    btnMission: string;
    btnJoin: string;
  };
  about: {
    overline: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    cards: { label: string; desc: string }[];
  };
  mission: {
    overline: string;
    title: string;
    description: string;
    cards: { title: string; description: string }[];
    bibleVerse: string;
    bibleRef: string;
  };
  activities: {
    overline: string;
    title: string;
    spiritualTitle: string;
    sportTitle: string;
    spiritual: { title: string; description: string }[];
    sport: { title: string; description: string }[];
  };
  camps: {
    overline: string;
    title: string;
    description: string;
    items: { title: string; description: string; highlights: string[] }[];
  };
  gallery: {
    overline: string;
    title: string;
    description: string;
    imageAlts: string[];
  };
  contact: {
    overline: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    addressValue: string;
    formTitle: string;
    formName: string;
    formFirstName: string;
    formEmail: string;
    formSubject: string;
    formMessage: string;
    formSubmit: string;
    mapPopupName: string;
    mapPopupOrg: string;
    mapPopupCity: string;
  };
  footer: {
    orgName: string;
    orgSub: string;
    bibleVerse: string;
    bibleRef: string;
    copyright: string;
  };
  donation: {
    modalTitle: string;
    modalDescription: string;
    whyTitle: string;
    whyReasons: string[];
    howTitle: string;
    howDescription: string;
    mvolaLabel: string;
    accountName: string;
    stepsTitle: string;
    steps: string[];
    bibleVerse: string;
    bibleRef: string;
    thankYou: string;
  };
}

// ======================================================================
// FRENCH
// ======================================================================

const fr: Translations = {
  nav: {
    accueil: 'Accueil',
    mission: 'Mission',
    activites: 'Activités',
    camps: 'Camps',
    galerie: 'Galerie',
    contact: 'Contact',
  },
  hero: {
    llbSubtitle: 'Ligue pour la Lecture de la Bible',
    description:
      'Tanora A – Département de la Ligue pour la Lecture de la Bible. Grandir dans la foi, partager l\'Évangile et vivre l\'Évangile ensemble.',
    btnMission: 'Découvrir notre mission',
    btnJoin: 'Nous rejoindre',
  },
  about: {
    overline: 'Qui sommes-nous ?',
    title: 'Un club au service de la jeunesse chrétienne',
    paragraph1:
      'Tanora A LLB est le département jeunesse de la Ligue pour la Lecture de la Bible. Notre vocation : rassembler les jeunes autour de la Parole de Dieu, les accompagner dans leur croissance spirituelle et leur offrir un cadre épanouissant alliant foi, fraternité et activités enrichissantes.',
    paragraph2:
      'Que ce soit à travers nos rencontres spirituelles, nos activités sportives ou nos camps d\'édification, nous croyons que chaque jeune est appelé à vivre pleinement sa foi et à impacter sa génération pour Christ.',
    cards: [
      { label: 'Fondé sur la Parole de Dieu', desc: 'La Bible est au cœur de toutes nos activités et enseignements.' },
      { label: 'Une communauté vivante', desc: 'Des centaines de jeunes unis par la même passion pour Christ.' },
      { label: 'Activités variées', desc: 'Spirituel, sportif, culturel : un programme riche pour chaque jeune.' },
    ],
  },
  mission: {
    overline: 'Notre mission & vision',
    title: 'Apporter l\'Évangile aux jeunes, grandir ensemble dans la foi',
    description:
      'Notre vision est de voir chaque jeune touché par l\'amour de Dieu, enraciné dans Sa Parole et engagé au service de Son Royaume. Nous croyons en une jeunesse transformée et transformatrice.',
    cards: [
      {
        title: 'Évangélisation',
        description:
          'Apporter la Bonne Nouvelle de Jésus-Christ aux jeunes, leur montrer l\'amour de Dieu et les accompagner dans leur cheminement de foi.',
      },
      {
        title: 'Édification spirituelle',
        description:
          'Aider chaque jeune à grandir dans sa relation avec Dieu à travers l\'étude de la Bible, la prière et la communion fraternelle.',
      },
      {
        title: 'Communion fraternelle',
        description:
          'Créer une communauté soudée où les jeunes se soutiennent mutuellement, partagent et grandissent ensemble dans l\'amour du Christ.',
      },
      {
        title: 'Service & engagement',
        description:
          'Encourager les jeunes à servir dans l\'église et la société, en étant des témoins vivants de la transformation par l\'Évangile.',
      },
    ],
    bibleVerse:
      '«\u00A0Que personne ne méprise ta jeunesse ; mais sois un modèle pour les fidèles, en parole, en conduite, en amour, en foi, en pureté.\u00A0»',
    bibleRef: '— 1 Timothée 4:12',
  },
  activities: {
    overline: 'Nos activités',
    title: 'Spirituel & sportif, un équilibre pour les jeunes',
    spiritualTitle: 'Activités spirituelles',
    sportTitle: 'Activités sportives',
    spiritual: [
      {
        title: 'Rencontres hebdomadaires',
        description: 'Chaque semaine, nous nous retrouvons pour des moments de louange, de prière et d\'étude biblique.',
      },
      {
        title: 'Enseignements bibliques',
        description: 'Des enseignements profonds et adaptés aux jeunes pour mieux comprendre la Parole de Dieu.',
      },
      {
        title: 'Veillées de prière',
        description: 'Des temps forts de prière collective pour intercéder et chercher la face de Dieu ensemble.',
      },
    ],
    sport: [
      {
        title: 'Football',
        description:
          'Des entraînements réguliers et des matchs amicaux pour développer l\'esprit d\'équipe et la discipline dans un cadre fraternel.',
      },
      {
        title: 'Basketball',
        description:
          'Sessions de basketball ouvertes à tous niveaux, favorisant la cohésion et le dépassement de soi entre jeunes du club.',
      },
    ],
  },
  camps: {
    overline: 'Nos camps',
    title: 'Des moments inoubliables d\'édification',
    description:
      'Nos camps sont des temps forts où les jeunes vivent une expérience unique de croissance spirituelle, de fraternité et de joie dans un cadre exceptionnel.',
    items: [
      {
        title: 'Camp d\'édification spirituelle',
        description:
          'Plusieurs jours d\'immersion spirituelle : enseignements approfondis, ateliers pratiques, temps de louange et de prière dans un cadre inspirant.',
        highlights: ['Enseignements thématiques', 'Ateliers pratiques', 'Louange & adoration', 'Communion fraternelle'],
      },
      {
        title: 'Camp sportif & récréatif',
        description:
          'Allier sport, jeux et moments spirituels. Un camp dynamique qui forge les amitiés et renforce le corps et l\'esprit.',
        highlights: ['Tournois de foot & basket', 'Jeux d\'équipe', 'Randonnées', 'Feux de camp & témoignages'],
      },
      {
        title: 'Retraite spirituelle',
        description:
          'Un temps de pause pour se rapprocher de Dieu, loin du bruit quotidien. Méditation, jeûne et prière dans un lieu paisible.',
        highlights: ['Méditation biblique', 'Temps de silence', 'Prière personnelle', 'Partages en petits groupes'],
      },
    ],
  },
  gallery: {
    overline: 'Galerie photos',
    title: 'Nos moments forts en images',
    description: 'Revivez les temps forts de notre communauté : louanges, camps, matchs et moments de partage.',
    imageAlts: [
      'Louange et adoration',
      'Communion fraternelle',
      'Football entre jeunes',
      'Basketball',
      'Étude biblique',
      'Camp de jeunes',
      'Groupe de jeunes',
      'Nature - retraite',
    ],
  },
  contact: {
    overline: 'Contact',
    title: 'Rejoignez-nous !',
    description:
      'Vous souhaitez en savoir plus sur Tanora A LLB, participer à nos activités ou simplement nous dire bonjour ? N\'hésitez pas à nous contacter !',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    addressValue: 'Antananarivo, Madagascar',
    formTitle: 'Envoyez-nous un message',
    formName: 'Nom',
    formFirstName: 'Prénom',
    formEmail: 'Email',
    formSubject: 'Sujet',
    formMessage: 'Message',
    formSubmit: 'Envoyer le message',
    mapPopupName: 'Tanora A LLB',
    mapPopupOrg: 'Ligue pour la Lecture de la Bible',
    mapPopupCity: 'Antananarivo, Madagascar',
  },
  footer: {
    orgName: 'Ligue pour la Lecture de la Bible',
    orgSub: 'Tanora A — Ministère auprès des jeunes',
    bibleVerse: '«\u00A0Ta parole est une lampe à mes pieds, et une lumière sur mon sentier\u00A0»',
    bibleRef: 'Psaumes 119:105',
    copyright: 'Tanora A LLB. Tous droits réservés.',
  },
  donation: {
    modalTitle: 'Faire un don',
    modalDescription:
      'Votre générosité permet à Tanora A LLB de continuer à apporter l\'Évangile aux jeunes, organiser des camps d\'édification et soutenir nos activités spirituelles et sportives.',
    whyTitle: 'Pourquoi on en a besoin ?',
    whyReasons: [
      'Soutenir les enseignements bibliques et les rencontres de jeunes',
      'Financer l\'organisation de camps d\'édification spirituelle',
      'Contribuer aux activités sportives (football, basketball)',
      'Permettre l\'achat de matériel et de supports pédagogiques',
    ],
    howTitle: 'Comment procéder ?',
    howDescription:
      'Envoyez votre don via MVola (Telma Mobile Money) au numéro ci-dessous. Chaque contribution, quelle que soit sa taille, fait une réelle différence.',
    mvolaLabel: 'MVola – Mobile Money',
    accountName: 'Nom du compte :',
    stepsTitle: 'Étapes pour envoyer via MVola :',
    steps: [
      'Composez le #111# sur votre téléphone Telma',
      'Choisissez « Envoi d\'argent »',
      'Entrez le numéro :',
      'Saisissez le montant de votre don',
      'Confirmez avec votre code PIN MVola',
    ],
    bibleVerse:
      '«\u00A0Chacun donne comme il l\'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie.\u00A0»',
    bibleRef: '2 Corinthiens 9:7',
    thankYou: 'Merci pour votre soutien 🙏',
  },
};

// ======================================================================
// ENGLISH
// ======================================================================

const en: Translations = {
  nav: {
    accueil: 'Home',
    mission: 'Mission',
    activites: 'Activities',
    camps: 'Camps',
    galerie: 'Gallery',
    contact: 'Contact',
  },
  hero: {
    llbSubtitle: 'Scripture Union',
    description:
      'Tanora A – Youth department of the Scripture union. Growing in faith, sharing the Gospel and living it together.',
    btnMission: 'Discover our mission',
    btnJoin: 'Join us',
  },
  about: {
    overline: 'Who are we?',
    title: 'A club dedicated to Christian youth',
    paragraph1:
      'Tanora A LLB is the youth department of the Scripture union. Our calling: to gather young people around the Word of God, support them in their spiritual growth, and provide an enriching environment combining faith, fellowship and activities.',
    paragraph2:
      'Whether through our spiritual gatherings, sports activities or edification camps, we believe every young person is called to live out their faith fully and impact their generation for Christ.',
    cards: [
      { label: 'Founded on the Word of God', desc: 'The Bible is at the heart of all our activities and teachings.' },
      { label: 'A living community', desc: 'Hundreds of young people united by the same passion for Christ.' },
      { label: 'Diverse activities', desc: 'Spiritual, sports, cultural: a rich program for every young person.' },
    ],
  },
  mission: {
    overline: 'Our mission & vision',
    title: 'Bringing the Gospel to youth, growing together in faith',
    description:
      'Our vision is to see every young person touched by the love of God, rooted in His Word and committed to serving His Kingdom. We believe in a transformed and transformative youth.',
    cards: [
      {
        title: 'Evangelism',
        description:
          'Bringing the Good News of Jesus Christ to young people, showing them the love of God and walking alongside them on their faith journey.',
      },
      {
        title: 'Spiritual edification',
        description:
          'Helping every young person grow in their relationship with God through Bible study, prayer and fellowship.',
      },
      {
        title: 'Fellowship',
        description:
          'Creating a close-knit community where young people support one another, share and grow together in the love of Christ.',
      },
      {
        title: 'Service & commitment',
        description:
          'Encouraging young people to serve in the church and society, being living witnesses of transformation through the Gospel.',
      },
    ],
    bibleVerse:
      '"Let no one despise your youth, but set the believers an example in speech, in conduct, in love, in faith, in purity."',
    bibleRef: '— 1 Timothy 4:12',
  },
  activities: {
    overline: 'Our activities',
    title: 'Spiritual & sports, a balance for youth',
    spiritualTitle: 'Spiritual activities',
    sportTitle: 'Sports activities',
    spiritual: [
      {
        title: 'Weekly gatherings',
        description: 'Every week, we come together for times of worship, prayer and Bible study.',
      },
      {
        title: 'Bible teachings',
        description: 'In-depth teachings adapted for young people to better understand the Word of God.',
      },
      {
        title: 'Prayer vigils',
        description: 'Powerful times of collective prayer to intercede and seek the face of God together.',
      },
    ],
    sport: [
      {
        title: 'Football',
        description:
          'Regular training sessions and friendly matches to develop teamwork and discipline in a brotherly atmosphere.',
      },
      {
        title: 'Basketball',
        description:
          'Basketball sessions open to all levels, fostering cohesion and personal growth among the club\'s youth.',
      },
    ],
  },
  camps: {
    overline: 'Our camps',
    title: 'Unforgettable moments of edification',
    description:
      'Our camps are highlights where young people experience a unique journey of spiritual growth, fellowship and joy in an exceptional setting.',
    items: [
      {
        title: 'Spiritual edification camp',
        description:
          'Several days of spiritual immersion: in-depth teachings, practical workshops, worship and prayer in an inspiring setting.',
        highlights: ['Thematic teachings', 'Practical workshops', 'Worship & praise', 'Fellowship'],
      },
      {
        title: 'Sports & recreation camp',
        description:
          'Combining sports, games and spiritual moments. A dynamic camp that builds friendships and strengthens body and spirit.',
        highlights: ['Football & basketball tournaments', 'Team games', 'Hiking', 'Campfire & testimonies'],
      },
      {
        title: 'Spiritual retreat',
        description:
          'A time to draw closer to God, away from daily noise. Meditation, fasting and prayer in a peaceful place.',
        highlights: ['Bible meditation', 'Quiet time', 'Personal prayer', 'Small group sharing'],
      },
    ],
  },
  gallery: {
    overline: 'Photo gallery',
    title: 'Our highlights in pictures',
    description: 'Relive the highlights of our community: worship, camps, games and moments of fellowship.',
    imageAlts: [
      'Worship and praise',
      'Fellowship',
      'Football among youth',
      'Basketball',
      'Bible study',
      'Youth camp',
      'Youth group',
      'Nature - retreat',
    ],
  },
  contact: {
    overline: 'Contact',
    title: 'Join us!',
    description:
      'Want to learn more about Tanora A LLB, join our activities or simply say hello? Don\'t hesitate to reach out!',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    addressValue: 'Antananarivo, Madagascar',
    formTitle: 'Send us a message',
    formName: 'Last name',
    formFirstName: 'First name',
    formEmail: 'Email',
    formSubject: 'Subject',
    formMessage: 'Message',
    formSubmit: 'Send message',
    mapPopupName: 'Tanora A LLB',
    mapPopupOrg: 'Scripture union',
    mapPopupCity: 'Antananarivo, Madagascar',
  },
  footer: {
    orgName: 'Scripture union',
    orgSub: 'Tanora A — Youth ministry',
    bibleVerse: '"Your word is a lamp to my feet, and a light to my path"',
    bibleRef: 'Psalm 119:105',
    copyright: 'Tanora A LLB. All rights reserved.',
  },
  donation: {
    modalTitle: 'Make a donation',
    modalDescription:
      'Your generosity enables Tanora A LLB to continue bringing the Gospel to youth, organizing edification camps and supporting our spiritual and sports activities.',
    whyTitle: 'Why we need your help?',
    whyReasons: [
      'Support Bible teachings and youth gatherings',
      'Fund the organization of spiritual edification camps',
      'Contribute to sports activities (football, basketball)',
      'Enable the purchase of educational and sports equipment',
    ],
    howTitle: 'How to proceed?',
    howDescription:
      'Send your donation via MVola (Telma Mobile Money) to the number below. Every contribution, no matter the size, makes a real difference.',
    mvolaLabel: 'MVola – Mobile Money',
    accountName: 'Account name:',
    stepsTitle: 'Steps to send via MVola:',
    steps: [
      'Dial #111# on your Telma phone',
      'Choose "Send money"',
      'Enter the number:',
      'Enter the amount of your donation',
      'Confirm with your MVola PIN code',
    ],
    bibleVerse:
      '"Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver."',
    bibleRef: '2 Corinthians 9:7',
    thankYou: 'Thank you for your support 🙏',
  },
};

// ======================================================================
// EXPORT
// ======================================================================

export const translations: Record<Locale, Translations> = { fr, en };
