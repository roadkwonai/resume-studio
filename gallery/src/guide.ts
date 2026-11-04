export const steps = ["자료와 템플릿 확인", "profile.json 작성", "포트폴리오 생성", "검증", "결과 보고"];

type Scenario = { name: string; prompt: string; work: (string | null)[] };

export const scenarios: Scenario[] = [
  {
    name: "이력서 하나로 시작",
    prompt: "/resume-portfolio 이력서.pdf 로 Sawad 템플릿 사이트를 만들어 줘",
    work: [
      "이력서를 읽고 사용자가 말한 템플릿을 확인합니다. 말하지 않았다면 갤러리를 열어 고르게 합니다.",
      "이력서 내용을 규격에 맞춰 옮기고 형식을 검사합니다. 주소와 생년월일 같은 항목은 옮기지 않습니다.",
      "템플릿을 복사해 portfolios/<이름>/ 을 만들고 사진과 PDF를 넣습니다.",
      "빌드하고 데모 내용이 남았는지 찾은 뒤 1440px과 390px 화면을 직접 봅니다. 수치는 이력서 원문과 다시 맞춥니다.",
      "실행 주소, 자료가 없어 사라진 섹션, 일부러 뺀 개인정보를 알립니다.",
    ],
  },
  {
    name: "자료가 여러 개",
    prompt: "/resume-portfolio PDF 이력서와 노션 포트폴리오를 참고해서 핵심만 추려 줘",
    work: [
      "노션 공개 페이지는 브라우저로 스크롤하며 읽고, 실을 프로젝트의 하위 페이지만 엽니다.",
      "대표 프로젝트 4~6개를 고릅니다. 자료끼리 다른 값은 최신 자료를 쓰거나 화면에서 뺍니다.",
      "상세 페이지가 있으면 링크로 연결합니다. 뺀 프로젝트의 이름은 경력 설명에 남깁니다.",
      "빌드와 화면을 확인하고 수치와 고유명사를 자료 원문과 맞춥니다.",
      "달랐던 값과 고른 값, 고른 프로젝트와 뺀 프로젝트를 표로 알립니다.",
    ],
  },
  {
    name: "내용 수정",
    prompt: "/resume-portfolio 현재 회사를 추가하고 대표 수치를 고쳐 줘",
    work: [
      null,
      "portfolios/<이름>/content/profile.json 만 고칩니다.",
      null,
      "다시 빌드하고 이전 서버를 끈 뒤 새 서버로 화면을 확인합니다.",
      "바뀐 항목과 확인이 필요한 문장을 알립니다.",
    ],
  },
  {
    name: "템플릿 교체",
    prompt: "/resume-portfolio 같은 내용으로 Kernel Dev 버전도 만들어 줘",
    work: [
      "새 템플릿이 표시하는 항목과 표시하지 않는 항목을 확인합니다.",
      null,
      "같은 profile.json 으로 새 폴더를 만듭니다. 예전 폴더는 지우지 않습니다.",
      "빌드하고 두 화면 크기에서 줄바꿈과 빈 구역을 확인합니다.",
      "새 템플릿에서 보이지 않게 된 항목을 알립니다.",
    ],
  },
];

export const rules = [
  {
    title: "출처 없는 내용은 쓰지 않습니다",
    why: "채용 담당자는 사이트를 사실로 읽습니다. 문장은 다듬어도 사실은 늘리지 않습니다.",
    from: "이력서: 결제 시스템 개발",
    to: "결제 시스템을 개발했습니다",
    no: "수백만 사용자의 결제 시스템을 개발했습니다",
  },
  {
    title: "공개해도 되는 내용만 옮깁니다",
    why: "이력서는 회사에 내는 문서이고 사이트는 누구나 봅니다.",
    from: "주민등록번호, 집 주소, 생년월일, 가족 사항, 병역 세부, 연봉",
    to: "사이트에 옮기지 않습니다",
    no: "전화번호를 동의 없이 공개하는 일",
  },
  {
    title: "자료가 다르면 알립니다",
    why: "어느 값이 맞는지는 본인만 압니다. 고른 값을 말없이 넘기지 않습니다.",
    from: "자료 A: 기여도 70%, 자료 B: 기여도 100%",
    to: "기여도를 빼고 쓴 뒤 두 값을 보고합니다",
    no: "둘 중 큰 값을 그대로 쓰는 일",
  },
  {
    title: "핵심만 추립니다",
    why: "상세 내용은 이력서 파일과 링크가 맡습니다.",
    from: "프로젝트 14개",
    to: "대표 4~6개를 싣고 나머지는 경력 설명에 이름만 남깁니다",
    no: "회사 성과가 통째로 사라지는 일",
  },
  {
    title: "빈 항목은 숨깁니다",
    why: "자료가 없는 섹션은 메뉴까지 함께 사라집니다.",
    from: "후기 자료 없음",
    to: "후기 섹션과 메뉴를 표시하지 않습니다",
    no: "그럴듯한 후기를 지어내는 일",
  },
];

