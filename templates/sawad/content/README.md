# Sawad 콘텐츠 안내

`profile.json` 만 바꾸면 사이트 전체가 바뀝니다. 언어는 `profile.locale` 로 고르고, UI 문구는 그에 맞는 `site.ko.json` 또는 `site.en.json` 에서 옵니다. 값이 비면 그 자리는 사라집니다.

## 필드와 쓰이는 곳

| profile 필드 | 쓰이는 곳 | 권장 글자 수 | 비었을 때 |
|---|---|---|---|
| `locale` | `<html lang>`, UI 문구, 날짜 형식 | `ko` 또는 `en` | 필수 |
| `basics.name` | 프로필 카드 이름, 푸터, 기본 페이지 제목 | 14자 이내(넘으면 말줄임) | 필수 |
| `basics.label` | 히어로 큰 제목. 마지막 단어가 흐린 둘째 줄이 된다 | 단어 2~3개 | 필수 |
| `basics.headline` | 프로필 카드 소개 | 45자 이내(3줄까지 표시) | 필수 |
| `basics.summary` | 히어로 본문, 기본 메타 설명 | 140자 이내 | 필수 |
| `basics.email` | 문의 폼이 여는 메일의 받는 주소 | | 필수 |
| `basics.photo`, `photoAlt` | 프로필 카드 사진, OG 이미지 | | 이니셜 색면 |
| `basics.initials` | 사진이 없을 때의 이니셜 | 2자 | 이름에서 계산 |
| `basics.profiles[]` | 프로필 카드 소셜 아이콘. `network` 로 아이콘을 고른다 | 5개 이내 | 아이콘 줄 숨김 |
| `metrics[]` | 히어로 숫자. `label` 의 마지막 단어는 둘째 줄이 된다 | 3개, `value` 5자 이내 | 숨김 |
| `principles[0]`, `[1]` | 히어로 주황, 연두 카드 문구 | 각 30자 이내 | 없는 카드 숨김 |
| `projects[]` | 홈(앞 3개), `/projects` | | 섹션, 내비, 라우트 숨김 |
| `projects[].name`, `kind` | 행 제목과 설명. `kind` 가 없으면 `summary` | `kind` 40자 이내 | |
| `projects[].url`, `repo` | 행 링크. `url` 우선 | | 링크 없는 행 |
| `projects[].image`, `imageAlt` | 썸네일 | | 프로젝트 이름 색면 |
| `work[]` | 홈(앞 3개), `/experience` | | 섹션, 내비, 라우트 숨김 |
| `work[].company`, `summary` | 행 제목과 본문 | `summary` 140자 이내 | |
| `work[].start`, `end` | 기간. `end` 가 없으면 "현재" | | |
| `work[].url` | 행 링크 | | 링크 없는 행 |
| `skills[].items[]` | 홈, `/tools` 도구 카드. 모든 그룹을 이어서 표시 | | 섹션, 내비, 라우트 숨김 |
| `skills[].items[].name` | 카드 제목 | 14자 이내 | |
| `skills[].items[].note` | 카드 설명. 없으면 그룹 이름 | 24자 이내 | |
| `skills[].items[].icon` | 카드 아이콘 | | 이니셜 칩 |
| `skills[].items[].url` | 카드 링크 | | 링크 없는 카드 |
| `writing[]` | 홈(앞 3개), `/blog`, `/blog/<slug>` | | 섹션, 내비, 라우트 숨김 |
| `writing[].title`, `summary` | 행 제목과 본문 | 제목 60자, 요약 160자 이내 | |
| `writing[].date`, `readingTime` | 날짜(YYYY-MM-DD), 읽는 시간 | | 읽는 시간 숨김 |
| `writing[].image`, `imageAlt` | 글 상단 표지 | | 표지 숨김 |
| `writing[].body` | 글 본문 마크다운: 제목, 문단, `-` 목록, 코드 블록, 굵게, 기울임, 링크, 인라인 코드 | | 필수 |
| `contact.headline` | 문의 제목(없으면 site 문구). 마지막 단어가 둘째 줄이 된다 | 16자 이내 | site 문구 |
| `contact.note` | 문의 제목 아래 문장 | 80자 이내 | 숨김 |
| `contact.budgets[]` | 폼 예산 선택지 | | 예산 필드 숨김 |

이 템플릿에 자리가 없어 쓰지 않는 필드: `basics.about`, `phone`, `website`, `location`, `availability`, `responseTime`, `resumeFile`, `work[].position`, `highlights`, `tags`, `education`, `awards`, `services`, `process`, `testimonials`, `openSource`, `faq`, `now`, `uses`, `projects[]` 의 상세 필드. 법적 페이지가 없어서 `features.legal` 도 쓰지 않습니다.

## 소셜 아이콘

`network` 는 대소문자를 가리지 않습니다. 전용 아이콘: `dribbble`, `twitter`, `x`, `instagram`, `youtube`, `github`, `linkedin`. 그 밖의 값은 일반 링크 아이콘이 됩니다.

## extras.sawad (모두 선택)

| 키 | 쓰이는 곳 | 없을 때 |
|---|---|---|
| `siteTitle` | 페이지 제목 | `basics.name` |
| `siteDescription` | 메타 설명 | `basics.summary` |
| `ogImage` | 공유 이미지 | `basics.photo`, 그것도 없으면 없음 |
| `headings.<projects, experience, tools, blog, contact>` | 섹션 제목 두 줄, `["첫 줄", "둘째 줄"]` | site 문구 |
| `footerCredit` | 푸터 문구 조각 `[{ "text": "...", "url": "..." }]` | `© 이름` |

## 이미지

파일은 `public/profile/` 에 넣고 `/profile/파일이름` 으로 적습니다. 외부 URL과 SVG는 `next/image` 설정 없이는 쓸 수 없습니다.

| 자리 | 권장 크기 |
|---|---|
| `basics.photo` | 520 x 616, 세로형 |
| `projects[].image` | 260 x 270 |
| `skills[].items[].icon` | 120 x 120 |
| `writing[].image` | 1392 x 920 |
| `extras.sawad.ogImage` | 1200 x 630 |
