import type { CampusLocation } from '@/types/campusLocation';
import type { MapPoint } from '@/types/mapData';

function getCategoryAndRadius(id: string): { category: string; radiusMeters: number } {
  const isLargeBuilding = ['block', 'hospital', 'university', 'library', 'school', 'hostel', 'admission', 'law', 'saraswathi'].some(k => id.includes(k));
  const isFacility = ['sports', 'ground', 'pool', 'canteen', 'garden', 'parking', 'rehab', 'globe', 'arena'].some(k => id.includes(k));
  const isGate = id.includes('gate');
  
  if (isGate) return { category: 'entry', radiusMeters: 35 };
  if (isLargeBuilding) return { category: 'academic', radiusMeters: 30 };
  if (isFacility) return { category: 'facility', radiusMeters: 20 };
  
  // default small points
  return { category: 'utility', radiusMeters: 15 };
}

export function mapCampusLocations(points: MapPoint[]): CampusLocation[] {
  return points.map((point, index) => {
    const { category, radiusMeters } = getCategoryAndRadius(point.id);
    const nameStr = point.name || point.id;
    
    return {
      id: `loc-${point.id}`,
      slug: point.id,
      name: {
        en: nameStr,
        te: nameStr,
        hi: nameStr
      },
      category,
      latitude: point.latitude ?? 0,
      longitude: point.longitude ?? 0,
      mapPointId: point.id,
      x: point.x,
      y: point.y,
      radiusMeters,
      description: {
        en: `Welcome to ${nameStr}. This area is dedicated to fostering growth, learning, and community engagement.`,
        te: `${nameStr} కు స్వాగతం. ఈ ప్రాంతం అభ్యాసం మరియు కమ్యూనిటీ నిమగ్నతను పెంపొందించడానికి అంకితం చేయబడింది.`,
        hi: `${nameStr} में आपका स्वागत है। यह क्षेत्र सीखने और सामुदायिक जुड़ाव को बढ़ावा देने के लिए समर्पित है।`
      },
      script: {
        en: `You have arrived at ${nameStr}. Here, you can experience our supportive campus environment designed to empower our community.`,
        te: `మీరు ${nameStr} చేరుకున్నారు. కమ్యూనిటీని శక్తివంతం చేయడానికి రూపొందించబడిన మా క్యాంపస్ వాతావరణాన్ని మీరు ఇక్కడ అనుభవించవచ్చు.`,
        hi: `आप ${nameStr} पर पहुँच गए हैं। यहाँ, आप हमारे समुदाय को सशक्त बनाने के लिए डिज़ाइन किए गए हमारे सहायक परिसर के माहौल का अनुभव कर सकते हैं।`
      },
      audio: {
        en: `/audio/locations/${point.id}-en.mp3`,
        te: `/audio/locations/${point.id}-te.mp3`,
        hi: `/audio/locations/${point.id}-hi.mp3`
      },
      images: [
        '/images/virtual/campus-view-1.svg',
        '/images/virtual/campus-view-2.svg',
        '/images/virtual/campus-view-3.svg',
        '/images/location-fallback.svg',
      ],
      videos: ['/videos/campus-tour.mp4'],
      routeOrder: index + 1,
      recommendedFor: ['student', 'parent', 'consultant', 'other'],
      active: true
    };
  });
}
