/**
 * Hanwha Eagles Daejeon Game Day Travel Guide - Application Logic
 * Full bilingual support (KR/EN), Leaflet Map, Planner Drawer, Filters & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    lang: 'ko', // 'ko' or 'en'
    currentFoodCategory: 'all',
    currentAttractionFilter: 'all',
    currentMapCategory: 'all',
    currentTimePlan: '1hr',
    currentRadius: '5min',
    searchQuery: '',
    plannerItems: JSON.parse(localStorage.getItem('eagles_planner_items') || '[]'),
    map: null,
    markers: [],
    radiusCircles: []
  };

  // Internationalization Dictionary
  const i18n = {
    ko: {
      nav_tagline: "한화생명 이글스파크 & 대전 로컬 가이드",
      nav_time: "시간별 코스",
      nav_restaurants: "맛집 탐방",
      nav_cafes: "카페 & 디저트",
      nav_attractions: "추천 명소",
      nav_transport: "교통 안내",
      nav_itineraries: "추천 일정",
      nav_map: "경기장 지도",
      nav_radius: "구장 반경",
      nav_cheer_guide: "⚾ 이글스 직관 꿀팁",
      btn_cheer: "최강한화!",
      btn_my_plan: "나의 직관 일정",
      hero_title_1: "CHEER FOR THE EAGLES,",
      hero_title_2: "DISCOVER DAEJEON!",
      hero_subtitle: "야구 직관의 설렘과 대전의 맛, 멋, 낭만을 하루 만에 완벽하게 즐기는 원데이 로컬 가이드.",
      btn_explore_daejeon: "EXPLORE DAEJEON",
      btn_plan_gameday: "PLAN MY GAME DAY",
      match_stadium: "경기 장소",
      match_starter: "선발 투수",
      match_weather: "날씨 예보",
      match_gates: "관중 입장",
      quick_nav_badge: "QUICK CATEGORIES",
      quick_nav_heading: "원하는 테마로 빠르게 찾아보세요",
      quick_nav_sub: "야구 관람 전후 어디를 갈지 한눈에 쉽게 확인하세요.",
      time_badge: "시간 맞춤 추천",
      time_heading: "HOW MUCH TIME DO YOU HAVE?",
      time_sub: "보유한 시간에 맞춰 최적의 동선과 맛집, 카페, 구장 도착 스케줄을 제공합니다.",
      food_badge: "대전 로컬 미식 탐방",
      food_heading: "EAT LIKE A LOCAL",
      food_sub: "칼국수의 도시 대전! 칼칼한 오징어/두부 두루치기부터 참숯 한우갈비, 경기장 치맥까지 엄선한 필수 맛집.",
      cafe_badge: "빵지순례 & 디저트 살롱",
      cafe_heading: "COFFEE, DESSERT & A LITTLE BREAK",
      cafe_sub: "대한민국 빵의 성지 성심당 본점부터, 대흥동 감성 한옥 카페, 숲속 리조트 카페까지 달콤한 휴식을 즐기세요.",
      spot_badge: "짧은 여행, 깊은 추억",
      spot_heading: "SHORT TRIPS, BIG MEMORIES",
      spot_sub: "경기 전후 1~2시간으로 충분히 다녀올 수 있는 대전의 핵심 명소들입니다.",
      transport_badge: "초고속 이동 안내",
      transport_heading: "DAEJEON STATION ⇄ EAGLES PARK",
      transport_sub: "KTX/SRT 대전역에서 한화생명 이글스파크까지 가장 빠르고 편리하게 이동하는 방법.",
      btn_get_directions: "GET DIRECTIONS",
      itinerary_badge: "원데이 추천 풀코스",
      itinerary_heading: "YOUR PERFECT EAGLES GAME DAY",
      itinerary_sub: "방문 스타일에 맞게 선택하는 4가지 원스톱 풀코스 타임라인.",
      map_badge: "경기장 중심 인터랙티브 맵",
      map_heading: "HANWHA LIFE EAGLES PARK MAP",
      map_sub: "이글스파크 중심 맛집, 카페, 명소, 굿즈샵, 주차장 위치를 실시간으로 탐색하세요.",
      radius_badge: "거리 반경 탐색기",
      radius_heading: "WHAT'S AROUND EAGLES PARK?",
      radius_sub: "야구장 게이트를 기준으로 5분, 10분, 15분, 20분 거리 내에 무엇이 있는지 즉시 확인하세요.",
      cta_heading: "MAKE YOUR EAGLES GAME DAY\nA DAY TO REMEMBER.",
      cta_sub: "Good food. Great places. An unforgettable game.",
      btn_find_restaurant: "FIND A RESTAURANT",
      btn_explore_daejeon_cta: "EXPLORE DAEJEON",
      btn_plan_gameday_cta: "PLAN MY GAME DAY",
      view_details: "상세보기",
      get_directions: "길찾기",
      add_to_plan: "+ 담기",
      added_to_plan: "✓ 담김",
      distance_from_park: "구장 거리",
      approx_price: "가격대",
      open_hours: "영업시간",
      recommended_tag: "추천 대상"
    },
    en: {
      nav_tagline: "Hanwha Life Eagles Park & Daejeon Guide",
      nav_time: "Time Plans",
      nav_restaurants: "Restaurants",
      nav_cafes: "Cafes & Bakery",
      nav_attractions: "Attractions",
      nav_transport: "Transit",
      nav_itineraries: "Itineraries",
      nav_map: "Stadium Map",
      nav_radius: "Radius Explorer",
      nav_cheer_guide: "⚾ Stadium Tips",
      btn_cheer: "GO EAGLES!",
      btn_my_plan: "My Game Day Plan",
      hero_title_1: "CHEER FOR THE EAGLES,",
      hero_title_2: "DISCOVER DAEJEON!",
      hero_subtitle: "Your perfect Daejeon day before and after the baseball game with incredible local food, bakeries, and sights.",
      btn_explore_daejeon: "EXPLORE DAEJEON",
      btn_plan_gameday: "PLAN MY GAME DAY",
      match_stadium: "VENUE",
      match_starter: "HOME STARTER",
      match_weather: "WEATHER",
      match_gates: "GATES OPEN",
      quick_nav_badge: "QUICK CATEGORIES",
      quick_nav_heading: "DISCOVER BY THEME",
      quick_nav_sub: "Find great places to visit before and after the game in seconds.",
      time_badge: "TIME-BASED RECOMMENDATIONS",
      time_heading: "HOW MUCH TIME DO YOU HAVE?",
      time_sub: "Get custom schedules crafted for your exact available hours.",
      food_badge: "DAEJEON LOCAL GASTRONOMY",
      food_heading: "EAT LIKE A LOCAL",
      food_sub: "Legendary spicy squid duruchigi, rich kalguksu noodles, charcoal Hanwoo BBQ, and crispy stadium chicken.",
      cafe_badge: "BAKERY & DESSERT PILGRIMAGE",
      cafe_heading: "COFFEE, DESSERT & A LITTLE BREAK",
      cafe_sub: "From the legendary Sung Sim Dang bakery to aesthetic hanok cafes and lush forest sanctuaries.",
      spot_badge: "SHORT TRIPS, BIG MEMORIES",
      spot_heading: "SHORT TRIPS, BIG MEMORIES",
      spot_sub: "Must-visit Daejeon landmarks reachable within 1-2 hours around your game.",
      transport_badge: "EXPRESS MOBILITY GUIDE",
      transport_heading: "DAEJEON STATION ⇄ EAGLES PARK",
      transport_sub: "The fastest, most convenient ways to travel between KTX Daejeon Station and Hanwha Life Eagles Park.",
      btn_get_directions: "GET DIRECTIONS",
      itinerary_badge: "CURATED ONE-DAY SCHEDULES",
      itinerary_heading: "YOUR PERFECT EAGLES GAME DAY",
      itinerary_sub: "4 ready-made one-day timelines tailored to young fans, foodies, families, and relaxers.",
      map_badge: "LIVE EXPLORATION MAP",
      map_heading: "HANWHA LIFE EAGLES PARK MAP",
      map_sub: "Explore nearby restaurants, cafes, sights, and gates centered on Eagles Park in real-time.",
      radius_badge: "DISTANCE RADIUS EXPLORER",
      radius_heading: "WHAT'S AROUND EAGLES PARK?",
      radius_sub: "Instantly see what's reachable in 5, 10, 15, and 20 minutes from the stadium gates.",
      cta_heading: "MAKE YOUR EAGLES GAME DAY\nA DAY TO REMEMBER.",
      cta_sub: "Good food. Great places. An unforgettable game.",
      btn_find_restaurant: "FIND A RESTAURANT",
      btn_explore_daejeon_cta: "EXPLORE DAEJEON",
      btn_plan_gameday_cta: "PLAN MY GAME DAY",
      view_details: "VIEW DETAILS",
      get_directions: "GET DIRECTIONS",
      add_to_plan: "+ PLAN",
      added_to_plan: "✓ ADDED",
      distance_from_park: "Distance",
      approx_price: "Price",
      open_hours: "Hours",
      recommended_tag: "Recommended"
    }
  };

  // Helper: translation
  function t(key) {
    return i18n[state.lang][key] || key;
  }

  // Update DOM Translations
  function updateLanguageTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[state.lang][key]) {
        el.innerText = i18n[state.lang][key];
      }
    });

    const langBtnLabel = document.getElementById('lang-label');
    if (langBtnLabel) {
      langBtnLabel.innerText = state.lang === 'ko' ? 'EN' : '한국어';
    }

    // Re-render dynamic sections with current language
    renderQuickNav();
    renderTimePlan(state.currentTimePlan);
    renderRestaurants();
    renderCafes();
    renderAttractions();
    renderTransport();
    renderItineraries();
    renderRadiusPlaces(state.currentRadius);
    renderPlannerDrawer();
    lucide.createIcons();
  }

  // =========================================================================
  // 1. RENDER QUICK NAVIGATION (8 LARGE CARDS)
  // =========================================================================
  function renderQuickNav() {
    const container = document.getElementById('quick-nav-grid');
    if (!container) return;

    container.innerHTML = APP_DATA.categories.map(cat => {
      const name = state.lang === 'ko' ? cat.name_kr : cat.name_en;
      const desc = state.lang === 'ko' ? cat.desc_kr : cat.desc_en;
      
      let linkTarget = '#hero';
      if (cat.id === 'before_game') linkTarget = '#time-planner';
      else if (cat.id === 'restaurants') linkTarget = '#restaurants';
      else if (cat.id === 'cafes') linkTarget = '#cafes';
      else if (cat.id === 'attractions') linkTarget = '#attractions';
      else if (cat.id === 'family') linkTarget = '#attractions';
      else if (cat.id === 'after_game') linkTarget = '#restaurants';
      else if (cat.id === 'station') linkTarget = '#transportation';
      else if (cat.id === 'eagles_park') linkTarget = '#stadium-guide';

      return `
        <a href="${linkTarget}" class="card-tactile p-5 flex flex-col justify-between group hover:border-orange-500 transition-all cursor-pointer">
          <div>
            <div class="w-14 h-14 rounded-2xl bg-orange-100/70 text-orange-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
              ${cat.icon}
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors">${name}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">${desc}</p>
          </div>
          <div class="mt-4 flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
            <span>EXPLORE</span>
            <span>➔</span>
          </div>
        </a>
      `;
    }).join('');
  }

  // =========================================================================
  // 2. RENDER "HOW MUCH TIME DO YOU HAVE?"
  // =========================================================================
  function renderTimePlan(planId) {
    const container = document.getElementById('time-plan-card');
    if (!container) return;

    const plan = APP_DATA.time_plans.find(p => p.id === planId) || APP_DATA.time_plans[0];
    const duration = state.lang === 'ko' ? plan.duration_kr : plan.duration_en;
    const subtitle = state.lang === 'ko' ? plan.subtitle_kr : plan.subtitle_en;
    const desc = state.lang === 'ko' ? plan.description_kr : plan.description_en;

    container.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-black tracking-wider uppercase">${duration}</span>
            <span class="text-xs font-bold text-orange-600">${plan.vibe}</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">${subtitle}</h3>
          <p class="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">${desc}</p>
        </div>
        <div class="bg-orange-50 p-4 rounded-2xl border border-orange-100 min-w-[200px] text-center">
          <span class="text-xs font-semibold text-slate-500 block uppercase">Estimated Budget</span>
          <span class="text-xl font-black text-orange-600 mt-0.5 block">${plan.budget}</span>
        </div>
      </div>

      <!-- Steps Timeline -->
      <div class="mt-8">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">STEP-BY-STEP SCHEDULE</h4>
        <div class="grid grid-cols-1 md:grid-cols-${plan.steps.length} gap-4 relative">
          ${plan.steps.map((step, idx) => {
            const stepName = state.lang === 'ko' ? step.name_kr : step.name_en;
            return `
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 relative hover:border-orange-300 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-2xl">${step.icon}</span>
                  <span class="text-xs font-bold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full">${step.time}</span>
                </div>
                <div class="text-xs text-slate-400 font-bold uppercase">STEP 0${idx + 1}</div>
                <div class="font-bold text-slate-900 text-sm mt-1 leading-snug">${stepName}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Action Row -->
      <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-xs text-slate-500 flex items-center gap-1.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
          <span>모든 일정은 이글스파크 도착 시간 기준 최적화되어 있습니다.</span>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <a href="#restaurants" class="btn-3d-primary btn-3d-sm w-full sm:w-auto">
            <span>주변 맛집 둘러보기</span>
          </a>
        </div>
      </div>
    `;
    lucide.createIcons();
  }

  // =========================================================================
  // 3. RENDER RESTAURANTS ("EAT LIKE A LOCAL")
  // =========================================================================
  function renderRestaurants() {
    const container = document.getElementById('restaurants-grid');
    if (!container) return;

    let list = APP_DATA.restaurants;

    // Filter by Category
    if (state.currentFoodCategory !== 'all') {
      list = list.filter(r => r.category === state.currentFoodCategory);
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(r => 
        r.name_en.toLowerCase().includes(q) ||
        r.name_kr.toLowerCase().includes(q) ||
        r.signature_en.toLowerCase().includes(q) ||
        r.signature_kr.toLowerCase().includes(q) ||
        r.category_label_en.toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400 space-y-3">
          <div class="text-4xl">🔍</div>
          <p class="text-base font-bold text-slate-700">검색 결과가 없습니다.</p>
          <p class="text-xs">다른 검색어를 입력하시거나 카테고리 필터를 변경해보세요.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(rest => {
      const name = state.lang === 'ko' ? rest.name_kr : rest.name_en;
      const catLabel = state.lang === 'ko' ? rest.category_label_kr : rest.category_label_en;
      const signature = state.lang === 'ko' ? rest.signature_kr : rest.signature_en;
      const hours = state.lang === 'ko' ? rest.hours_kr : rest.hours_en;
      const rec = state.lang === 'ko' ? rest.recommended_for_kr.join(' · ') : rest.recommended_for.join(' · ');
      const isSaved = state.plannerItems.some(item => item.id === rest.id);

      return `
        <div class="card-tactile overflow-hidden flex flex-col justify-between group">
          <div>
            <!-- Photo & Badges -->
            <div class="relative h-52 overflow-hidden bg-slate-200">
              <img src="${rest.image}" alt="${name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="px-3 py-1 rounded-full bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold shadow-md">${catLabel}</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold">⭐ ${rest.rating}</span>
              </div>
              <div class="absolute bottom-3 right-3">
                <span class="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-bold">🏟️ ${rest.distance_km}</span>
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-6 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-xl font-bold text-slate-900 font-heading leading-tight">${name}</h3>
                <span class="text-xs font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg shrink-0">${rest.price}</span>
              </div>

              <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200/40 text-xs">
                <span class="font-bold text-amber-900">대표 시그니처:</span>
                <span class="text-amber-800 ml-1 line-clamp-1">${signature}</span>
              </div>

              <!-- Distance & Travel Specs -->
              <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 py-1 border-y border-slate-100">
                <div>
                  <span class="font-medium text-slate-400">🚶 도보:</span>
                  <span class="font-bold text-slate-800 ml-1">${rest.travel_walk}</span>
                </div>
                <div>
                  <span class="font-medium text-slate-400">🚕 택시:</span>
                  <span class="font-bold text-slate-800 ml-1">${rest.travel_taxi}</span>
                </div>
              </div>

              <div class="text-xs text-slate-500 flex items-center gap-1.5">
                <i data-lucide="users" class="w-3.5 h-3.5 text-orange-500 shrink-0"></i>
                <span class="truncate">${rec}</span>
              </div>

              <div class="text-xs text-slate-500 flex items-center gap-1.5">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                <span class="truncate">${hours}</span>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="p-6 pt-0 grid grid-cols-3 gap-2">
            <button class="btn-3d-primary btn-3d-sm col-span-2" onclick="showVenueDetail('${rest.id}')">
              <span>${t('view_details')}</span>
            </button>
            <button class="btn-3d-white btn-3d-sm flex items-center justify-center ${isSaved ? 'text-orange-600 border-orange-400' : ''}" onclick="togglePlanItem('${rest.id}', 'restaurant')">
              <span>${isSaved ? t('added_to_plan') : t('add_to_plan')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 4. RENDER CAFES & DESSERTS
  // =========================================================================
  function renderCafes() {
    const container = document.getElementById('cafes-grid');
    if (!container) return;

    container.innerHTML = APP_DATA.cafes.map(cafe => {
      const name = state.lang === 'ko' ? cafe.name_kr : cafe.name_en;
      const signature = state.lang === 'ko' ? cafe.signature_menu_kr : cafe.signature_menu;
      const atmosphere = state.lang === 'ko' ? cafe.atmosphere_kr : cafe.atmosphere;
      const hours = state.lang === 'ko' ? cafe.hours_kr : cafe.hours_en;
      const isSaved = state.plannerItems.some(item => item.id === cafe.id);

      return `
        <div class="card-tactile overflow-hidden flex flex-col justify-between group bg-white">
          <div>
            <div class="relative h-52 overflow-hidden bg-slate-200">
              <img src="${cafe.image}" alt="${name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 left-3 flex gap-1.5">
                <span class="px-3 py-1 rounded-full bg-amber-700 text-white text-xs font-bold shadow-md">☕ CAFE & BAKERY</span>
                ${cafe.photo_friendly ? `<span class="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold">📸 Photo Spot</span>` : ''}
              </div>
              <div class="absolute bottom-3 right-3">
                <span class="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-bold">🏟️ ${cafe.distance_km}</span>
              </div>
            </div>

            <div class="p-6 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-xl font-bold text-slate-900 font-heading leading-tight">${name}</h3>
                <span class="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-1 rounded-lg shrink-0">${cafe.price_range}</span>
              </div>

              <div class="p-3 bg-orange-50/70 rounded-xl border border-orange-100 text-xs">
                <span class="font-bold text-orange-950">시그니처:</span>
                <span class="text-orange-900 ml-1 font-medium line-clamp-1">${signature}</span>
              </div>

              <div class="space-y-1.5 text-xs text-slate-600">
                <div class="flex items-center gap-1.5">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
                  <span class="truncate text-slate-700">${atmosphere}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                  <span class="truncate">${hours}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i data-lucide="hourglass" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                  <span>추천 체류시간: <strong>${cafe.visit_duration}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 pt-0 grid grid-cols-3 gap-2">
            <button class="btn-3d-navy btn-3d-sm col-span-2" onclick="showVenueDetail('${cafe.id}')">
              <span>${t('view_details')}</span>
            </button>
            <button class="btn-3d-white btn-3d-sm flex items-center justify-center ${isSaved ? 'text-orange-600 border-orange-400' : ''}" onclick="togglePlanItem('${cafe.id}', 'cafe')">
              <span>${isSaved ? t('added_to_plan') : t('add_to_plan')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 5. RENDER ATTRACTIONS ("SHORT TRIPS, BIG MEMORIES")
  // =========================================================================
  function renderAttractions() {
    const container = document.getElementById('attractions-grid');
    if (!container) return;

    let list = APP_DATA.attractions;

    if (state.currentAttractionFilter !== 'all') {
      if (state.currentAttractionFilter === 'nearby') list = list.filter(a => a.filter_tag === 'nearby');
      else if (state.currentAttractionFilter === 'family') list = list.filter(a => a.family_friendly);
      else if (state.currentAttractionFilter === 'photo') list = list.filter(a => a.photo_spot);
      else if (state.currentAttractionFilter === 'rainy') list = list.filter(a => a.rainy_friendly);
    }

    container.innerHTML = list.map(att => {
      const name = state.lang === 'ko' ? att.name_kr : att.name_en;
      const whyVisit = state.lang === 'ko' ? att.why_visit_kr : att.why_visit_en;
      const tips = state.lang === 'ko' ? att.tips_kr : att.tips_en;
      const isSaved = state.plannerItems.some(item => item.id === att.id);

      return `
        <div class="card-tactile overflow-hidden flex flex-col justify-between group">
          <div>
            <div class="relative h-56 overflow-hidden bg-slate-200">
              <img src="${att.image}" alt="${name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">📸 DAEJEON ATTRACTION</span>
                ${att.family_friendly ? `<span class="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">👨‍👩‍👧 Family</span>` : ''}
              </div>
              <div class="absolute bottom-3 right-3">
                <span class="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-bold">🏟️ ${att.distance_km}</span>
              </div>
            </div>

            <div class="p-6 space-y-3">
              <h3 class="text-xl font-bold text-slate-900 font-heading leading-tight">${name}</h3>
              <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">${whyVisit}</p>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">추천 체류시간:</span>
                  <span class="font-bold text-slate-800">${att.duration}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">이동 수단:</span>
                  <span class="font-bold text-slate-800">${att.travel_transit}</span>
                </div>
              </div>

              <div class="text-xs text-orange-800 bg-orange-50/70 p-2.5 rounded-xl border border-orange-200/40">
                <span class="font-bold">💡 방문 팁:</span> ${tips}
              </div>
            </div>
          </div>

          <div class="p-6 pt-0 grid grid-cols-3 gap-2">
            <button class="btn-3d-primary btn-3d-sm col-span-2" onclick="showVenueDetail('${att.id}')">
              <span>${t('view_details')}</span>
            </button>
            <button class="btn-3d-white btn-3d-sm flex items-center justify-center ${isSaved ? 'text-orange-600 border-orange-400' : ''}" onclick="togglePlanItem('${att.id}', 'attraction')">
              <span>${isSaved ? t('added_to_plan') : t('add_to_plan')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 6. RENDER TRANSPORTATION GUIDE
  // =========================================================================
  function renderTransport() {
    const grid = document.getElementById('transport-options-grid');
    const tipsBox = document.getElementById('transport-tips-box');
    if (!grid) return;

    grid.innerHTML = APP_DATA.transportation.options.map(opt => {
      const mode = state.lang === 'ko' ? opt.mode_kr : opt.mode_en;
      const time = state.lang === 'ko' ? opt.travel_time_kr : opt.travel_time_en;
      const cost = state.lang === 'ko' ? opt.cost_kr : opt.cost_en;
      const rec = state.lang === 'ko' ? opt.recommended_for_kr : opt.recommended_for_en;
      const guide = state.lang === 'ko' ? opt.pickup_guide_kr : opt.pickup_guide_en;

      return `
        <div class="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 hover:border-orange-500/60 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">${opt.icon}</span>
              <span class="px-2.5 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black rounded-lg">⭐ 편의도 ${opt.convenience}/5</span>
            </div>

            <h3 class="text-xl font-black text-white font-heading">${mode}</h3>
            
            <div class="my-4 py-3 border-y border-slate-700 space-y-1">
              <div class="flex justify-between text-xs">
                <span class="text-slate-400 font-medium">소요 시간:</span>
                <span class="font-black text-orange-400 text-sm">${time}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-400 font-medium">예상 비용:</span>
                <span class="font-bold text-white">${cost}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="text-slate-300">
                <span class="font-bold text-orange-300">추천 대상:</span> ${rec}
              </div>
              <div class="text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                ${guide}
              </div>
            </div>
          </div>

          <div class="mt-6 pt-2">
            <button class="btn-3d-primary btn-3d-sm w-full" onclick="focusOnMapRoute('${opt.id}')">
              <span>경로 지도 확인</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (tipsBox) {
      const tips = state.lang === 'ko' ? APP_DATA.transportation.game_day_tips_kr : APP_DATA.transportation.game_day_tips_en;
      tipsBox.innerHTML = tips.map(tip => `<div>${tip}</div>`).join('');
    }
  }

  // =========================================================================
  // 7. RENDER GAME DAY ITINERARIES
  // =========================================================================
  function renderItineraries() {
    const container = document.getElementById('itineraries-container');
    if (!container) return;

    container.innerHTML = APP_DATA.itineraries.map((itin, index) => {
      const title = state.lang === 'ko' ? itin.title_kr : itin.title_en;
      const tagline = state.lang === 'ko' ? itin.tagline_kr : itin.tagline_en;
      const badge = state.lang === 'ko' ? itin.badge_kr : itin.badge_en;

      return `
        <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80">
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-3 py-1 bg-gradient-to-r ${itin.color} text-white rounded-full text-xs font-black tracking-wider uppercase">${badge}</span>
                <span class="text-xs font-bold text-slate-500">⏱️ ${itin.total_time}</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">${title}</h3>
              <p class="text-sm text-slate-600 mt-1 font-medium">${tagline}</p>
            </div>
            <button class="btn-3d-primary btn-3d-sm shrink-0" onclick="loadItineraryToPlanner('${itin.id}')">
              <span>이 코스 전체 담기</span>
            </button>
          </div>

          <!-- Horizontal Timeline -->
          <div class="mt-8 overflow-x-auto no-scrollbar pb-4">
            <div class="flex gap-4 min-w-[700px]">
              ${itin.steps.map((step, sIdx) => {
                const sTitle = state.lang === 'ko' ? step.title_kr : step.title_en;
                const sDesc = state.lang === 'ko' ? step.desc_kr : step.desc_en;
                return `
                  <div class="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 relative flex flex-col justify-between hover:border-orange-400 transition-colors">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-2xl">${step.icon}</span>
                        <span class="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">${step.time}</span>
                      </div>
                      <div class="text-xs text-slate-400 font-bold uppercase">STOP ${sIdx + 1}</div>
                      <h4 class="font-bold text-slate-900 text-sm mt-1 leading-snug">${sTitle}</h4>
                      <p class="text-xs text-slate-600 mt-1 leading-relaxed">${sDesc}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 8. RENDER RADIUS PLACES ("WHAT'S AROUND EAGLES PARK?")
  // =========================================================================
  function renderRadiusPlaces(radiusKey) {
    const container = document.getElementById('radius-places-grid');
    if (!container) return;

    const places = APP_DATA.radius_places[radiusKey] || [];
    container.innerHTML = places.map(p => {
      const name = state.lang === 'ko' ? p.name_kr : p.name_en;
      const desc = state.lang === 'ko' ? p.desc_kr : p.desc_en;

      return `
        <div class="card-tactile p-5 bg-white flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">${p.icon}</span>
              <span class="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">${p.time_walk}</span>
            </div>
            <h4 class="text-base font-bold text-slate-900 font-heading leading-snug">${name}</h4>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">${desc}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100">
            <button class="btn-3d-white btn-3d-sm w-full text-xs" onclick="findPlaceInPage('${name}')">
              <span>상세 위치 확인</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 9. LEAFLET MAP INITIALIZATION & INTERACTION
  // =========================================================================
  function initLeafletMap() {
    const mapEl = document.getElementById('map-element');
    if (!mapEl || state.map) return;

    const stadiumCoords = [APP_DATA.stadium.lat, APP_DATA.stadium.lng];

    state.map = L.map('map-element', {
      center: stadiumCoords,
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
      maxZoom: 19
    }).addTo(state.map);

    // Stadium Pin (Glowing Orange)
    const stadiumIcon = L.divIcon({
      className: 'custom-pin-wrapper',
      html: `<div class="custom-pin custom-pin-stadium">⚾</div>`,
      iconSize: [46, 46],
      iconAnchor: [23, 23]
    });

    const stadiumMarker = L.marker(stadiumCoords, { icon: stadiumIcon }).addTo(state.map);
    stadiumMarker.bindPopup(`
      <div class="p-3 text-center">
        <h4 class="font-bold text-slate-900 text-sm">한화생명 이글스파크</h4>
        <p class="text-xs text-slate-500 mt-0.5">Hanwha Life Eagles Park</p>
        <div class="mt-2 inline-block px-2 py-0.5 bg-orange-600 text-white rounded text-xs font-bold">1루 오렌지 응원존</div>
      </div>
    `);
    stadiumMarker.on('click', () => {
      updateMapPreview({
        name: APP_DATA.stadium.name_kr,
        addr: APP_DATA.stadium.address_kr,
        img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
        dist: '0 km (중심지)',
        time: '경기 관람 약 3~4시간',
        desc: '1루 오렌지 응원존, 보리떡볶이와 가마솥 통닭이 유명한 한화이글스의 홈구장.'
      });
    });

    // Add Radius Circles (500m ~ 2000m)
    const radii = [
      { r: 500, color: '#f35b04', opacity: 0.15 },
      { r: 1000, color: '#f59e0b', opacity: 0.1 },
      { r: 1500, color: '#3b82f6', opacity: 0.06 }
    ];
    radii.forEach(circle => {
      L.circle(stadiumCoords, {
        radius: circle.r,
        color: circle.color,
        fillColor: circle.color,
        fillOpacity: circle.opacity,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(state.map);
    });

    // Add Venue Markers
    renderMapMarkers();
  }

  function renderMapMarkers() {
    if (!state.map) return;

    // Clear old markers
    state.markers.forEach(m => state.map.removeLayer(m));
    state.markers = [];

    const allVenues = [
      ...APP_DATA.restaurants.map(r => ({ ...r, mapType: 'food', iconText: '🍜' })),
      ...APP_DATA.cafes.map(c => ({ ...c, mapType: 'cafe', iconText: '☕' })),
      ...APP_DATA.attractions.map(a => ({ ...a, mapType: 'spot', iconText: '📸' }))
    ];

    allVenues.forEach(v => {
      if (state.currentMapCategory !== 'all' && v.mapType !== state.currentMapCategory) return;
      if (!v.lat || !v.lng) return;

      let pinClass = 'custom-pin-food';
      if (v.mapType === 'cafe') pinClass = 'custom-pin-cafe';
      else if (v.mapType === 'spot') pinClass = 'custom-pin-attraction';

      const customIcon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-pin ${pinClass}">${v.iconText}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const name = state.lang === 'ko' ? (v.name_kr || v.name_en) : v.name_en;
      const addr = state.lang === 'ko' ? (v.address_kr || '') : (v.address_en || '');

      const marker = L.marker([v.lat, v.lng], { icon: customIcon }).addTo(state.map);
      marker.bindPopup(`
        <div class="p-3 text-center">
          <h4 class="font-bold text-slate-900 text-sm">${name}</h4>
          <p class="text-xs text-orange-600 font-bold mt-0.5">🏟️ ${v.distance_km}</p>
          <button class="mt-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold" onclick="showVenueDetail('${v.id}')">
            상세보기
          </button>
        </div>
      `);

      marker.on('click', () => {
        updateMapPreview({
          name: name,
          addr: addr || '대전 중구 (이글스파크 인근)',
          img: v.image,
          dist: v.distance_km,
          time: v.travel_walk || v.travel_time || '약 10~15분',
          desc: state.lang === 'ko' ? (v.description_kr || v.why_visit_kr) : (v.description_en || v.why_visit_en)
        });
      });

      state.markers.push(marker);
    });
  }

  function updateMapPreview(data) {
    document.getElementById('map-selected-title').innerText = data.name;
    document.getElementById('map-selected-addr').innerText = data.addr;
    document.getElementById('map-selected-img').src = data.img;
    document.getElementById('map-selected-dist').innerText = data.dist;
    document.getElementById('map-selected-time').innerText = data.time;
    document.getElementById('map-selected-desc').innerText = data.desc;
  }

  // =========================================================================
  // 10. MODAL DIALOGS (VENUE DETAILS & CHEER)
  // =========================================================================
  window.showVenueDetail = function(venueId) {
    const venue = 
      APP_DATA.restaurants.find(r => r.id === venueId) ||
      APP_DATA.cafes.find(c => c.id === venueId) ||
      APP_DATA.attractions.find(a => a.id === venueId);

    if (!venue) return;

    const modal = document.getElementById('venue-modal');
    if (!modal) return;

    const name = state.lang === 'ko' ? (venue.name_kr || venue.name_en) : venue.name_en;
    const addr = state.lang === 'ko' ? (venue.address_kr || '') : (venue.address_en || '');
    const desc = state.lang === 'ko' ? (venue.description_kr || venue.why_visit_kr) : (venue.description_en || venue.why_visit_en);
    const signature = state.lang === 'ko' ? (venue.signature_kr || venue.signature_menu_kr || venue.tips_kr) : (venue.signature_en || venue.signature_menu || venue.tips_en);
    const rec = state.lang === 'ko' ? (venue.recommended_for_kr?.join(' · ') || (venue.family_friendly ? '가족/친구' : '모든 팬')) : (venue.recommended_for?.join(' · ') || 'Everyone');

    document.getElementById('modal-venue-img').src = venue.image;
    document.getElementById('modal-venue-name').innerText = name;
    document.getElementById('modal-venue-address').innerText = addr || '대전 중구 (이글스파크 인근)';
    document.getElementById('modal-venue-category').innerText = venue.category_label_kr || (venue.signature_menu ? 'CAFE & DESSERT' : 'ATTRACTION');
    document.getElementById('modal-venue-dist').innerText = venue.distance_km;
    document.getElementById('modal-venue-travel').innerText = venue.travel_walk || venue.travel_time || venue.travel_transit || '10~15분';
    document.getElementById('modal-venue-rec').innerText = rec;
    document.getElementById('modal-venue-desc').innerText = desc;
    document.getElementById('modal-venue-menu').innerText = signature || '시그니처 메뉴 및 명소 꿀팁 제공';
    document.getElementById('modal-venue-hours').innerText = state.lang === 'ko' ? (venue.hours_kr || '상시 개방 / 연중무휴') : (venue.hours_en || 'Open Daily');
    document.getElementById('modal-venue-price').innerText = venue.price || venue.price_range || '무료 또는 상이';

    // Map Button External Link
    const mapBtn = document.getElementById('modal-btn-map');
    const query = encodeURIComponent(venue.name_kr || venue.name_en);
    mapBtn.href = `https://map.naver.com/v5/search/${query}`;

    // Add to Planner Action
    const addPlanBtn = document.getElementById('modal-btn-add-plan');
    addPlanBtn.onclick = () => {
      togglePlanItem(venue.id, venue.category ? 'restaurant' : (venue.signature_menu ? 'cafe' : 'attraction'));
      modal.classList.add('hidden');
    };

    modal.classList.remove('hidden');
    lucide.createIcons();
  };

  // Close modal events
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    document.getElementById('venue-modal')?.classList.add('hidden');
  });

  // =========================================================================
  // 11. "MY GAME DAY PLANNER" DRAWER
  // =========================================================================
  window.togglePlanItem = function(venueId, type) {
    const existingIdx = state.plannerItems.findIndex(i => i.id === venueId);
    
    if (existingIdx > -1) {
      state.plannerItems.splice(existingIdx, 1);
    } else {
      let venue = 
        APP_DATA.restaurants.find(r => r.id === venueId) ||
        APP_DATA.cafes.find(c => c.id === venueId) ||
        APP_DATA.attractions.find(a => a.id === venueId);
      
      if (venue) {
        state.plannerItems.push({
          id: venue.id,
          name_kr: venue.name_kr,
          name_en: venue.name_en,
          type: type,
          dist: venue.distance_km,
          img: venue.image
        });
        // Small celebratory confetti burst
        triggerConfetti(0.3);
      }
    }

    localStorage.setItem('eagles_planner_items', JSON.stringify(state.plannerItems));
    updatePlannerBadge();
    renderPlannerDrawer();
    renderRestaurants();
    renderCafes();
    renderAttractions();
  };

  function updatePlannerBadge() {
    const badge = document.getElementById('planner-count-badge');
    if (badge) badge.innerText = state.plannerItems.length;
  }

  function renderPlannerDrawer() {
    const listContainer = document.getElementById('planner-items-list');
    const emptyState = document.getElementById('planner-empty-state');
    const totalCount = document.getElementById('planner-total-count');

    if (!listContainer) return;

    totalCount.innerText = `${state.plannerItems.length} 곳`;

    if (state.plannerItems.length === 0) {
      listContainer.innerHTML = '';
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');

    listContainer.innerHTML = state.plannerItems.map((item, idx) => {
      const name = state.lang === 'ko' ? item.name_kr : item.name_en;
      return `
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">${idx + 1}</span>
            <div>
              <h5 class="font-bold text-slate-900 text-sm leading-tight">${name}</h5>
              <span class="text-xs text-slate-400">구장 기준: ${item.dist}</span>
            </div>
          </div>
          <button class="text-slate-400 hover:text-rose-600 p-1.5" onclick="togglePlanItem('${item.id}', '${item.type}')">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `;
    }).join('');
    lucide.createIcons();
  }

  window.loadItineraryToPlanner = function(itineraryId) {
    const itin = APP_DATA.itineraries.find(i => i.id === itineraryId);
    if (!itin) return;

    state.plannerItems = [
      { id: 'custom_station', name_kr: 'KTX 대전역 도착', name_en: 'KTX Daejeon Station Arrival', type: 'station', dist: '2.4 km', img: '' },
      { id: 'gwangcheon', name_kr: '광천식당 오징어두루치기', name_en: 'Gwangcheon Sikdang', type: 'restaurant', dist: '1.4 km', img: '' },
      { id: 'sungsimdang_main', name_kr: '성심당 본점 빵지순례', name_en: 'Sung Sim Dang Main Bakery', type: 'cafe', dist: '1.3 km', img: '' },
      { id: 'stadium_entry', name_kr: '한화생명 이글스파크 1루 응원석 입장', name_en: 'Eagles Park Cheer Zone', type: 'stadium', dist: '0 km', img: '' }
    ];

    localStorage.setItem('eagles_planner_items', JSON.stringify(state.plannerItems));
    updatePlannerBadge();
    renderPlannerDrawer();
    triggerConfetti(0.8);
    document.getElementById('planner-drawer')?.classList.remove('hidden');
  };

  // Open/Close Planner Drawer
  document.getElementById('btn-open-planner')?.addEventListener('click', () => {
    document.getElementById('planner-drawer')?.classList.remove('hidden');
  });
  document.getElementById('btn-close-planner')?.addEventListener('click', () => {
    document.getElementById('planner-drawer')?.classList.add('hidden');
  });
  document.getElementById('btn-clear-plan')?.addEventListener('click', () => {
    state.plannerItems = [];
    localStorage.setItem('eagles_planner_items', JSON.stringify([]));
    updatePlannerBadge();
    renderPlannerDrawer();
    renderRestaurants();
    renderCafes();
    renderAttractions();
  });
  document.getElementById('btn-print-plan')?.addEventListener('click', () => {
    window.print();
  });

  // =========================================================================
  // 12. CONFETTI & STADIUM SOUND SYNTHESIZER
  // =========================================================================
  function triggerConfetti(intensity = 0.5) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: Math.floor(60 * intensity),
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F35B04', '#FF6B18', '#FAF8F5', '#F59E0B', '#FFFFFF']
      });
    }
  }

  window.playCheerBeat = function() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 523.25]; // C D E F G C
      const times = [0, 0.2, 0.4, 0.6, 0.8, 1.1];

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + times[i]);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + times[i] + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + times[i]);
        osc.stop(audioCtx.currentTime + times[i] + 0.2);
      });
      triggerConfetti(0.4);
    } catch (e) {
      console.log('AudioContext not allowed without gesture', e);
    }
  };

  document.getElementById('btn-cheer-confetti')?.addEventListener('click', () => {
    triggerConfetti(1.2);
    playCheerBeat();
  });

  // Cheer Modal Handlers
  document.getElementById('btn-cheer-modal-open')?.addEventListener('click', () => {
    document.getElementById('cheer-modal')?.classList.remove('hidden');
  });
  document.getElementById('btn-close-cheer')?.addEventListener('click', () => {
    document.getElementById('cheer-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-cheer-modal-confetti')?.addEventListener('click', () => {
    triggerConfetti(1.5);
    playCheerBeat();
  });

  // =========================================================================
  // 13. EVENT LISTENERS & FILTER CONTROLS
  // =========================================================================
  
  // Language Switcher Toggle
  document.getElementById('btn-lang-toggle')?.addEventListener('click', () => {
    state.lang = state.lang === 'ko' ? 'en' : 'ko';
    updateLanguageTexts();
  });

  // Mobile Menu Toggle
  document.getElementById('btn-mobile-menu')?.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    menu?.classList.toggle('hidden');
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobile-menu')?.classList.add('hidden');
    });
  });

  // Time Tabs ("How Much Time Do You Have?")
  document.querySelectorAll('[data-time-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-time-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-time-tab');
      state.currentTimePlan = tabId;
      renderTimePlan(tabId);
    });
  });

  // Food Filter Pills
  document.querySelectorAll('.food-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.food-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-orange-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-orange-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      state.currentFoodCategory = btn.getAttribute('data-category');
      renderRestaurants();
    });
  });

  // Food Search Bar
  document.getElementById('restaurant-search')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderRestaurants();
  });

  // Attraction Filter Pills
  document.querySelectorAll('.attraction-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.attraction-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-slate-900', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-slate-900', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      state.currentAttractionFilter = btn.getAttribute('data-filter');
      renderAttractions();
    });
  });

  // Map Filter Buttons
  document.querySelectorAll('.map-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-orange-600', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-orange-600', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      state.currentMapCategory = btn.getAttribute('data-map-category');
      renderMapMarkers();
    });
  });

  // Radius Buttons ("What's Around Eagles Park?")
  document.querySelectorAll('[data-radius-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-radius-btn]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rKey = btn.getAttribute('data-radius-btn');
      state.currentRadius = rKey;
      renderRadiusPlaces(rKey);
    });
  });

  // Directions Route Helpers
  window.focusOnMapRoute = function(modeId) {
    const mapSection = document.getElementById('interactive-map');
    mapSection?.scrollIntoView({ behavior: 'smooth' });
    if (state.map) {
      state.map.setView([36.3235, 127.4291], 14);
    }
  };

  window.findPlaceInPage = function(name) {
    const mapSection = document.getElementById('interactive-map');
    mapSection?.scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('btn-show-full-directions')?.addEventListener('click', () => {
    window.open('https://map.naver.com/v5/directions/14316124.966373738,4344485.457317769,KTX%EB%8C%80%EC%A0%84%EC%97%AD/14316520.198305374,4343105.772591632,%ED%95%9C%ED%99%94%EC%83%9d%EB%AA%85%EC%9D%B4%EA%B8%80%EC%8A%A4%ED%8C%8C%ED%81%AC', '_blank');
  });

  document.getElementById('map-btn-directions')?.addEventListener('click', () => {
    window.open('https://map.naver.com/v5/search/%ED%95%9C%ED%99%94%EC%83%9d%EB%AA%85%EC%9D%B4%EA%B8%80%EC%8A%A4%ED%8C%8C%ED%81%AC', '_blank');
  });

  // =========================================================================
  // 14. INITIALIZE APP
  // =========================================================================
  updateLanguageTexts();
  updatePlannerBadge();
  initLeafletMap();
});
