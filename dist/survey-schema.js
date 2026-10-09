// Public Viewdding survey, version 2026-08-24.2; retrieved 2026-09-20.
(function(root){const schema={
  "version": "2026-08-24.2",
  "meta": {
    "title": "웨딩홀 기준 서베이",
    "description": "9개의 질문으로 두 사람의 조건과 취향, 가장 중요한 기준을 정리해요.",
    "estimatedMinutes": 4
  },
  "parts": [
    {
      "id": "A",
      "title": "우리의 조건",
      "subtitle": "지역, 일정, 하객 규모와 예산처럼 함께 정할 조건입니다.",
      "mode": "shared",
      "questions": [
        {
          "id": "A1",
          "type": "region-picker",
          "question": "어느 지역을 고려하고 있나요?",
          "help": "여러 지역을 고를 수 있어요. 아직 미정이라면 전국 전체를 선택해도 괜찮아요.",
          "phase2": {
            "role": "hard_filter",
            "target": "region"
          }
        },
        {
          "id": "A2",
          "type": "schedule",
          "question": "희망 시기와 일정은 어느 정도 정해졌나요?",
          "help": "실제 예약 가능 여부는 상담이 필요하지만, 조정 가능한 범위를 미리 정리해드려요.",
          "precisionOptions": [
            {
              "value": "exact_date",
              "label": "날짜가 정해졌어요"
            },
            {
              "value": "year_month",
              "label": "원하는 달이 있어요"
            },
            {
              "value": "season",
              "label": "계절만 정했어요"
            },
            {
              "value": "open",
              "label": "좋은 홀에 맞출 수 있어요"
            }
          ],
          "flexibilityOptionsByPrecision": {
            "exact_date": [
              {
                "value": "fixed",
                "label": "날짜·시간 모두 유지"
              },
              {
                "value": "time_flexible",
                "label": "날짜는 유지하고 시간 조정"
              },
              {
                "value": "nearby_period",
                "label": "전후 1~2주도 가능"
              },
              {
                "value": "price_flexible",
                "label": "할인된다면 다른 시기도 가능"
              }
            ],
            "year_month": [
              {
                "value": "period_only",
                "label": "선택한 달 안에서 찾기"
              },
              {
                "value": "nearby_period",
                "label": "앞뒤 한 달까지 함께 보기"
              },
              {
                "value": "price_flexible",
                "label": "가격이나 홀이 좋다면 다른 달도 가능"
              }
            ],
            "season": [
              {
                "value": "period_only",
                "label": "선택한 계절 안에서 찾기"
              },
              {
                "value": "nearby_period",
                "label": "앞뒤 계절까지 함께 보기"
              },
              {
                "value": "price_flexible",
                "label": "가격이나 홀이 좋다면 다른 계절도 가능"
              }
            ]
          },
          "weekdayOptions": [
            {
              "value": "saturday",
              "label": "토요일"
            },
            {
              "value": "sunday",
              "label": "일요일"
            },
            {
              "value": "weekday",
              "label": "평일"
            }
          ],
          "timeOptions": [
            {
              "value": "morning",
              "label": "오전"
            },
            {
              "value": "lunch",
              "label": "점심"
            },
            {
              "value": "afternoon",
              "label": "오후"
            },
            {
              "value": "evening",
              "label": "저녁"
            }
          ],
          "seasonOptions": [
            {
              "value": "spring",
              "label": "봄"
            },
            {
              "value": "summer",
              "label": "여름"
            },
            {
              "value": "autumn",
              "label": "가을"
            },
            {
              "value": "winter",
              "label": "겨울"
            }
          ]
        },
        {
          "id": "A3",
          "type": "guest-estimate",
          "question": "양가 하객은 모두 몇 명쯤 예상하나요?",
          "help": "양가 부모님 손님까지 포함한 전체 하객 수예요. 정확하지 않아도 괜찮아요.",
          "options": [
            {
              "value": "under_80",
              "label": "80명 미만",
              "sublabel": "소규모 예식"
            },
            {
              "value": "80_120",
              "label": "80~120명"
            },
            {
              "value": "121_180",
              "label": "121~180명"
            },
            {
              "value": "181_250",
              "label": "181~250명"
            },
            {
              "value": "251_350",
              "label": "251~350명"
            },
            {
              "value": "over_350",
              "label": "350명 이상"
            },
            {
              "value": "unknown",
              "label": "아직 감이 안 와요",
              "exclusive": true
            }
          ],
          "phase2": {
            "role": "hard_filter",
            "target": "guests"
          }
        },
        {
          "id": "A4",
          "type": "budget-builder",
          "question": "우리 조건이면 식장 비용이 어느 정도일까요?",
          "help": "선택한 지역과 하객 수에 공개 중간값을 적용해 식대와 대관료를 먼저 계산해드려요.",
          "strategyOptions": [
            {
              "value": "reference_limit",
              "label": "계산된 참고 금액 안으로 맞추고 싶어요"
            },
            {
              "value": "plus_5m",
              "label": "참고 금액보다 500만원 정도 더 가능해요"
            },
            {
              "value": "conditions_first",
              "label": "비용보다 필수 조건이 더 중요해요"
            },
            {
              "value": "custom",
              "label": "최대 금액을 직접 입력할게요"
            },
            {
              "value": "unknown",
              "label": "아직 정하지 않을래요"
            }
          ],
          "phase2": {
            "role": "planning_input",
            "target": "venue_total_budget"
          }
        },
        {
          "id": "A5",
          "type": "group",
          "question": "하객은 주로 어떻게 오실 것 같나요?",
          "help": "하객 입장에서 가장 현실적인 이동 방식을 골라주세요.",
          "groupQuestions": [
            {
              "id": "A5-mode",
              "type": "single",
              "question": "주 이동수단",
              "options": [
                {
                  "value": "public_transport",
                  "label": "대중교통 중심"
                },
                {
                  "value": "car",
                  "label": "자차 중심"
                },
                {
                  "value": "mixed",
                  "label": "둘 다 비슷해요"
                },
                {
                  "value": "unknown",
                  "label": "아직 모르겠어요"
                }
              ]
            },
            {
              "id": "A5-extra",
              "type": "multi",
              "question": "추가로 챙길 접근 조건",
              "options": [
                {
                  "value": "parking_ease",
                  "label": "주차가 편리한 곳"
                },
                {
                  "value": "airport_ktx",
                  "label": "공항·KTX 접근"
                },
                {
                  "value": "mobility_access",
                  "label": "어르신·휠체어 이동 편의"
                },
                {
                  "value": "none",
                  "label": "별도 고려사항 없음",
                  "exclusive": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "B",
      "title": "각자의 취향",
      "subtitle": "공간, 예식 방식과 우선순위를 각자 답합니다.",
      "mode": "individual",
      "questions": [
        {
          "id": "B1",
          "type": "photo-card",
          "max": 2,
          "question": "가장 끌리는 예식 공간은 어떤 느낌인가요?",
          "help": "최대 2개까지 고를 수 있어요.",
          "options": [
            {
              "value": "bright_natural",
              "label": "밝고 자연광이 드는 홀",
              "sublabel": "화이트 톤과 자연스러운 채광",
              "image": "assets/survey/mood-white.jpg"
            },
            {
              "value": "dark_dramatic",
              "label": "어둡고 드라마틱한 홀",
              "sublabel": "집중조명과 웅장한 연출",
              "image": "assets/survey/mood-grand.jpg"
            },
            {
              "value": "classic_chapel",
              "label": "클래식한 채플",
              "sublabel": "긴 버진로드와 경건한 분위기",
              "image": "assets/survey/mood-chapel.jpg"
            },
            {
              "value": "garden_outdoor",
              "label": "정원·야외 예식",
              "sublabel": "꽃과 녹음이 어우러진 자연스러운 공간",
              "image": "assets/survey/mood-garden.jpg"
            },
            {
              "value": "private_house",
              "label": "프라이빗 하우스웨딩",
              "sublabel": "한 팀 중심의 편안하고 여유로운 예식",
              "image": "assets/survey/mood-private-house.png"
            },
            {
              "value": "formal_hotel",
              "label": "정돈된 호텔 스타일",
              "sublabel": "격식 있고 안정적인 서비스",
              "image": "assets/survey/mood-hotel.jpg"
            },
            {
              "value": "unknown",
              "label": "여러 공간을 보고 정하고 싶어요",
              "sublabel": "아직 취향을 정하지 않아도 괜찮아요",
              "exclusive": true
            }
          ]
        },
        {
          "id": "B2",
          "type": "group",
          "question": "예식과 공간은 어떻게 운영되면 좋을까요?",
          "groupQuestions": [
            {
              "id": "B2-format",
              "type": "single",
              "question": "예식과 식사 방식",
              "options": [
                {
                  "value": "separate",
                  "label": "본식 후 별도 연회장에서 식사",
                  "sublabel": "예식에 집중하는 분리예식"
                },
                {
                  "value": "simultaneous",
                  "label": "예식과 식사를 같은 공간에서",
                  "sublabel": "하객과 함께하는 동시예식"
                },
                {
                  "value": "either",
                  "label": "두 방식 모두 괜찮아요"
                },
                {
                  "value": "unknown",
                  "label": "아직 모르겠어요"
                }
              ]
            },
            {
              "id": "B2-solo",
              "type": "single",
              "question": "단독 사용 선호",
              "options": [
                {
                  "value": "required",
                  "label": "다른 예식과 공간·동선이 겹치지 않아야 해요"
                },
                {
                  "value": "preferred",
                  "label": "가능하면 단독 사용이면 좋겠어요"
                },
                {
                  "value": "indifferent",
                  "label": "선택할 수 있는 홀이 많은 게 더 중요해요"
                },
                {
                  "value": "unknown",
                  "label": "아직 모르겠어요"
                }
              ]
            }
          ]
        },
        {
          "id": "B3",
          "type": "single",
          "question": "하객 식사에서 가장 중요한 점은 무엇인가요?",
          "options": [
            {
              "value": "quality",
              "label": "맛과 전반적인 품질"
            },
            {
              "value": "price",
              "label": "합리적인 식대"
            },
            {
              "value": "buffet_variety",
              "label": "다양한 뷔페 메뉴"
            },
            {
              "value": "course_service",
              "label": "차분한 코스 서비스"
            },
            {
              "value": "indifferent",
              "label": "식사 방식은 크게 상관없어요"
            },
            {
              "value": "unknown",
              "label": "아직 모르겠어요"
            }
          ]
        },
        {
          "id": "B4",
          "type": "pick-n",
          "question": "웨딩홀을 고를 때 중요한 기준을 순서대로 3개 골라주세요.",
          "help": "고르는 순서대로 1순위, 2순위, 3순위가 됩니다. 다시 누르면 선택을 취소할 수 있어요.",
          "exactCount": 3,
          "options": [
            {
              "value": "venue_total_budget",
              "label": "식장 총비용"
            },
            {
              "value": "region_access",
              "label": "지역·교통"
            },
            {
              "value": "schedule",
              "label": "날짜·시간"
            },
            {
              "value": "hall_mood",
              "label": "홀 분위기"
            },
            {
              "value": "meal",
              "label": "하객 식사"
            },
            {
              "value": "privacy_pace",
              "label": "단독 사용·예식 간격"
            },
            {
              "value": "parking",
              "label": "주차"
            },
            {
              "value": "guest_facilities",
              "label": "하객 동선·편의시설"
            }
          ]
        }
      ]
    }
  ]
};root.SurveySchema=schema;if(typeof module!=="undefined")module.exports=schema;})(typeof window!=="undefined"?window:globalThis);
