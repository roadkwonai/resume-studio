export type Template = {
  id: string;
  no: string;
  name: string;
  port: number;
  tone: string;
  blurb: string;
  fit: string;
  pages: string;
  palette: string;
  needs: string;
  start?: number; // where the strip rests, as a share of the page, when the top is mostly empty
};

export const templates: Template[] = [
  {
    id: "stackbit-os",
    no: "1",
    name: "Stackbit OS",
    port: 4101,
    tone: "운영체제 콘셉트의 개발자 이력서",
    blurb: "부팅 화면, 실시간 시계, 회전하는 지구본, 기술별 숙련도를 한 페이지에 보여 줍니다.",
    fit: "기술 스택과 오픈소스 활동을 강조하려는 풀스택 개발자",
    pages: "단일 페이지, 9개 섹션",
    palette: "어두운 배경과 형광색 포인트",
    needs: "프로필 사진 1장, 프로젝트 이미지 2~4장",
  },
  {
    id: "soren-hale",
    no: "2",
    name: "Soren Hale",
    port: 4102,
    tone: "사례와 글 중심의 프리랜서 사이트",
    blurb: "프로젝트 사례, 서비스, 글, 오픈소스까지 담는 가장 큰 구성입니다. 내용이 없는 페이지는 자동으로 숨겨집니다.",
    fit: "프로젝트 사례와 글이 충분한 시니어 개발자, 프리랜서",
    pages: "다중 페이지, 22개 화면",
    palette: "검은 배경과 연두색 포인트",
    needs: "프로필 사진 1장, 프로젝트별 대표 이미지",
  },
  {
    id: "sawad",
    no: "3",
    name: "Sawad",
    port: 4103,
    tone: "간결한 자기소개 사이트",
    blurb: "소개, 프로젝트, 경력, 도구, 글을 작은 카드로 정리합니다. 내용이 적어도 허전해 보이지 않습니다.",
    fit: "경력이 짧거나 빠르게 공개하려는 디자이너, 개발자",
    pages: "다중 페이지, 6개 화면",
    palette: "어두운 배경과 밝은 카드",
    needs: "프로필 사진 1장, 프로젝트 썸네일",
  },
  {
    id: "nightly",
    no: "4",
    name: "Nightly",
    port: 4104,
    tone: "성과 수치 중심의 사례집",
    blurb: "스크롤에 따라 장면이 바뀌고, 프로젝트별 개선 전후 수치를 크게 보여 줍니다.",
    fit: "측정 가능한 성과가 있는 엔지니어, 컨설턴트",
    pages: "다중 페이지, 11개 화면",
    palette: "검은 배경과 큰 글자",
    needs: "프로젝트별 개선 전후 수치, 대표 이미지",
    start: 0.55,
  },
  {
    id: "kernel-dev",
    no: "5",
    name: "Kernel Dev",
    port: 4105,
    tone: "터미널 콘셉트의 단일 페이지 이력서",
    blurb: "모든 내용을 터미널 출력처럼 표현합니다. 사진 없이도 완성할 수 있습니다.",
    fit: "사진 없이 글로만 구성하려는 개발자",
    pages: "단일 페이지",
    palette: "검은 배경과 초록색 글자",
    needs: "사진 불필요",
  },
  {
    id: "fastfolio",
    no: "6",
    name: "Fastfolio",
    port: 4106,
    tone: "사진과 카드 중심의 깔끔한 개발자 이력서",
    blurb: "큰 인물 사진, 기술 알약, 프로젝트 카드, 여닫는 경력, 흐르는 후기를 한 페이지에 담습니다.",
    fit: "프로젝트 이미지와 후기가 있는 프론트엔드 개발자",
    pages: "단일 페이지, 6개 섹션",
    palette: "어두운 회색 배경과 흰색 버튼",
    needs: "프로필 사진 1장, 프로젝트 이미지 2~4장",
  },
];

export const byId = (id: string) => templates.find((t) => t.id === id);

// Set only in the GitHub Pages build, where the templates are static folders and nothing can save a selection.
export const BASE = process.env.NEXT_PUBLIC_BASE ?? "";
export const IS_PUBLIC = BASE !== "";
export const REPO = "https://github.com/roadkwonai/resume-studio";
export const previewUrl = (t: Template) => (IS_PUBLIC ? `${BASE}/templates/${t.id}/` : `http://localhost:${t.port}/`);
