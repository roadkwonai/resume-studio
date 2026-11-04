# Nightly 콘텐츠 안내

`profile.json` 만 바꾸면 사이트 전체가 바뀝니다. 형태는 `src/lib/profile.ts` 의 `Profile` 입니다. `site.ko.json`, `site.en.json` 은 사람과 무관한 UI 문구이고 `profile.locale` 로 고릅니다.
값이 비어 있으면 그 자리는 사라집니다. 내비, 푸터 링크도 함께 사라지고 해당 라우트는 404 가 됩니다.

## 필드가 쓰이는 곳

| 필드 | 쓰이는 곳 | 권장 |
| --- | --- | --- |
| `locale` | `<html lang>`, UI 문구, 날짜 형식 | `ko` 또는 `en` |
| `basics.name` | 내비 로고, 푸터, 저작권 줄, 모든 페이지 title, 글 작성자 | 20자 이내 |
| `basics.label`, `location.city` | 기본 title, 글 작성자 줄, 소개 페이지 제목 | 각 20자 이내 |
| `basics.headline` | 첫 화면 마지막 문장, 소개 페이지 제목 둘째 줄 | 30자 이내 |
| `basics.summary` | 메타 설명, 첫 화면 초안, 홈 소개 문장, 푸터 소개 | 120자 이내 |
| `basics.about` | 소개 페이지 이야기(첫 문단은 크게), 앞 두 문단은 홈 이야기 | 문단당 200자 이내 |
| `basics.email` | 푸터, 메뉴, 연락 페이지, 폼 받는 주소 | |
| `basics.phone` | 연락 페이지 | |
| `basics.availability` | 홈 사실 줄, 연락 페이지, 행동 유도 문장 | 20자 이내 |
| `basics.responseTime` | 푸터, 연락 페이지, 행동 유도 문장 | 30자 이내 |
| `basics.aboutImage` (없으면 `photo`) | 홈 사각형 공개 사진, 소개 페이지 사진. 없으면 이니셜 색면 | 2400×1600 |
| `basics.resumeFile` | 소개 페이지 이력서 버튼 | `/profile/resume.pdf` |
| `basics.profiles` | 푸터 다른 곳 열. `network` 가 링크 글자 | 5개 이내 |
| `work` | 소개 페이지 경력 | `summary` 100자 이내 |
| `skills` | 소개 페이지 도구(이름을 쉼표로 이음) | |
| `process` | 소개 페이지 일하는 방식 | 3개 |
| `projects` | 홈 주요 작업, 작업 페이지, 상세 페이지 | |
| `services` | 홈 갈래 카드, 서비스 페이지, 상세, 폼 선택지 | 4개 이내, `summary` 80자 이내 |
| `testimonials` | 홈 후기 | |
| `writing` | 홈 글 목록, 글 페이지, 상세 | |
| `faq` | 서비스 페이지 | 서비스가 없으면 보이지 않음 |
| `contact.headline`, `contact.note` | 행동 유도 영역, 연락 페이지 머리말 | 40자, 100자 이내 |
| `contact.budgets` | 폼 예산 선택. 없으면 필드가 숨음 | |
| `features.legal` | `true` 일 때만 개인정보, 약관 페이지와 링크 노출 | |

쓰지 않는 필드: `metrics`, `principles`, `education`, `awards`, `openSource`, `now`, `uses`, `basics.handle`, `basics.website`.

## 프로젝트 필드

| 필드 | 쓰이는 곳 |
| --- | --- |
| `metrics[0]` | 숫자 장면 전부. `label` 은 측정 항목, `before` 는 지워지는 값, `after` 는 새 값 |
| `summary`, `kind`, `date` | 목록과 상세 머리말 |
| `client`, `role`, `timeline`, `tags` | 상세 정보 표. `tags` 는 사용 기술로 이어 붙임 |
| `url`, `repo` | 상세 정보 표 링크 |
| `problem`, `solution`, `result` | 상세의 문제, 한 일, 달라진 점 |
| `body` | 상세의 기록(마크다운 제목, 문단, 목록, 코드 블록) |
| `image`, `imageAlt` | 첫 화면 카드, 목록 썸네일, 상세 이미지. 없으면 프로젝트 이름 타이포 면. 2400×1500 |
| `gallery` | 두 장(태블릿, 휴대폰)이 있고 `image` 도 있으면 폭이 접히는 장면이 나타남. 1440×900 |
| `featured` | 첫 화면 마지막 단계에 쓸 프로젝트. 없으면 첫 프로젝트 |

`metrics` 값은 10자 이내가 좋습니다. `96 ms`, `31%`, `4시간` 처럼 숫자로 시작하면 숫자와 단위로 나뉩니다.

`metrics` 가 없을 때:
- 작업 목록의 숫자 줄은 프로젝트 요약으로 바뀝니다.
- 상세의 큰 숫자가 사라집니다.
- 첫 화면의 숫자 단계가 사라집니다.
- 닫는 장면은 `before` 가 있는 프로젝트가 하나도 없으면 사라지고 일반 연락 영역이 나옵니다.

숫자는 입력한 값만 보여 줍니다. 계산하거나 채워 넣지 않습니다.

## extras.nightly (모두 선택)

없어도 동작합니다. 이 템플릿의 문장을 더 다듬고 싶을 때만 씁니다.

| 키 | 없을 때 |
| --- | --- |
| `drafts` `[{message, when, text}]` 2개 이상 | `summary` 첫 문장에서 `headline` 으로 줄어드는 단계 |
| `statement` `[앞, 흐린 뒤]` | `summary` |
| `homeStory` | `about` 앞 두 문단 |
| `place` | `location.city` |
| `workingAs` | `label` |
| `takingOn`, `resumeNote` | 숨김(`resumeFile` 이 있으면 이력서 줄은 표시) |
| `hours` | `responseTime` |
| `footerNote` | `summary` |
| `tools` | `skills` 이름 목록 |
| `contactRest` | 숨김 |
| `moved` `{before, after}` | site 문구 |
| `pages.<work, about, services, writing, contact>` `{lead, rest, text}` | site 문구 또는 프로필 값 |
| `form` `{namePlaceholder, messageLabel, messagePlaceholder}` | site 문구, 빈 안내 |
| `projects.<slug>` `{note, line, next}` | `note`, `line` 은 `metrics` 로 조립, `next` 는 목록 순서 |
| `services.<slug>.fit` | 숨김 |
| `ogImage` | `aboutImage`, 없으면 없음 |

## 이미지

사용자 파일은 `public/profile/` 에 두고 `/profile/파일.jpg` 로 적습니다. jpg, png, webp 를 쓰세요. SVG 는 `next/image` 가 기본으로 막습니다. `public/sites/nightly/` 의 사진은 데모 인물 것이고 `profile.json` 이 가리킬 때만 보입니다.
