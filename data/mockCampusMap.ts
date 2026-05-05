export interface CampusPoint {
  x: number;
  y: number;
}

export interface CampusLine {
  id: string;
  name: string;
  points: CampusPoint[];
}

export const mockCampusMap = {
  name: 'SMRU Campus',
  coordinateSystem: {
    width: 1000,
    height: 700,
    unit: 'campus-grid',
  },
  // GPS bounds for campus (SMRU campus approximate bounds)
  bounds: {
    minLat: 17.3665,
    maxLat: 17.3685,
    minLon: 78.4720,
    maxLon: 78.4750,
  },
  blocks: [
    { id: 'block-admin', name: 'Admin Block', point: { x: 180, y: 180 } },
    { id: 'block-academic', name: 'Academic Block', point: { x: 380, y: 240 } },
    { id: 'block-library', name: 'Library', point: { x: 520, y: 200 } },
    { id: 'block-hostel', name: 'Hostel Block', point: { x: 760, y: 430 } },
    { id: 'block-health', name: 'Health Sciences', point: { x: 600, y: 360 } },
    { id: 'block-innovation', name: 'Innovation Hub', point: { x: 470, y: 430 } },
  ],
  internalRoads: [
    { id: 'road-1', name: 'Main Gate To Admin', points: [{ x: 851, y: 153 }, { x: 797, y: 195 }, { x: 788, y: 205 }, { x: 779, y: 219 }, { x: 784, y: 231 }, { x: 791, y: 255 }, { x: 821, y: 288 }, { x: 832, y: 299 }, { x: 843, y: 313 }, { x: 856, y: 332 }, { x: 864, y: 347 }, { x: 868, y: 374 }, { x: 873, y: 396 }, { x: 878, y: 419 }, { x: 884, y: 436 }, { x: 889, y: 455 }, { x: 895, y: 467 }, { x: 905, y: 486 }, { x: 915, y: 501 }, { x: 926, y: 516 }, { x: 937, y: 524 }, { x: 960, y: 519 }, { x: 937, y: 524 }, { x: 926, y: 516 }, { x: 905, y: 486 }, { x: 889, y: 455 }, { x: 883, y: 436 }, { x: 873, y: 396 }, { x: 869, y: 373 }, { x: 864, y: 346 }, { x: 832, y: 298 }, { x: 791, y: 256 }, { x: 766, y: 253 }, { x: 747, y: 246 }, { x: 741, y: 248 }, { x: 727, y: 264 }, { x: 711, y: 282 }, { x: 682, y: 285 }, { x: 664, y: 287 }, { x: 614, y: 284 }, { x: 576, y: 278 }, { x: 569, y: 275 }, { x: 567, y: 234 }, { x: 567, y: 178 }, { x: 569, y: 69 }, { x: 539, y: 66 }, { x: 532, y: 69 }, { x: 530, y: 79 }, { x: 526, y: 266 }] },
    { id: 'road-2', name: 'Generator to University', points: [{ x: 569, y: 275 }, { x: 565, y: 389 }, { x: 563, y: 435 }, { x: 562, y: 458 }, { x: 519, y: 458 }, { x: 483, y: 455 }, { x: 453, y: 453 }, { x: 433, y: 453 }, { x: 422, y: 453 }, { x: 360, y: 410 }, { x: 340, y: 391 }, { x: 320, y: 361 }, { x: 307, y: 339 }, { x: 294, y: 311 }, { x: 282, y: 280 }, { x: 270, y: 255 }, { x: 268, y: 233 }, { x: 266, y: 170 }] },
    { id: 'road-3', name: 'University to Rehab', points: [{ x: 266, y: 170 }, { x: 268, y: 236 }, { x: 270, y: 255 }, { x: 288, y: 297 }, { x: 308, y: 338 }, { x: 329, y: 370 }, { x: 348, y: 397 }, { x: 373, y: 419 }, { x: 394, y: 431 }, { x: 415, y: 448 }, { x: 422, y: 453 }, { x: 419, y: 480 }, { x: 414, y: 529 }, { x: 411, y: 552 }, { x: 407, y: 578 }, { x: 401, y: 595 }, { x: 387, y: 596 }, { x: 377, y: 591 }, { x: 357, y: 579 }, { x: 341, y: 564 }, { x: 327, y: 553 }, { x: 312, y: 540 }, { x: 299, y: 526 }, { x: 289, y: 514 }, { x: 281, y: 506 }, { x: 273, y: 494 }, { x: 263, y: 487 }, { x: 240, y: 467 }, { x: 221, y: 453 }, { x: 212, y: 446 }, { x: 206, y: 443 }, { x: 188, y: 442 }, { x: 168, y: 441 }, { x: 155, y: 437 }] },
    { id: 'road-4', name: 'Rehab to Garden', points: [{ x: 155, y: 437 }, { x: 134, y: 430 }, { x: 116, y: 425 }, { x: 97, y: 417 }] },
    { id: 'road-5', name: 'Garden walking area', points: [{ x: 97, y: 417 }, { x: 79, y: 408 }, { x: 65, y: 399 }, { x: 48, y: 390 }, { x: 40, y: 387 }] },
    { id: 'road-6', name: 'Garden to Parking', points: [{ x: 40, y: 387 }, { x: 87, y: 412 }, { x: 88, y: 383 }, { x: 91, y: 362 }, { x: 94, y: 348 }, { x: 108, y: 342 }, { x: 126, y: 343 }, { x: 149, y: 345 }, { x: 153, y: 333 }, { x: 156, y: 320 }, { x: 180, y: 322 }, { x: 196, y: 327 }, { x: 217, y: 333 }, { x: 233, y: 333 }, { x: 250, y: 334 }, { x: 261, y: 332 }, { x: 268, y: 328 }, { x: 273, y: 340 }] },
  ] as CampusLine[],
  walkingPaths: [
    { id: 'walk-a', name: 'Academic Walkway', points: [{ x: 180, y: 220 }, { x: 520, y: 220 }] },
    { id: 'walk-b', name: 'Hostel Walkway', points: [{ x: 510, y: 260 }, { x: 760, y: 430 }] },
  ] as CampusLine[],
  cartRoutes: [
    { id: 'cart-loop', name: 'Campus Cart Loop', points: [{ x: 150, y: 160 }, { x: 390, y: 250 }, { x: 620, y: 350 }, { x: 780, y: 430 }] },
  ] as CampusLine[],
  cartStops: [
    { id: 'cart-1', name: 'Gate Cart Stop', point: { x: 170, y: 170 } },
    { id: 'cart-2', name: 'Academic Cart Stop', point: { x: 380, y: 245 } },
    { id: 'cart-3', name: 'Hostel Cart Stop', point: { x: 760, y: 430 } },
  ],
  parkingPoints: [
    { id: 'park-1', name: 'Visitor Parking', point: { x: 110, y: 300 } },
    { id: 'park-2', name: 'Faculty Parking', point: { x: 830, y: 500 } },
  ],
  dropPoints: [
    { id: 'drop-1', name: 'Main Gate Drop', point: { x: 130, y: 155 } },
    { id: 'drop-2', name: 'Academic Drop', point: { x: 350, y: 230 } },
  ],
  stopMarkers: [
    { id: 'stop-canteen', name: 'Canteen', point: { x: 694, y: 120 } },
    { id: 'stop-parking', name: 'Parking', point: { x: 871, y: 185 } },
    { id: 'stop-bike-rentals', name: 'Bike Rentals', point: { x: 666, y: 234 } },
    { id: 'stop-globe', name: 'Globe', point: { x: 779, y: 219 } },
    { id: 'stop-a2-block', name: 'A2 Block', point: { x: 852, y: 371 } },
    { id: 'stop-a1-block', name: 'A1 Block', point: { x: 948, y: 522 } },
    { id: 'stop-main-gate', name: 'Main Gate', point: { x: 851, y: 153 } },
    { id: 'stop-t-junction-main-block-admin-sports-complex', name: 'T Junction - Main block - Admin - Sports Complex', point: { x: 569, y: 275 } },
    { id: 'stop-sports-complex', name: 'Sports Complex', point: { x: 618, y: 233 } },
    { id: 'stop-mini-sports-arena', name: 'Mini Sports Arena', point: { x: 587, y: 434 } },
    { id: 'stop-atm', name: 'ATm', point: { x: 551, y: 107 } },
    { id: 'stop-university-parking', name: 'University Parking', point: { x: 291, y: 357 } },
    { id: 'stop-central-library', name: 'Central Library', point: { x: 520, y: 180 } },
    { id: 'stop-university', name: 'University', point: { x: 266, y: 170 } },
    { id: 'stop-admission-room', name: 'Admission Room', point: { x: 247, y: 297 } },
    { id: 'stop-mba-law', name: 'MBA - Law', point: { x: 450, y: 40 } },
    { id: 'stop-saraswathi', name: 'Saraswathi', point: { x: 406, y: 404 } },
    { id: 'stop-boys-hostel', name: 'Boys Hostel', point: { x: 370, y: 660 } },
    { id: 'stop-rehab-hospital', name: 'Rehab - Hospital', point: { x: 131, y: 480 } },
    { id: 'stop-swiming-pool', name: 'Swiming Pool', point: { x: 49, y: 425 } },
    { id: 'stop-garden', name: 'Garden', point: { x: 64, y: 353 } },
    { id: 'stop-rehab-school', name: 'Rehab - School', point: { x: 203, y: 522 } },
    { id: 'stop-cricket-ground', name: 'Cricket Ground', point: { x: 549, y: 538 } },
  ],
};