export const promptGroups = [
  {
    name: "처음 만들기",
    items: [
      {
        title: "이력서 파일로 시작",
        when: "가장 기본적인 요청입니다. 파일 경로와 템플릿 이름만 있으면 됩니다.",
        text: "/resume-portfolio ~/Documents/이력서.pdf 를 읽고\nStackbit OS 템플릿으로 내 이력서 사이트를 만들어 줘.",
      },
      {
        title: "템플릿 추천 받기",
        when: "어떤 템플릿이 맞는지 모를 때 씁니다. 자료 양을 보고 추천합니다.",
        text: "/resume-portfolio ~/Documents/이력서.pdf 를 보고\n내 자료 양에 맞는 템플릿을 추천해 줘.\n갤러리를 열어 주면 내가 직접 보고 고를게.",
      },
      {
        title: "지원 직무에 맞추기",
        when: "지원할 직무를 알려 주면 그 직무에 맞는 경력과 프로젝트를 앞에 둡니다.",
        text: "/resume-portfolio 이력서.docx 로 Nightly 사이트를 만들어 줘.\n백엔드 개발자 지원용이라 성능 개선 성과를 앞에 놓아 줘.\n수치는 이력서에 있는 값만 써.",
      },
      {
        title: "사진 없이 만들기",
        when: "프로필 사진을 쓰고 싶지 않을 때 씁니다.",
        text: "/resume-portfolio 아래 내용을 붙여 넣을게.\n사진 없이 Kernel Dev 템플릿으로 만들어 줘.\n\n(이력서 내용 붙여 넣기)",
      },
    ],
  },
  {
    name: "자료 활용",
    items: [
      {
        title: "이력서와 노션 함께 쓰기",
        when: "상세 자료가 많을 때 씁니다. 사이트에는 핵심만 싣고 상세 내용은 링크로 연결합니다.",
        text: "/resume-portfolio 이력서.pdf 와 노션 포트폴리오를 참고해 줘.\nhttps://notion.so/내-포트폴리오-주소\n내용이 많으니 대표 프로젝트만 추려 줘.\n자료끼리 다른 값은 표로 알려 줘.",
      },
      {
        title: "프로필 사진과 PDF 넣기",
        when: "사진과 내려받기용 PDF를 함께 넣을 때 씁니다.",
        text: "/resume-portfolio 사진은 ~/Pictures/profile.jpg 를 쓰고\n이력서 내려받기 버튼에는 이력서.pdf 를 연결해 줘.\nPDF에 전화번호나 주소가 남아 있으면 알려 줘.",
      },
      {
        title: "영어 사이트 만들기",
        when: "한국어 이력서로 영어 사이트를 만들 때 씁니다. 고유명사는 공식 표기를 씁니다.",
        text: "/resume-portfolio 한국어 이력서.pdf 를 바탕으로\n영어 사이트를 Soren Hale 템플릿으로 만들어 줘.\n회사와 서비스 이름은 공식 영문 표기를 찾아서 써.",
      },
    ],
  },
  {
    name: "수정과 교체",
    items: [
      {
        title: "경력 추가",
        when: "이미 만든 사이트의 내용만 바꿉니다.",
        text: "/resume-portfolio 내 포트폴리오에 현재 회사 경력을 추가해 줘.\n회사: ○○페이, 직무: 백엔드 개발자, 입사: 2026-03\n담당 업무: 정산 배치 개발",
      },
      {
        title: "문구 다듬기",
        when: "표현만 바꾸고 사실은 그대로 두라고 요청합니다.",
        text: "/resume-portfolio 첫 화면 문장과 소개 문단을 더 간결하게 다듬어 줘.\n사실은 바꾸지 말고 바뀐 문장을 전후로 보여 줘.",
      },
      {
        title: "템플릿 바꾸기",
        when: "같은 내용으로 다른 템플릿을 만들어 비교합니다.",
        text: "/resume-portfolio 지금 내용 그대로 Sawad 버전도 만들어 줘.\n새 템플릿에서 안 보이는 항목이 있으면 알려 줘.",
      },
    ],
  },
  {
    name: "점검과 배포",
    items: [
      {
        title: "공개 전 개인정보 점검",
        when: "사이트를 공개하기 전에 씁니다.",
        text: "/resume-portfolio 내 포트폴리오를 공개하기 전에 점검해 줘.\n사이트 문구와 내려받기 PDF에 전화번호, 주소, 생년월일이 있는지 찾아서 알려 줘.",
      },
      {
        title: "수치 대조",
        when: "사이트의 수치와 고유명사를 원문과 맞춥니다.",
        text: "/resume-portfolio 사이트의 수치와 회사 이름을 이력서.pdf 원문과 대조해 줘.\n원문에 없는 내용이 있으면 고치지 말고 먼저 목록으로 보여 줘.",
      },
      {
        title: "배포",
        when: "배포는 공개 행위라서 요청이 있을 때만 진행합니다.",
        text: "/resume-portfolio 내 포트폴리오를 Vercel에 배포해 줘.\n배포 전에 공개될 파일 목록과 개인정보 점검 결과를 먼저 보여 줘.",
      },
    ],
  },
];

