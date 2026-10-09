var CatalogModel = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/catalog-model.ts
  var catalog_model_exports = {};
  __export(catalog_model_exports, {
    EMPTY_PERSONAL_COLOR_FILTERS: () => EMPTY_PERSONAL_COLOR_FILTERS,
    EMPTY_RESTAURANT_FILTERS: () => EMPTY_RESTAURANT_FILTERS,
    PERSONAL_COLOR_SERVICE_TAGS: () => PERSONAL_COLOR_SERVICE_TAGS,
    RESTAURANT_CUISINE_CATEGORIES: () => RESTAURANT_CUISINE_CATEGORIES,
    filterPersonalColors: () => filterPersonalColors,
    filterRestaurants: () => filterRestaurants
  });

  // src/imported/restaurant-cuisine.ts
  var RESTAURANT_CUISINE_CATEGORIES = [
    "\uD55C\uC2DD",
    "\uC77C\uC2DD",
    "\uC911\uC2DD",
    "\uC591\uC2DD",
    "\uC544\uC2DC\uC544 \uC74C\uC2DD",
    "\uC138\uACC4 \uC74C\uC2DD",
    "\uCE74\uD398\xB7\uB514\uC800\uD2B8",
    "\uAE30\uD0C0"
  ];
  var CATEGORY_RULES = [
    {
      category: "\uD55C\uC2DD",
      pattern: /한식|한우|한정식|갈비|삼겹|돼지|목살|소고기|고기|곱창|막창|족발|보쌈|국밥|곰탕|냉면|수육|전골|닭갈비|백숙|삼계탕|육개장|비빔밥|솥밥|코다리|아구찜|해장국|흑염소|쌈밥|낙곱새|낙지볶음|편백찜|전통주|막걸리|보리굴비|남도|제철회|숙성회|해산물|간장게장|고깃집/
    },
    {
      category: "\uC77C\uC2DD",
      pattern: /일식|일본|이자카야|스시|사시미|초밥|오마카세|야키니쿠|스키야키|샤브샤브|돈카츠|우동|소바|카이센|후토마끼|참치|회|장어|나베|덮밥|호루몬/
    },
    {
      category: "\uC911\uC2DD",
      pattern: /중식|중국|딤섬|마라|훠궈|탕수육|짜장|광동|광둥|홍콩|누룽지탕/
    },
    {
      category: "\uC591\uC2DD",
      pattern: /양식|이탈리|파스타|피자|스테이크|프렌치|브런치|유러피안|비스트로|리소토|리조또|리조토|뇨끼|샐러드|샌드위치|아메리칸|미국식|와인|필라프|치킨스테이크/
    },
    {
      category: "\uC544\uC2DC\uC544 \uC74C\uC2DD",
      pattern: /태국|베트남|인도|아시안|월남쌈/
    },
    {
      category: "\uC138\uACC4 \uC74C\uC2DD",
      pattern: /멕시|스페인|브라질|체코|쿠바|지중해|슈하스코|타파스/
    },
    {
      category: "\uCE74\uD398\xB7\uB514\uC800\uD2B8",
      pattern: /카페|디저트|베이커리/
    }
  ];
  function categorizeRestaurantCuisines(cuisines) {
    const source = cuisines.join(" ");
    const categories = CATEGORY_RULES.filter(({ pattern }) => pattern.test(source)).map(({ category }) => category);
    return categories.length > 0 ? categories : ["\uAE30\uD0C0"];
  }

  // src/imported/restaurant-normalization.ts
  function isRestaurantPublic(restaurant) {
    return restaurant.status === "\uACF5\uAC1C\uAC00\uB2A5" && restaurant.active;
  }

  // src/imported/restaurant-filter.ts
  var EMPTY_RESTAURANT_FILTERS = {
    keyword: "",
    purpose: "invitation",
    district: "",
    area: "",
    weekday: null,
    cuisines: [],
    budgetMax: null,
    partySize: null,
    courseOnly: false,
    privateRoomOnly: false,
    parkingOnly: false
  };
  function matchWeekday(restaurant, filters) {
    if (!filters.weekday) return "match";
    if (restaurant.closedWeekdays === null) return "unknown";
    return restaurant.closedWeekdays.includes(filters.weekday) ? "mismatch" : "match";
  }
  function matchPartySize(restaurant, partySize) {
    if (restaurant.privateRoom === "no") return "unknown";
    const { min, max } = restaurant.roomCapacity;
    if (min === null || max === null) return "unknown";
    return partySize >= min && partySize <= max ? "match" : "mismatch";
  }
  function matchKeyword(restaurant, rawKeyword) {
    const query = rawKeyword.trim().toLowerCase();
    if (!query) return true;
    const searchableText = [
      restaurant.name,
      restaurant.branch ?? "",
      restaurant.district,
      restaurant.area,
      restaurant.address,
      restaurant.venueType,
      restaurant.nearestStation ?? "",
      ...restaurant.cuisines,
      ...restaurant.captionTags,
      restaurant.recommendationPoints ?? ""
    ].join(" ").toLowerCase();
    return searchableText.includes(query);
  }
  function evaluateRestaurant(restaurant, filters) {
    const checks = [];
    checks.push({ state: restaurant.purpose === filters.purpose ? "match" : "mismatch", reason: "\uBAA8\uC784 \uBAA9\uC801" });
    if (filters.keyword.trim()) {
      checks.push({
        state: matchKeyword(restaurant, filters.keyword) ? "match" : "mismatch",
        reason: "\uAC80\uC0C9\uC5B4"
      });
    }
    if (filters.district) {
      const targets = filters.district.split(",").map((d) => d.trim()).filter(Boolean);
      const matched = targets.some((target) => {
        const isSido = ["\uC11C\uC6B8", "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC", "\uACBD\uAE30", "\uACBD\uAE30\uB3C4", "\uC778\uCC9C", "\uC778\uCC9C\uAD11\uC5ED\uC2DC", "\uAC15\uC6D0", "\uCDA9\uBD81", "\uCDA9\uB0A8", "\uC804\uBD81", "\uC804\uB0A8", "\uACBD\uBD81", "\uACBD\uB0A8", "\uC81C\uC8FC", "\uC218\uB3C4\uAD8C", "\uBD80\uC0B0", "\uB300\uAD6C", "\uB300\uC804", "\uC138\uC885", "\uC6B8\uC0B0", "\uAD11\uC8FC"].includes(target);
        if (isSido) {
          if (target === "\uC218\uB3C4\uAD8C") return Boolean(restaurant.address?.includes("\uC11C\uC6B8") || restaurant.address?.includes("\uACBD\uAE30") || restaurant.address?.includes("\uC778\uCC9C"));
          return Boolean(restaurant.address?.includes(target));
        }
        return restaurant.district === target || Boolean(restaurant.address?.includes(target));
      });
      checks.push({ state: matched ? "match" : "mismatch", reason: "\uC9C0\uC5ED" });
    }
    if (filters.area) {
      const areaMatch = restaurant.area === filters.area || restaurant.nearestStation === filters.area;
      checks.push({ state: areaMatch ? "match" : "mismatch", reason: "\uB3D9\uB124\xB7\uC5ED" });
    }
    if (filters.cuisines.length > 0) {
      const cuisineCategories = categorizeRestaurantCuisines(restaurant.cuisines);
      checks.push({
        state: filters.cuisines.some((cuisine) => cuisineCategories.includes(cuisine)) ? "match" : "mismatch",
        reason: "\uC74C\uC2DD \uC885\uB958"
      });
    }
    checks.push({ state: matchWeekday(restaurant, filters), reason: "\uBC29\uBB38 \uC694\uC77C" });
    if (filters.budgetMax !== null) {
      const minimum = restaurant.pricePerPerson.min;
      checks.push({
        state: minimum === null ? "unknown" : minimum <= filters.budgetMax ? "match" : "mismatch",
        reason: "\uAC00\uACA9"
      });
    }
    if (filters.partySize !== null) {
      checks.push({ state: matchPartySize(restaurant, filters.partySize), reason: "\uB8F8 \uC778\uC6D0" });
    }
    if (filters.courseOnly) {
      checks.push({
        state: restaurant.courseAvailable === "yes" ? "match" : restaurant.courseAvailable === "unknown" ? "unknown" : "mismatch",
        reason: "\uCF54\uC2A4"
      });
    }
    if (filters.privateRoomOnly) {
      checks.push({
        state: restaurant.privateRoom === "yes" ? "match" : restaurant.privateRoom === "unknown" ? "unknown" : "mismatch",
        reason: "\uB8F8"
      });
    }
    if (filters.parkingOnly) {
      checks.push({
        state: restaurant.parking === "available" || restaurant.parking === "valet" ? "match" : restaurant.parking === "unknown" ? "unknown" : "mismatch",
        reason: "\uC8FC\uCC28"
      });
    }
    if (checks.some((check) => check.state === "mismatch")) return null;
    const unknownReasons = checks.filter((check) => check.state === "unknown").map((check) => check.reason);
    return { restaurant, state: unknownReasons.length > 0 ? "unknown" : "match", unknownReasons };
  }
  function filterRestaurants(restaurants, filters) {
    const evaluated = restaurants.filter(isRestaurantPublic).map((restaurant) => evaluateRestaurant(restaurant, filters)).filter((restaurant) => restaurant !== null);
    const byRecency = (a, b) => (b.restaurant.verifiedAt ?? "").localeCompare(a.restaurant.verifiedAt ?? "");
    return {
      matched: evaluated.filter((item) => item.state === "match").sort(byRecency),
      unknown: evaluated.filter((item) => item.state === "unknown").sort(byRecency)
    };
  }

  // src/imported/personal-color-filter.ts
  var EMPTY_PERSONAL_COLOR_FILTERS = {
    keyword: "",
    sido: "",
    district: "",
    serviceTags: [],
    priceBudgetMax: null,
    gradeAOnly: false,
    includeOnHold: false
  };
  function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, "");
  }
  function filterPersonalColors(vendors, filters) {
    const matched = [];
    const unknown = [];
    const rawKeyword = filters.keyword.trim();
    const normalizedKeyword = normalizeText(rawKeyword);
    for (const vendor of vendors) {
      if (!filters.includeOnHold && vendor.status === "on_hold") {
        continue;
      }
      if (normalizedKeyword) {
        const searchTarget = normalizeText(
          `${vendor.name} ${vendor.sido} ${vendor.sigungu} ${vendor.district} ${vendor.address} ${vendor.evidence} ${vendor.services.join(" ")} ${vendor.notes ?? ""}`
        );
        if (!searchTarget.includes(normalizedKeyword)) {
          continue;
        }
      }
      if (filters.sido && vendor.sido !== filters.sido) {
        continue;
      }
      if (filters.district && !vendor.district.includes(filters.district) && !vendor.sigungu.includes(filters.district)) {
        continue;
      }
      if (filters.serviceTags.length > 0) {
        const hasAllTags = filters.serviceTags.every((tag) => vendor.serviceTags.includes(tag));
        if (!hasAllTags) {
          continue;
        }
      }
      if (filters.gradeAOnly && vendor.grade !== "A") {
        continue;
      }
      const unknownReasons = [];
      if (filters.priceBudgetMax !== null) {
        if (vendor.priceEstimatedMin === null) {
          unknownReasons.push("\uAC00\uACA9 \uBB38\uC758 \uB300\uC0C1");
        } else if (vendor.priceEstimatedMin > filters.priceBudgetMax) {
          continue;
        }
      }
      if (unknownReasons.length > 0) {
        unknown.push({ vendor, state: "unknown", unknownReasons });
      } else {
        matched.push({ vendor, state: "match", unknownReasons: [] });
      }
    }
    return { matched, unknown };
  }

  // src/imported/personal-color-categories.ts
  var PERSONAL_COLOR_SERVICE_TAGS = [
    {
      id: "body_shape",
      label: "\uACE8\uACA9\xB7\uCCB4\uD615 \uBD84\uC11D",
      shortLabel: "\uACE8\uACA9/\uCCB4\uD615",
      description: "\uBC14\uB514\uD54F & \uC2E4\uB8E8\uC5E3 \uBD84\uC11D"
    },
    {
      id: "dress",
      label: "\uB4DC\uB808\uC2A4 \uB77C\uC778\xB7\uC18C\uC7AC",
      shortLabel: "\uB4DC\uB808\uC2A4/\uC18C\uC7AC",
      description: "\uB4DC\uB808\uC2A4 \uB125\uB77C\uC778, \uC6D0\uB2E8, \uD654\uC774\uD2B8 \uD1A4 \uCD94\uCC9C"
    },
    {
      id: "makeup_hair",
      label: "\uD5E4\uC5B4\xB7\uBA54\uC774\uD06C\uC5C5 \uCF54\uCE6D",
      shortLabel: "\uD5E4\uC5B4/\uBA54\uC774\uD06C\uC5C5",
      description: "\uBCF8\uC2DD \uBA54\uC774\uD06C\uC5C5 \uC2DC\uC548 & \uC6E8\uB529 \uC5FC\uC0C9"
    },
    {
      id: "couple",
      label: "\uC2E0\uB791 \uC608\uBCF5\xB7\uCEE4\uD50C \uB3D9\uBC18",
      shortLabel: "\uCEE4\uD50C/\uC608\uBCF5",
      description: "\uC2E0\uB791\uC2E0\uBD80 \uCEE4\uD50C \uC9C4\uB2E8 & \uB0A8\uC131 \uC608\uBCF5"
    },
    {
      id: "total_wedding",
      label: "\uD1A0\uD0C8 \uC6E8\uB529 \uCEE8\uC124\uD305",
      shortLabel: "\uD1A0\uD0C8 \uC6E8\uB529",
      description: "\uBD80\uCF00, \uD2F0\uC544\uB77C, \uC561\uC138\uC11C\uB9AC, \uC2A4\uD29C\uB514\uC624 \uCD1D\uAD04"
    },
    {
      id: "color",
      label: "\uD37C\uC2A4\uB110\uCEEC\uB7EC \uC9C4\uB2E8",
      shortLabel: "\uD37C\uC2A4\uB110\uCEEC\uB7EC",
      description: "\uAE30\uBCF8 \uC6DC/\uCFE8 & \uC138\uBD80 \uD1A4 \uB4DC\uB808\uC774\uD551"
    }
  ];
  return __toCommonJS(catalog_model_exports);
})();
