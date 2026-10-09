/* Adapted planning template; example personal records are not imported. */
window.PlannerData = {
  "stages": [
    {
      "id": "start",
      "timing": "준비 시작",
      "label": "우리의 기준 정하기",
      "description": "양가 인사, 예산과 예식의 큰 방향을 함께 정해요.",
      "months": -13,
      "days": 0
    },
    {
      "id": "booking",
      "timing": "12~10개월 전",
      "label": "공간과 업체 예약",
      "description": "웨딩홀과 촬영 업체를 비교하고 주요 일정을 확보해요.",
      "months": -12,
      "days": 0
    },
    {
      "id": "shoot",
      "timing": "9~6개월 전",
      "label": "촬영과 여행 준비",
      "description": "촬영 의상부터 항공·숙소까지 차근차근 준비해요.",
      "months": -6,
      "days": 0
    },
    {
      "id": "home",
      "timing": "5~4개월 전",
      "label": "신혼집과 청첩장",
      "description": "함께 살 공간을 준비하고 초대할 분들을 정리해요.",
      "months": -4,
      "days": 0
    },
    {
      "id": "ceremony",
      "timing": "3~2개월 전",
      "label": "초대와 본식 구성",
      "description": "청첩장을 전하고 의상, 식순과 역할을 구체화해요.",
      "months": -2,
      "days": 0
    },
    {
      "id": "month",
      "timing": "1개월 전",
      "label": "본식 세부 준비",
      "description": "부케와 영상, 답례품 등 마지막 구성을 확정해요.",
      "months": -1,
      "days": 0
    },
    {
      "id": "final_check",
      "timing": "2주 전",
      "label": "최종 확인",
      "description": "인원과 업체 일정, 여행 준비를 다시 확인해요.",
      "months": 0,
      "days": -14
    },
    {
      "id": "eve",
      "timing": "전날",
      "label": "내일을 위한 점검",
      "description": "준비물과 도착 시간, 연락망을 한 번 더 확인해요.",
      "months": 0,
      "days": -1
    },
    {
      "id": "wedding_day",
      "timing": "당일",
      "label": "우리의 결혼식",
      "description": "담당자와 역할을 나누고 두 사람의 순간에 집중해요.",
      "months": 0,
      "days": 0
    },
    {
      "id": "after",
      "timing": "결혼 후",
      "label": "인사와 마무리",
      "description": "감사 인사를 전하고 대여 물품과 사진을 정리해요.",
      "months": 1,
      "days": 0
    }
  ],
  "items": [
    {
      "id": "parents_visit",
      "stage": "start",
      "category": "가족 · 상견례",
      "title": "양가 부모님께 인사드리기",
      "description": "방문 날짜를 조율하고 필요하면 선물을 준비해요.",
      "importance": "recommended"
    },
    {
      "id": "wedding_timing",
      "title": "결혼 시기 정하기",
      "description": "계절과 가능한 월을 중심으로 두 사람의 범위를 정해요.",
      "timingLabel": "가장 먼저",
      "importance": "essential",
      "stage": "start",
      "category": "기본 계획"
    },
    {
      "id": "budget_range",
      "title": "전체 예산 범위 정하기",
      "description": "웨딩홀·스드메·신혼집을 포함할지 기준부터 맞춰요.",
      "timingLabel": "가장 먼저",
      "importance": "essential",
      "stage": "start",
      "category": "예산"
    },
    {
      "id": "family_meeting",
      "title": "상견례 시기와 장소 정하기",
      "description": "웨딩홀 계약 전 진행할지 양가와 상의하고 장소를 예약해요.",
      "importance": "recommended",
      "linkedTool": {
        "label": "상견례 장소 찾기",
        "href": "/gatherings/?purpose=family_meeting"
      },
      "stage": "start",
      "category": "가족 · 상견례"
    },
    {
      "id": "guest_estimate",
      "stage": "start",
      "category": "웨딩홀",
      "title": "예상 하객 수와 보증 인원 정하기",
      "description": "양가 가족과 지인 수를 대략 나눠 웨딩홀 상담에 가져가요.",
      "importance": "recommended"
    },
    {
      "id": "venue_criteria",
      "title": "웨딩홀 기준 세우기",
      "description": "지역, 하객 수, 분위기와 우선순위를 기록해요.",
      "importance": "essential",
      "linkedTool": {
        "label": "기준 세우기",
        "href": "/survey/"
      },
      "completionSignal": "venue_survey",
      "stage": "start",
      "category": "웨딩홀"
    },
    {
      "id": "planning_method",
      "title": "플래너·워킹 방식 정하기",
      "description": "도움을 받을 범위와 직접 준비할 범위를 나눠요.",
      "importance": "recommended",
      "stage": "start",
      "category": "기본 계획"
    },
    {
      "id": "housing_search",
      "stage": "start",
      "category": "신혼집",
      "title": "신혼집 지역과 예산 정하기",
      "description": "원하는 지역, 입주 시기와 주거 형태를 함께 정해요.",
      "importance": "recommended"
    },
    {
      "id": "venue_shortlist",
      "title": "웨딩홀 후보 모으기",
      "description": "조건에 맞는 홀을 비교하고 보관함에 저장해요.",
      "importance": "essential",
      "linkedTool": {
        "label": "웨딩홀 찾기",
        "href": "/search/"
      },
      "stage": "booking",
      "category": "웨딩홀"
    },
    {
      "id": "venue_tour",
      "stage": "booking",
      "category": "웨딩홀",
      "title": "웨딩홀 상담·투어 예약하기",
      "description": "식대, 보증 인원, 추가 비용과 계약 취소 조건을 비교해요.",
      "importance": "recommended"
    },
    {
      "id": "venue_contract",
      "title": "웨딩홀 계약하기",
      "description": "최종 견적과 포함 조건을 확인하고 계약해요.",
      "importance": "essential",
      "linkedTool": {
        "label": "저장한 홀 보기",
        "href": "/favorites/?tab=halls"
      },
      "stage": "booking",
      "category": "웨딩홀"
    },
    {
      "id": "studio_booking",
      "title": "스튜디오 예약하기",
      "description": "촬영 스타일과 앨범 구성을 비교해요.",
      "importance": "recommended",
      "stage": "booking",
      "category": "촬영 · 스타일"
    },
    {
      "id": "dress_booking",
      "title": "드레스숍 예약하기",
      "description": "투어 일정과 피팅 조건을 확인해요.",
      "importance": "essential",
      "stage": "booking",
      "category": "촬영 · 스타일"
    },
    {
      "id": "makeup_booking",
      "title": "메이크업숍 예약하기",
      "description": "원하는 분위기와 담당 지정 여부를 확인해요.",
      "importance": "essential",
      "stage": "booking",
      "category": "촬영 · 스타일"
    },
    {
      "id": "main_snap_video",
      "title": "본식 스냅·영상 예약하기",
      "description": "납품 구성과 원본 제공 범위를 비교해요.",
      "importance": "recommended",
      "stage": "booking",
      "category": "촬영 · 스타일"
    },
    {
      "id": "mc_booking",
      "stage": "booking",
      "category": "본식 준비",
      "title": "사회자 일정 확인·섭외하기",
      "description": "전문 사회자나 부탁할 지인에게 예식 일정을 먼저 확인해요.",
      "importance": "optional"
    },
    {
      "id": "wedding_color",
      "title": "웨딩 퍼스널컬러 확인하기",
      "description": "드레스와 메이크업 전 진단 여부를 결정해요.",
      "importance": "optional",
      "linkedTool": {
        "label": "진단 숍 찾기",
        "href": "/wedding-color/"
      },
      "stage": "shoot",
      "category": "촬영 · 스타일"
    },
    {
      "id": "rings",
      "stage": "shoot",
      "category": "촬영 · 스타일",
      "title": "결혼반지 고르고 수령일 확인하기",
      "description": "촬영 때 착용한다면 제작·수령 일정을 촬영일에 맞춰요.",
      "importance": "recommended"
    },
    {
      "id": "groom_suit",
      "stage": "shoot",
      "category": "촬영 · 스타일",
      "title": "신랑 예복 계약·가봉하기",
      "description": "맞춤과 대여를 정하고 촬영용 의상 포함 여부를 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "shoot_concept",
      "title": "촬영 콘셉트 정하기",
      "description": "두 사람이 남기고 싶은 분위기와 장면을 모아요.",
      "importance": "recommended",
      "linkedTool": {
        "label": "셀프 스냅 가이드",
        "href": "/self-snap/"
      },
      "stage": "shoot",
      "category": "촬영 · 스타일"
    },
    {
      "id": "shoot_schedule",
      "title": "촬영 일정과 동선 확정하기",
      "description": "이동 시간과 준비 시간을 함께 계산해요.",
      "importance": "essential",
      "stage": "shoot",
      "category": "촬영 · 스타일"
    },
    {
      "id": "shoot_outfits",
      "title": "촬영 의상 준비하기",
      "description": "드레스, 예복과 캐주얼 의상의 조합을 정해요.",
      "importance": "essential",
      "stage": "shoot",
      "category": "촬영 · 스타일"
    },
    {
      "id": "shoot_makeup",
      "stage": "shoot",
      "category": "촬영 · 스타일",
      "title": "촬영 헤어·메이크업 예약하기",
      "description": "촬영 패키지 포함 여부와 헤어변형이 필요한지 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "shoot_props",
      "title": "부케와 촬영 소품 준비하기",
      "description": "사진에 필요한 작은 소품을 빠짐없이 챙겨요.",
      "importance": "optional",
      "stage": "shoot",
      "category": "촬영 · 스타일"
    },
    {
      "id": "shoot_essentials",
      "title": "촬영 준비물 점검하기",
      "description": "현장에서 필요한 준비물을 한 번 더 확인해요.",
      "importance": "recommended",
      "linkedTool": {
        "label": "준비물 보기",
        "href": "/essentials/"
      },
      "stage": "shoot",
      "category": "촬영 · 스타일"
    },
    {
      "id": "studio_session",
      "stage": "shoot",
      "category": "촬영 · 스타일",
      "title": "스튜디오·스냅 촬영하기",
      "description": "픽업과 메이크업 시간, 의상과 촬영 동선을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "passport",
      "stage": "shoot",
      "category": "신혼여행",
      "title": "여권과 여행 서류 확인하기",
      "description": "유효기간과 여행지 입국 요건은 예약 일정에 맞춰 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "honeymoon_booking",
      "title": "신혼여행 예약하기",
      "description": "여권, 항공과 숙소 일정을 먼저 확보해요.",
      "importance": "recommended",
      "stage": "shoot",
      "category": "신혼여행"
    },
    {
      "id": "family_dinner",
      "stage": "shoot",
      "category": "가족 · 상견례",
      "title": "상견례 진행하기",
      "description": "장소, 참석 인원과 선물 여부를 양가에 공유해요.",
      "importance": "recommended"
    },
    {
      "id": "housing_contract",
      "title": "신혼집 계약과 자금 계획 정리하기",
      "description": "계약 일정과 필요한 자금을 확인해요.",
      "importance": "essential",
      "stage": "home",
      "category": "신혼집"
    },
    {
      "id": "housing_inspection",
      "stage": "home",
      "category": "신혼집",
      "title": "신혼집 점검·인테리어 일정 잡기",
      "description": "실측, 수리, 청소 일정을 정하고 배송 전에 공간을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "appliances",
      "title": "가전 목록과 배송일 정하기",
      "description": "필요한 제품과 예산을 먼저 나눠요.",
      "importance": "recommended",
      "stage": "home",
      "category": "신혼집"
    },
    {
      "id": "furniture",
      "title": "가구와 생활용품 준비하기",
      "description": "공간 치수를 확인한 뒤 우선순위를 정해요.",
      "importance": "recommended",
      "stage": "home",
      "category": "신혼집"
    },
    {
      "id": "studio_select",
      "stage": "home",
      "category": "촬영 · 스타일",
      "title": "촬영 사진 셀렉·보정하기",
      "description": "청첩장 제작 전에 수정본 수령일과 추가 보정 비용을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "guest_list",
      "stage": "home",
      "category": "청첩장 · 하객",
      "title": "하객 명단과 청첩장 수량 정하기",
      "description": "양가 전달 수량과 모임 대상을 나눠 중복을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "invitation_sample",
      "stage": "home",
      "category": "청첩장 · 하객",
      "title": "종이 청첩장 샘플 비교하기",
      "description": "용지와 디자인을 고르고 문구, 약도, 계좌 정보를 점검해요.",
      "importance": "recommended"
    },
    {
      "id": "invitation_production",
      "title": "청첩장 제작하기",
      "description": "문구, 계좌와 오시는 길 정보를 확정해요.",
      "importance": "essential",
      "stage": "home",
      "category": "청첩장 · 하객"
    },
    {
      "id": "dress_fitting",
      "title": "드레스 가봉 일정 챙기기",
      "description": "피팅 결과와 수선 요청을 기록해요.",
      "importance": "essential",
      "stage": "ceremony",
      "category": "촬영 · 스타일"
    },
    {
      "id": "invitation_gathering",
      "title": "청첩장 모임 준비하기",
      "description": "지역과 인원에 맞는 만남 장소를 정해요.",
      "importance": "recommended",
      "linkedTool": {
        "label": "모임 장소 찾기",
        "href": "/gatherings/?purpose=invitation"
      },
      "stage": "ceremony",
      "category": "청첩장 · 하객"
    },
    {
      "id": "ceremony_program",
      "title": "본식 식순 정하기",
      "description": "예식 흐름과 필요한 음악을 함께 정리해요.",
      "importance": "essential",
      "stage": "ceremony",
      "category": "본식 준비"
    },
    {
      "id": "officiant_mc",
      "title": "주례·축가 섭외하고 사회자와 식순 맞추기",
      "description": "부탁할 사람과 업체 일정을 확인해요.",
      "importance": "recommended",
      "stage": "ceremony",
      "category": "본식 준비"
    },
    {
      "id": "family_outfits",
      "title": "혼주 한복·예복 준비하기",
      "description": "맞춤·대여 여부를 정하고 양가 피팅과 수령 일정을 확인해요.",
      "importance": "recommended",
      "stage": "ceremony",
      "category": "가족 · 상견례"
    },
    {
      "id": "guest_guidance",
      "title": "하객 안내 준비하기",
      "description": "교통, 주차와 숙박 안내가 필요한지 확인해요.",
      "importance": "essential",
      "stage": "ceremony",
      "category": "청첩장 · 하객"
    },
    {
      "id": "family_makeup",
      "stage": "ceremony",
      "category": "가족 · 상견례",
      "title": "혼주·가족 헤어메이크업 예약하기",
      "description": "양가 준비 장소와 인원, 이동 시간을 함께 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "groom_final",
      "stage": "ceremony",
      "category": "촬영 · 스타일",
      "title": "신랑 예복 최종 가봉하기",
      "description": "수선과 수령일, 셔츠·타이·구두 포함 여부를 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "family_gifts",
      "stage": "ceremony",
      "category": "가족 · 상견례",
      "title": "예단 여부와 전달 일정 정하기",
      "description": "양가와 진행 여부, 품목과 전달 일정을 상의해요.",
      "importance": "optional"
    },
    {
      "id": "guest_bus",
      "stage": "ceremony",
      "category": "청첩장 · 하객",
      "title": "하객 버스·이동편 예약하기",
      "description": "필요한 인원과 출발 장소, 시간, 연락 담당자를 정해요.",
      "importance": "optional"
    },
    {
      "id": "helpers",
      "stage": "ceremony",
      "category": "본식 준비",
      "title": "축의대·가방·부케 담당 부탁하기",
      "description": "각 역할을 맡을 분께 시간과 준비할 내용을 알려드려요.",
      "importance": "recommended"
    },
    {
      "id": "wedding_video",
      "stage": "ceremony",
      "category": "본식 준비",
      "title": "식전 영상과 예식 음악 준비하기",
      "description": "사용할 사진과 음원을 모으고 재생 형식과 제출일을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "bouquet_styling",
      "title": "부케와 본식 스타일링 정하기",
      "description": "드레스와 예식장 분위기에 맞춰 구성해요.",
      "importance": "optional",
      "stage": "month",
      "category": "촬영 · 스타일"
    },
    {
      "id": "moving_schedule",
      "title": "입주·이사 일정 정하기",
      "description": "청소와 설치 일정을 함께 배치해요.",
      "importance": "essential",
      "stage": "month",
      "category": "신혼집"
    },
    {
      "id": "honeymoon_details",
      "title": "신혼여행 세부 일정 준비하기",
      "description": "보험, 환전, 교통과 예약 내역을 모아요.",
      "importance": "optional",
      "stage": "month",
      "category": "신혼여행"
    },
    {
      "id": "second_outfit",
      "stage": "month",
      "category": "촬영 · 스타일",
      "title": "2부 의상과 헬퍼 확인하기",
      "description": "의상, 갈아입는 장소와 도움받을 범위를 정해요.",
      "importance": "optional"
    },
    {
      "id": "wedding_script",
      "stage": "month",
      "category": "본식 준비",
      "title": "성혼선언문·대본 최종 정리하기",
      "description": "주례 여부에 맞춰 문구를 준비하고 사회자와 공유해요.",
      "importance": "recommended"
    },
    {
      "id": "venue_tasting",
      "stage": "month",
      "category": "웨딩홀",
      "title": "웨딩홀 시식하기",
      "description": "참석 인원과 날짜를 예약하고 식사와 동선을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "venue_files",
      "stage": "month",
      "category": "본식 준비",
      "title": "웨딩홀에 영상·음원·식순 전달하기",
      "description": "담당자에게 최종 파일을 전달하고 재생 여부를 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "photo_table",
      "stage": "month",
      "category": "본식 준비",
      "title": "포토테이블 사진·액자 준비하기",
      "description": "웨딩홀 제공 범위와 필요한 크기, 수량을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "return_gifts",
      "stage": "month",
      "category": "청첩장 · 하객",
      "title": "답례품 고르고 수량 정하기",
      "description": "전달 대상과 방법을 정하고 주문·수령 일정을 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "pyebaek",
      "stage": "month",
      "category": "가족 · 상견례",
      "title": "폐백 진행 여부 확인·예약하기",
      "description": "진행한다면 의상, 음식, 장소와 시간을 확인해요.",
      "importance": "optional"
    },
    {
      "id": "beauty_booking",
      "stage": "month",
      "category": "촬영 · 스타일",
      "title": "네일·헤어 관리 일정 잡기",
      "description": "본식 준비 동선에 맞춰 예약 일정을 조율해요.",
      "importance": "optional"
    },
    {
      "id": "vendor_confirmation",
      "title": "모든 업체에 최종 일정 확인하기",
      "description": "담당자, 도착 시간과 계약 내용을 다시 확인해요.",
      "importance": "essential",
      "stage": "final_check",
      "category": "최종 점검"
    },
    {
      "id": "guest_count",
      "title": "최종 하객 수 전달하기",
      "description": "보증 인원과 식사 수량 마감일을 확인해요.",
      "importance": "essential",
      "stage": "final_check",
      "category": "청첩장 · 하객"
    },
    {
      "id": "seating_guidance",
      "title": "좌석과 하객 안내 정리하기",
      "description": "가족과 주요 하객의 동선을 공유해요.",
      "importance": "recommended",
      "stage": "final_check",
      "category": "최종 점검"
    },
    {
      "id": "payment_envelopes",
      "title": "정산금과 봉투 준비하기",
      "description": "당일 전달할 비용과 담당자를 표시해요.",
      "importance": "essential",
      "stage": "final_check",
      "category": "최종 점검"
    },
    {
      "id": "ceremony_rehearsal",
      "title": "식순과 입장 동선 확인하기",
      "description": "사회자와 가족에게 핵심 순서를 공유해요.",
      "importance": "recommended",
      "stage": "final_check",
      "category": "최종 점검"
    },
    {
      "id": "honeymoon_packing",
      "stage": "final_check",
      "category": "신혼여행",
      "title": "신혼여행 짐과 예약 내역 챙기기",
      "description": "항공·숙소 예약과 교통편을 확인하고 준비물을 모아요.",
      "importance": "recommended"
    },
    {
      "id": "wedding_day_items",
      "title": "본식 준비물 최종 점검하기",
      "description": "반지와 서류, 비상용품까지 확인해요.",
      "importance": "essential",
      "linkedTool": {
        "label": "준비물 확인",
        "href": "/essentials/"
      },
      "stage": "eve",
      "category": "최종 점검"
    },
    {
      "id": "emergency_contacts",
      "title": "당일 연락망 공유하기",
      "description": "신랑·신부 대신 연락할 담당자를 정해요.",
      "importance": "recommended",
      "stage": "eve",
      "category": "최종 점검"
    },
    {
      "id": "ceremony_day",
      "title": "본식 일정 진행하기",
      "description": "준비한 흐름대로 서로에게 집중하는 날이에요.",
      "importance": "essential",
      "stage": "wedding_day",
      "category": "본식 준비"
    },
    {
      "id": "final_payments",
      "title": "잔금과 비용 정산하기",
      "description": "업체별 잔금과 추가 비용을 확인해요.",
      "importance": "essential",
      "stage": "wedding_day",
      "category": "본식 준비"
    },
    {
      "id": "thank_you_messages",
      "title": "감사 인사 전하기",
      "description": "도와준 분들과 참석한 하객에게 마음을 전해요.",
      "importance": "recommended",
      "stage": "after",
      "category": "마무리"
    },
    {
      "id": "gift_accounting",
      "title": "축의금과 답례 정리하기",
      "description": "기록과 답례가 필요한 분들을 정리해요.",
      "importance": "recommended",
      "stage": "after",
      "category": "마무리"
    },
    {
      "id": "photo_selection",
      "title": "사진과 앨범 셀렉하기",
      "description": "납품 일정과 셀렉 마감일을 확인해요.",
      "importance": "recommended",
      "stage": "after",
      "category": "마무리"
    },
    {
      "id": "wedding_archive",
      "title": "계약과 결혼 준비 기록 정리하기",
      "description": "다시 볼 정보와 후기를 한곳에 남겨요.",
      "importance": "optional",
      "stage": "after",
      "category": "마무리"
    },
    {
      "id": "address_admin",
      "title": "전입·주소 변경 업무 확인하기",
      "description": "전입신고와 우편물 주소 변경을 챙겨요.",
      "importance": "recommended",
      "stage": "after",
      "category": "신혼집"
    },
    {
      "id": "rental_return",
      "stage": "after",
      "category": "마무리",
      "title": "대여 의상·물품 반납하기",
      "description": "반납 기한과 장소, 택배 가능 여부를 확인해요.",
      "importance": "recommended"
    },
    {
      "id": "marriage_registration",
      "stage": "after",
      "category": "마무리",
      "title": "혼인신고 일정 상의하기",
      "description": "두 사람이 원하는 신고 시기와 준비 서류를 확인해요.",
      "importance": "recommended"
    }
  ]
};
