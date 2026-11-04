# Fastfolio 콘텐츠 안내

`content/profile.json` 만 바꾸면 사람이 바뀝니다. 형태는 `src/lib/profile.ts` 의 `Profile` 입니다.
`site.ko.json`, `site.en.json` 은 사람과 무관한 UI 문구이고 `profile.locale` 로 골라집니다.
한 페이지 구성이라 상세 페이지가 없습니다.

## 필드가 쓰이는 곳

| profile 필드 | 화면 위치 | 비었을 때 | 권장 길이 |
| --- | --- | --- | --- |
| `basics.name` | 머리글, 푸터, 문서 제목 | 필수 | 20자 |
| `basics.headline` | 첫 화면 h1 | 필수 | 20자 |
| `basics.summary` | 첫 화면 본문 | 필수 | 150자 |
| `basics.about[0]` | 푸터 소개 문장 | 필수 | 60자 |
| `basics.email` | 연락 버튼의 기본 주소 | 필수 | |
| `basics.availability` | 첫 화면 상태 표시 | 숨김 | 20자 |
| `basics.photo`, `photoAlt` | 첫 화면 큰 사진, 머리글 작은 사진 | 이니셜 면 | 배경을 지운 상반신 사진 권장 |
| `basics.resumeFile` | 경력 아래 이력서 버튼 | 숨김 | |
| `basics.profiles[]` | 푸터 원형 아이콘. GitHub, X, Twitter, LinkedIn 만 아이콘이 있음 | 숨김 | |
| `skills[].items[]` | 기술 알약. 그룹은 합쳐서 표시. `icon` 은 28px 안팎 | 섹션과 메뉴를 숨김 | 12개 안팎 |
| `projects[]` | 2열 카드. `name`, `summary`, `image`, `repo`, `url` | 섹션과 메뉴를 숨김. 이미지가 없으면 이름 면 | 요약 120자, 이미지 1000x600 |
| `work[]` | 여닫는 카드. `position — company`, 기간, `highlights`(없으면 `summary`) | 섹션과 메뉴를 숨김 | 항목 3개 |
| `testimonials[]` | 두 줄로 흐르는 카드. 휴대폰에서는 세로 목록 | 섹션과 메뉴를 숨김 | 후기 120자 |
| `contact.headline`, `contact.note` | 마지막 연락 영역 | 제목은 기본 문구, 본문은 숨김 | |

## extras["fastfolio"]

| 키 | 쓰임 | 없을 때 |
| --- | --- | --- |
| `avatar` | 머리글과 푸터의 작은 사진 | `basics.photo` |
| `contactUrl` | 연락 버튼 주소 | `mailto:` 메일 |
| `ctaImage` | 연락 영역 배경 | 단색 카드 |
| `ticker` | 첫 화면 아이콘 띠에 넣을 기술 이름 | 아이콘이 있는 기술 전부 |

## 표시하지 않는 항목

`education`, `awards`, `metrics`, `services`, `process`, `writing`, `faq`, `now`, `uses`, `openSource`, 위치, 전화번호는 화면에 나오지 않습니다.
