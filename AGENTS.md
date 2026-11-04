# Resume Studio

`README.md` 가 구조를 설명합니다. 작업 전에 읽으세요.

- Next.js 16 입니다. 코드를 쓰기 전에 `node_modules/next/dist/docs/` 의 관련 문서를 확인합니다.
- 사람에 관한 내용은 `content/profile.json` 에만 둡니다. 컴포넌트에 쓰지 않습니다.
- `src/lib/profile.ts` 는 `shared/profile.ts` 의 복사본입니다. `shared/` 를 고치고 `npm run sync` 를 실행합니다.
- 통합 웹 디자인은 신문 지면처럼 절제된 구성을 따르되 글꼴은 Pretendard, 아이콘은 lucide-react 를 씁니다. 고칠 때는 hallmark 로 검사합니다.
- 한국어 문구는 합쇼체로 쓰고 비유나 직역투를 피합니다. 제목과 라벨에는 마침표를 찍지 않습니다.
- 이력서 사이트 요청은 `.agents/skills/resume-portfolio/SKILL.md` 를 읽고 따릅니다. 원본은 `.claude/skills/` 에 있고 고친 뒤 `npm run sync` 로 맞춥니다.
- 공개 저장소입니다. `portfolios/`, PDF, 사진, 연락처 같은 개인 자료는 커밋하지 않습니다. 정적 사이트는 `npm run pages` 로 만듭니다.
