# Kernel Dev 콘텐츠 안내

`content/profile.json` 만 바꾸면 사람이 바뀝니다. 형태는 `src/lib/profile.ts` 의 `Profile` 입니다.
`site.ko.json`, `site.en.json` 은 사람과 무관한 UI 문구이고 `profile.locale` 로 골라집니다.
한 페이지 터미널 스타일이라 상세 페이지가 없습니다.

## 필드가 쓰이는 곳

| profile 필드 | 화면 위치 | 비었을 때 | 권장 길이 |
| --- | --- | --- | --- |
| `basics.name`, `basics.label` | 사진 아래 캡션, 푸터, 문서 제목 | 필수 | 이름 20자, 직함 30자 |
| `basics.headline` | 히어로 h1, 터미널 `cat mission.txt` | 필수 | 30자 |
| `basics.summary` | 히어로 본문, meta description | 필수 | 120자 |
| `basics.about[]` | 소개 문단 | 필수 | 문단당 200자 |
| `basics.email` | 메일 버튼, 폼 수신 주소 | 필수 | |
| `basics.handle` | 내비 브랜드, 터미널 프롬프트 | 이름을 대신 씀 | 16자 |
| `basics.availability` | 히어로 상단 점멸 줄, 터미널 `status` | 둘 다 숨김 | 45자 |
| `basics.location` | 히어로 위치 줄(`city, country / timezone`) | 줄을 숨김 | 40자 |
| `basics.photo`, `photoAlt` | 히어로 사진 | 이니셜 색면 | |
| `basics.profiles[]` | 연락 섹션 링크 | 숨김 | |
| `metrics[]` | 히어로 아래 수치 카드 | 줄을 숨김 | 값 4자, 라벨 24자 |
| `principles[]` | 소개 옆 박스. 번호는 자동 | 박스를 숨김 | 항목당 35자 |
| `skills[]` | 스택 카드. 제목은 `group`, 본문은 항목을 ` · ` 로 이어 붙임. `note` 가 있으면 항목 뒤에 문장으로 붙음 | 섹션과 내비를 숨김 | 그룹당 6개 |
| `work[]`, `education[]` | 경력 행. `회사 / 직책`, `학교 / 전공` | 섹션을 숨김 | 요약 130자 |
| `awards[]` | 경력 아래 박스. `title`, `summary`, `issuer / date` | 숨김 | |
| `projects[]` | 프로젝트 카드. `kind`, `name`, `summary`, `tags`, `url`, `repo` | 섹션, 내비, 히어로 버튼을 숨김 | 요약 90자, 태그 3개 |
| `services[]` | 함께할 일 카드. `name`, `summary` | 섹션을 숨김 | 요약 90자 |
| `process[]` | 진행 방식 카드 | 섹션을 숨김 | 요약 80자 |
| `faq[]` | 자주 묻는 질문 | 섹션을 숨김 | 답변 130자 |
| `contact.headline`, `contact.note` | 연락 섹션 왼쪽 제목과 본문 | 숨김 | 40자, 90자 |
| `contact.budgets[]` | 폼 예산 선택 | 필드를 숨김 | |

쓰지 않는 필드: `aboutImage`, `resumeFile`, `phone`, `testimonials`, `writing`, `openSource`, `now`, `uses`, 프로젝트의 `image`, `gallery`, `body`. 이 템플릿에는 법적 페이지가 없어 `features.legal` 도 영향이 없습니다.

## extras["kernel-dev"]

모두 선택 사항입니다. 없으면 괄호 안처럼 동작합니다.

| 키 | 쓰임 |
| --- | --- |
| `brand` | 내비 브랜드와 푸터 (`basics.handle`, 없으면 이름) |
| `terminal.whoami`, `.mission`, `.status` | 터미널 출력 (`label`, `headline`, `availability`) |
| `portraitNote` | 사진 캡션 둘째 줄 (숨김) |
| `locationNote` | 위치 줄 가운데 항목 (숨김) |
| `projectsIntro`, `projectsNote` | 프로젝트 섹션 소개와 맺음 줄 (숨김) |
| `processStages[]` | 진행 카드 번호 뒤 단계 이름 (번호만) |
| `projects.<slug>.path`, `.mock` | 프로젝트 터미널 면의 경로와 ASCII 그림 (`~/builds/<slug>`, 이름과 태그로 만든 출력) |

## 이미지

사진은 `public/profile/` 에 넣고 `/profile/photo.jpg` 처럼 적습니다. 정사각형 1200x1200 이상의 JPG, PNG, WebP 를 권장합니다. 화면에서는 가로 360px, 세로 310px 로 잘립니다.