const clone = "git clone https://github.com/roadkwonai/resume-studio.git\ncd resume-studio\nnpm install";

export const installs = [
  {
    name: "AI에게 맡기기",
    when: "Claude Code, Codex, Antigravity 중 쓰는 도구에 아래 문장을 보냅니다.",
    text: "https://github.com/roadkwonai/resume-studio 저장소를 내려받아 npm install 을 실행하고,\nnpm run skill:install 로 resume-portfolio 스킬을 설치해 줘.\n끝나면 npm run studio 로 템플릿 갤러리를 열어 줘.",
  },
  {
    name: "Claude Code",
    when: "저장소 폴더에서는 설치 없이 쓸 수 있습니다. 다른 폴더에서도 쓰려면 마지막 줄을 실행합니다. /resume-portfolio 로 부릅니다.",
    text: `${clone}\nnpm run skill:install -- claude`,
  },
  {
    name: "Codex",
    when: "저장소 폴더에서는 .agents/skills 를 자동으로 읽습니다. $resume-portfolio 로 부릅니다.",
    text: `${clone}\nnpm run skill:install -- codex`,
  },
  {
    name: "Antigravity",
    when: "저장소를 작업 공간으로 열면 .agents/skills 를 읽습니다. 요청에 resume-portfolio 를 적으면 확실하게 쓰입니다. 전역 설치 후에는 앱을 다시 시작합니다.",
    text: `${clone}\nnpm run skill:install -- antigravity`,
  },
  {
    name: "갤러리만 보기",
    when: "Node.js 24가 필요합니다. 처음 실행할 때는 빌드 때문에 몇 분 걸립니다.",
    text: `${clone}\nnpm run studio`,
  },
];

export const commands = [
  ["npm run studio", "갤러리와 템플릿 6종을 실행합니다. 주소는 localhost:4100입니다."],
  ["npm run new -- <템플릿> <이름> <profile.json>", "템플릿을 복사해 portfolios/<이름>/ 을 만듭니다."],
  ["npm run validate -- <파일>", "profile.json 의 형식을 검사합니다."],
  ["npm run verify -- <이름>", "형식, 프로덕션 빌드, 데모 내용 잔재를 한 번에 검사합니다."],
  ["npm run dev -w @resume/portfolio-<이름>", "내 포트폴리오를 개발 모드로 실행합니다."],
  ["npm run skill:install -- <도구>", "스킬을 claude, codex, antigravity 의 전역 폴더에 복사합니다. 도구를 적지 않으면 셋 다 설치합니다."],
  ["npm run pages", "GitHub Pages에 올릴 정적 사이트를 site/ 에 만듭니다."],
];
