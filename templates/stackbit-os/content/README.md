# stackbit-os 콘텐츠 안내

`profile.json` 만 바꾸면 사람이 바뀝니다. 문구는 `site.ko.json`, `site.en.json` 중 `profile.locale` 에 맞는 파일을 씁니다.
비어 있는 값은 화면에서 사라지고, 사라진 섹션은 내비에서도 빠지며 번호가 다시 매겨집니다.

| profile 필드 | 쓰는 곳 | 없을 때 | 권장 |
|---|---|---|---|
| `basics.name` | 프로필 제목(대문자), 푸터, 코드 샘플, CV 파일명 | 필수 | 20자 이내 |
| `basics.initials` | 로고와 부팅 문구의 `XX OS`, 헤더 식별 코드(`XX-연도-001`), 사진 대체 면 | 이름에서 계산 | 2~3자 |
| `basics.label` | 프로필 직함(대문자) | 필수 | 50자 이내 |
| `basics.headline` | 소개 섹션 제목 | 필수 | 60자 이내 |
| `basics.summary` | 메타 description | 필수 | 160자 이내 |
| `basics.about[]` | 소개 문단 | 필수 | 문단당 250자 이내, 2개 |
| `basics.email` | 연락처, 메일 폼 수신 주소, 코드 샘플 | 필수 | |
| `basics.photo`, `photoAlt` | 프로필 사진 | 이니셜 색면 | 세로형 1000×1030px 이상 |
| `basics.location.city`, `country` | 헤더, 연락처 | 숨김 | |
| `basics.location.mapUrl` | 위치 링크 | 링크 없이 글자만 | |
| `basics.location.timezone` | 헤더 시계(IANA 이름) | 시계 숨김 | `Asia/Seoul` |
| `basics.resumeFile` | 헤더 CV 다운로드 | 버튼 숨김 | `/profile/resume.pdf` |
| `basics.responseTime` | 프로필 사실 목록 | 줄 숨김 | 20자 이내 |
| `basics.availability` | 연락 문단, 코드 샘플의 `status` | 숨김 | 100자 이내 |
| `basics.profiles[]` | 연락처 목록(`network` 라벨, URL 주소 표시) | 숨김 | |
| `principles[]` | 원칙 목록, 두 열로 나눔 | 섹션 숨김 | 6개, 항목당 40자 이내 |
| `metrics[]` | 성과 지표 | 섹션 숨김 | 6개, 값 6자 이내 |
| `skills[]` | `progress` 가 있는 그룹은 막대 카드, 없는 그룹은 배지 패널 | 섹션 숨김 | 항목명 20자 이내 |
| `skills[].items[].level`, `years`, `icon` | 카드 보조 줄, 로고 | 숨김 | 아이콘 24×24px SVG |
| `work[]` | 경력 아코디언(기간, 직책 · 회사, `summary`) | 섹션 숨김 | `summary` 250자 이내 |
| `projects[]` | 프로젝트 카드(`name`, `date`, `summary`, `tags`) | 섹션 숨김 | `summary` 130자 이내 |
| `projects[].image`, `imageAlt` | 카드 이미지 | 이름 타이포 면 | 4:1, 1600×400px 이상 |
| `projects[].url`, `repo` | 카드 링크 | 링크 숨김 | |
| `openSource.stats[]`, `repos[]` | 오픈소스 섹션 | 둘 다 없으면 섹션 숨김 | 저장소 설명 100자 이내 |
| `contact.headline`, `note` | 연락 섹션 보조 문구, 첫 문단 | 숨김 | |
| `contact.budgets[]` | 폼 예산 선택 | 필드 숨김 | |

쓰지 않는 필드: `basics.phone`, `website`, `aboutImage`, `work[].highlights`, `tags`, `education`, `awards`, `services`, `process`, `testimonials`, `writing`, `faq`, `now`, `uses`, 프로젝트 상세 필드(`problem`, `body` 등). 이 템플릿은 한 페이지짜리라 법적 페이지가 없어 `features.legal` 도 쓰지 않습니다.

공개 저장소 섹션의 LED 판은 실제 기여 데이터가 아닌 장식입니다. 그래서 제목을 "신호 패턴"으로 두었습니다.

## extras["stackbit-os"]

모두 선택 사항입니다.

| 키 | 쓰는 곳 | 없을 때 |
|---|---|---|
| `osName` | 로고, 부팅 문구, 푸터의 `XX OS` | 이니셜 |
| `siteTitle` | 브라우저 제목 | `이름 · 직함` |
| `experience`, `focus` | 프로필 사실 목록 | 줄 숨김 |
| `quote` | 소개 끝 강조 문장 | 숨김 |
| `codeStack` | 코드 샘플의 `stack` | 앞의 기술 3개 |
| `codeStatus` | 코드 샘플의 `status` | `basics.availability`, 그것도 없으면 줄 삭제 |
| `codeEmail` | 코드 샘플의 메일 | `basics.email` |
| `globeMarker` | 지구본 위치 점 `[경도, 위도]` | 점 없이 회전 |
| `caseStudies` | 프로젝트 슬러그별 사례 링크 | 링크 숨김 |

## 이미지

사용자 파일은 `public/profile/` 에 두고 `/profile/...` 경로로 적습니다. 사진과 프로젝트 이미지는 `next/image` 를 쓰므로 PNG, JPG, WebP 를 권장합니다. 헤더 식별 코드와 푸터 연도는 빌드한 해를 씁니다.
