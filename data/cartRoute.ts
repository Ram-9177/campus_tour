// Static cart route with stops
// Future: This data will be replaced with live cart tracking from backend

export interface CartStop {
  id: string;
  name: {
    en: string;
    te: string;
    hi: string;
  };
  locationId: string; // Links to campusLocations
  description: {
    en: string;
    te: string;
    hi: string;
  };
  waitTimeMinutes: number;
  order: number;
}

export const cartRoute: CartStop[] = [
  {
    id: 'cart-stop-1',
    name: {
      en: 'Main Gate (Start)',
      te: 'ప్రధాన గేట్ (ప్రారంభం)',
      hi: 'मुख्य गेट (शुरुआत)',
    },
    locationId: 'loc-main-gate',
    description: {
      en: 'Board the campus cart at the main gate entrance.',
      te: 'ప్రధాన గేట్ ప్రవేశ ద్వారం వద్ద క్యాంపస్ కార్ట్‌కు ఎక్కండి.',
      hi: 'मुख्य गेट के प्रवेश द्वार पर कैंपस कार्ट में चढ़ें।',
    },
    waitTimeMinutes: 0,
    order: 1,
  },
  {
    id: 'cart-stop-2',
    name: {
      en: 'Central Library',
      te: 'సెంట్రల్ లైబ్రరీ',
      hi: 'केंद्रीय पुस्तकालय',
    },
    locationId: 'loc-central-library',
    description: {
      en: 'Visit the main campus library and study resources.',
      te: 'ప్రధాన ఆల్మా మేటర్ లైబ్రరీ మరియు అధ్యయన సంప్రదాయాలను సందర్శించండి.',
      hi: 'मुख्य कैंपस पुस्तकालय और अध्ययन संसाधनों का दौरा करें।',
    },
    waitTimeMinutes: 5,
    order: 2,
  },
  {
    id: 'cart-stop-3',
    name: {
      en: 'Canteen',
      te: 'కాంటీన్',
      hi: 'कैंटीन',
    },
    locationId: 'loc-canteen',
    description: {
      en: 'Refreshment stop with dining facilities.',
      te: 'భోజన సౌకర్యాలతో కూడిన రిఫ్రెష్‌మెంట్ స్టాప్.',
      hi: 'भोजन सुविधाओं के साथ रिफ्रेशमेंट स्टॉप।',
    },
    waitTimeMinutes: 8,
    order: 3,
  },
  {
    id: 'cart-stop-4',
    name: {
      en: 'Sports Complex',
      te: 'స్పోర్ట్స్ కాంప్లెక్స్',
      hi: 'स्पोर्ट्स कॉम्प्लेक्स',
    },
    locationId: 'loc-sports-complex',
    description: {
      en: 'Campus sports facilities and recreation areas.',
      te: 'క్యాంపస్ క్రీడల సౌకర్యాలు మరియు విनోద ప్రాంతాలు.',
      hi: 'कैंपस क्रीड़ा सुविधाएं और मनोरंजन क्षेत्र।',
    },
    waitTimeMinutes: 6,
    order: 4,
  },
  {
    id: 'cart-stop-5',
    name: {
      en: 'Admin Block',
      te: 'అడ్మిన్ బ్లాక్',
      hi: 'प्रशासन ब्लॉक',
    },
    locationId: 'loc-admin-block',
    description: {
      en: 'Administrative center for campus operations.',
      te: 'క్యాంపస్ కార్యకలాపాల కోసం పరిపాలనా కేంద్రం.',
      hi: 'कैंपस संचालन के लिए प्रशासनिक केंद्र।',
    },
    waitTimeMinutes: 4,
    order: 5,
  },
  {
    id: 'cart-stop-6',
    name: {
      en: 'Parking Area',
      te: 'పార్కింగ్ ఎరియా',
      hi: 'पार्किंग क्षेत्र',
    },
    locationId: 'loc-parking',
    description: {
      en: 'Vehicle parking and transport hub.',
      te: 'వాహన పార్కింగ్ మరియు రవాణా కేంద్రం.',
      hi: 'वाहन पार्किंग और परिवहन केंद्र।',
    },
    waitTimeMinutes: 3,
    order: 6,
  },
  {
    id: 'cart-stop-7',
    name: {
      en: 'Garden Area',
      te: 'గార్డెన్ ఎరియా',
      hi: 'बागान क्षेत्र',
    },
    locationId: 'loc-garden',
    description: {
      en: 'Peaceful outdoor garden and walking paths.',
      te: 'శాంతమైన బాహ్య తోట మరియు నడక పందిరి.',
      hi: 'शांतिपूर्ण बाहरी बागान और चलने के रास्ते।',
    },
    waitTimeMinutes: 5,
    order: 7,
  },
  {
    id: 'cart-stop-8',
    name: {
      en: 'Main Gate (End)',
      te: 'ప్రధాన గేట్ (ముగింపు)',
      hi: 'मुख्य गेट (अंत)',
    },
    locationId: 'loc-main-gate',
    description: {
      en: 'Complete tour loop and exit at main gate.',
      te: 'టూర్ లూప్‌ను పూర్తి చేసి ప్రధాన గేట్ వద్ద నిష్క్రమించండి.',
      hi: 'टूर लूप को पूरा करें और मुख्य गेट पर निकलें।',
    },
    waitTimeMinutes: 0,
    order: 8,
  },
];
