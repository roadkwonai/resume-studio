# soren-hale 콘텐츠 안내

`profile.json` 만 바꾸면 사이트 전체가 바뀐다. 형식은 `src/lib/profile.ts` 의 `Profile`. 사람과 무관한 UI 문구는 `site.ko.json`, `site.en.json` 에 있고 `locale` 로 고른다. 비어 있는 값은 화면에서 사라지고, 라우트가 통째로 비면 내비와 푸터 링크도 사라지며 404 가 된다.

## 필드별 사용처

| Profile 필드 | 쓰는 곳 | 권장 글자 수 |
|---|---|---|
| `locale` | `<html lang>`, site 파일 선택 | |
| `basics.name` | 로고, 푸터 대형 워드마크, 이력서 제목, 로더, 메타데이터 | 한글 2~6자, 영문 20자 이내 |
| `basics.label` | 히어로 눈썹글, 이력서, 푸터, 로더 | 30자 |
| `basics.headline` | 히어로 제목, 소개 페이지 제목. 마지막 단어가 강조색 | 한글 30자, 영문 60자 |
| `basics.summary` | 히어로 문단, 이력서 요약, 메타 설명, 소개 페이지 리드 | 120자 |
| `basics.about[0]` | 홈 소개의 큰 문장. 마지막 단어가 강조색 | 150자 |
| `basics.about[1..]` | 소개 페이지 이야기 행(`extras` 의 `story` 가 없으면 `about` 전체) | 문단당 200자 |
| `basics.email` | 푸터, 연락 페이지, 폼 수신 주소, 이력서 | |
| `basics.phone`, `basics.location.city` | 연락 페이지, 이력서, 푸터 | |
| `basics.location.timezone` | 푸터 현지 시각(IANA 이름), 마퀴 아래 정보 | |
| `basics.availability` | 헤더 상태, 푸터, 마퀴 아래, /now | 25자 |
| `basics.responseTime` | 연락 페이지, FAQ 카드, 감사 페이지 | 30자 |
| `basics.photo`, `photoAlt` | 히어로 사진. 코드 글자 효과가 이 사진에서 밝기를 읽는다. 없으면 이니셜 면 | |
| `basics.aboutImage`, `aboutImageAlt` | 홈 소개, 소개 페이지. 없으면 `photo`, 그것도 없으면 이니셜 면 | |
| `basics.resumeFile` | "이력서 받기" 버튼. 없으면 /resume 으로 가고 그 페이지에서 인쇄 | |
| `basics.profiles` | 푸터, 모바일 메뉴 | |
| `metrics` | 히어로 수치 앞 3개, 소개 페이지 수치. `9년`, `42%` 처럼 숫자로 시작하면 카운트업 | 값 6자, 라벨 16자 |
| `principles` | 소개 페이지 원칙 | 항목당 30자 |
| `work` | 홈 경력(앞 6개), 이력서. `end` 가 없으면 현재 | 요약 120자 |
| `education`, `awards` | 이력서 | |
| `skills` | 홈 키보드, /stack, 이력서. `years`, `level`, `note` 사용 | 이름 16자 |
| `projects` | 홈(`featured` 우선, 최대 5개), /work, /work/[slug], 마퀴(`client`) | 요약 90자 |
| `projects[].metrics[0]` | 전후 비교 수치 | |
| `projects[].problem`, `solution`, `result`, `body` | 상세 페이지 본문(마크다운) | |
| `services` | 홈, /services, 상세, 폼 선택지 | 태그라인 70자 |
| `process` | /process | 요약 140자 |
| `testimonials` | 홈, /reviews, 소개, 서비스. 아바타가 없으면 이름 첫 글자 | 인용 180자 |
| `writing` | 홈, /writing, 상세 | 요약 90자 |
| `openSource.repos` | 홈, /lab, /lab/[slug]. `slug` 가 없으면 `repo-1` 처럼 번호로 만든다 | 요약 90자 |
| `openSource.stats` | /lab 수치. 없으면 프로젝트 수만 | |
| `faq` | 홈, /faq, 연락, 과정 | 답변 200자 |
| `now` | /now, 홈 소개 아래(앞 4개, 제목이 라벨) | |
| `uses` | /uses | 메모 100자 |
| `contact.headline`, `note` | 연락 페이지와 CTA 제목, 연락 페이지 리드 | 제목 30자 |
| `contact.budgets` | 예산 선택지. 없으면 필드가 사라진다 | |
| `features.legal` | true 일 때만 /privacy, /terms, /cookies 노출 | |

## extras["soren-hale"]

전부 선택 사항이다. 없으면 그 부분만 숨거나 기본 문구를 쓴다.

| 키 | 내용 |
|---|---|
| `heroLines` | 히어로 제목 줄바꿈 고정. `*단어*` 는 강조색 |
| `eyebrow` | 히어로 눈썹글(기본 `basics.label`) |
| `commits.home`, `now`, `stack` | 가짜 커밋 카드 |
| `facts.about`, `work`, `services`, `writing` | 각 페이지 상단 수치 |
| `bench` | 홈 점수와 Web Vitals 섹션. 없으면 섹션 전체가 사라진다 |
| `story` | 소개 이야기 행의 시기와 제목. `about[1..]` 과 순서로 짝을 맞춘다 |
| `principleNotes` | 원칙 설명, `principles` 와 같은 순서 |
| `now` | `updated`, `line`, `rows`, `dates` |
| `process` | 단계별 `when`, `get` |
| `services.<slug>` | 단계별 `when`, `summary` 와 서비스 FAQ |
| `stackLevels` | /stack 숙련도 범례 |
| `repoAlts`, `jobKeys` | 저장소 이미지 alt, 경력 해시 키 |
| `languages`, `talks` | 이력서 블록 |
| `uses` | `links`(항목 이름별 링크), `config`(코드 블록) |
| `copy` | site 파일의 키를 사람별 문구로 덮어쓴다. 예: `{ "work": { "heading": "..." } }` |

## 이미지

사용자 파일은 `public/profile/` 에 두고 `/profile/photo.jpg` 처럼 적는다. `public/sites/` 는 템플릿 장식과 데모 인물 파일이다.

| 용도 | 권장 크기 |
|---|---|
| `photo` | 1200×1500, 어두운 배경, 얼굴이 위쪽 |
| `aboutImage` | 1200×1500 |
| `projects[].image` | 1600×1000 |
| `projects[].gallery` | 1600×1200, 두 장 권장 |
| `writing[].image` | 1600×1000 |
| `openSource.repos[].image` | 1600×1000 |
| `testimonials[].avatar` | 160×160 |

프로젝트, 글, 저장소에 이미지가 없으면 이름을 크게 얹은 격자 면으로 대체한다.

## 폼

서버가 없어서 연락 폼은 방문자의 메일 앱을 `basics.email` 로 연다.
