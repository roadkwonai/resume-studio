import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { commands, rules } from "@/guide";
import { REPO, templates } from "@/templates";
import { Install, Prompts, Steps } from "./Choices";
import { Sheet } from "./Sheet";

const SKILL = `${REPO}/blob/main/.claude/skills/resume-portfolio/SKILL.md`;

function Head({ no, title, children }: { no: string; title: string; children: React.ReactNode }) {
  return (
    <header className="section-head">
      <span className="section-no">{no}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <nav className="topnav" aria-label="주요 메뉴">
        <Link href="/" className="wordmark">
          Resume Studio
        </Link>
        <div className="topnav-links">
          <a href="#templates">템플릿</a>
          <a href="#how">작동 방식</a>
          <a href="#rules">규칙</a>
          <a href="#prompts">프롬프트</a>
          <a href="#install">설치</a>
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <div className="shell">
        <header className="hero">
          <div>
            <h1>이력서를 웹사이트로 만듭니다</h1>
            <p className="standfirst">템플릿을 고르고 이력서, 사진, 포트폴리오 자료를 전달하면 AI가 웹 이력서를 만듭니다.</p>
            <div className="actions">
              <a className="primary" href="#templates">
                템플릿 보기
              </a>
              <a className="quiet" href="#install">
                설치 방법
              </a>
            </div>
          </div>
          <ol className="flow" aria-label="사용 순서">
            <li>
              <span>1</span>
              <div>
                <h2>템플릿 고르기</h2>
                <p>실제 화면을 비교하고 마음에 드는 템플릿을 고릅니다.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h2>자료 전달하기</h2>
                <p>이력서, 프로필 사진, 포트폴리오 주소와 프로젝트 정보를 AI에 전달합니다.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h2>사이트 확인</h2>
                <p>AI가 내용을 옮기고 검사한 뒤 결과를 알려 줍니다.</p>
              </div>
            </li>
          </ol>
        </header>

        <section id="templates">
          <Head no="01" title={`템플릿 ${templates.length}종`}>
            이미지에 마우스를 올리면 페이지 전체를 볼 수 있고, 클릭하면 실제 사이트가 열립니다.
          </Head>
          <Sheet />
          <table className="ledger">
            <caption>템플릿 비교</caption>
            <thead>
              <tr>
                <th scope="col">템플릿</th>
                <th scope="col">추천 대상</th>
                <th scope="col">구성</th>
                <th scope="col">준비 자료</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id}>
                  <th scope="row">
                    <Link href={`/preview/${t.id}`}>{t.name}</Link>
                  </th>
                  <td data-label="추천 대상">{t.fit}</td>
                  <td data-label="구성">{t.pages}</td>
                  <td data-label="준비 자료">{t.needs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="how">
          <Head no="02" title="스킬이 하는 일">
            resume-portfolio 스킬은 제공한 자료로 웹 이력서를 만들고 결과를 확인합니다. 상황을 선택하면 단계별 작업을 볼 수 있습니다.
          </Head>
          <Steps />
        </section>

        <section id="rules">
          <Head no="03" title="스킬이 지키는 규칙">
            웹 이력서를 만들 때 다음 다섯 가지 원칙을 지킵니다.
          </Head>
          <ul className="rules">
            {rules.map((rule) => (
              <li key={rule.title}>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.why}</p>
                </div>
                <dl>
                  <dt>자료</dt>
                  <dd>{rule.from}</dd>
                  <dt>처리</dt>
                  <dd>{rule.to}</dd>
                  <dt>하지 않는 일</dt>
                  <dd>{rule.no}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section id="prompts">
          <Head no="04" title="샘플 프롬프트">
            상황에 맞는 문장을 복사해 파일 경로만 바꾸면 됩니다. Codex에서는 앞부분을 $resume-portfolio 로 바꿉니다.
          </Head>
          <Prompts />
        </section>

        <section id="install">
          <Head no="05" title="설치">
            Claude Code, Codex, Antigravity에서 사용할 수 있습니다. 저장소를 열면 스킬을 바로 사용할 수 있습니다.
          </Head>
          <Install />
          <p className="note">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>
              생성한 프로젝트의 프로필, 사진, PDF와 환경 파일은 기본적으로 Git에서 제외됩니다.
            </span>
          </p>
          <table className="ledger">
            <caption>명령어</caption>
            <thead>
              <tr>
                <th scope="col">명령</th>
                <th scope="col">하는 일</th>
              </tr>
            </thead>
            <tbody>
              {commands.map(([command, what]) => (
                <tr key={command}>
                  <th scope="row">
                    <code>{command}</code>
                  </th>
                  <td data-label="하는 일">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="eval">
          <Head no="06" title="스킬 평가">
            같은 가상 자료를 스킬 보완 전후 버전에 주고 결과를 비교했습니다. 자료 충돌과 오래된 템플릿 선택을 다루는 평가 2건입니다.
          </Head>
          <dl className="scores">
            <div>
              <dt>보완 후</dt>
              <dd>24/24</dd>
            </div>
            <div>
              <dt>보완 전</dt>
              <dd>22/24</dd>
            </div>
          </dl>
          <p className="limits">평가별로 1회만 실행했고 빌드와 화면 확인 단계는 제외했습니다. 검사 항목 통과 수이며 사이트 품질 점수가 아닙니다.</p>
        </section>
      </div>

      <footer className="foot">
        <p>Resume Studio</p>
        <a href={REPO} target="_blank" rel="noreferrer">
          GitHub 저장소
          <ArrowRight size={14} aria-hidden="true" />
        </a>
        <a href={SKILL} target="_blank" rel="noreferrer">
          <BookOpen size={14} aria-hidden="true" />
          스킬 원문
        </a>
        <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
          MIT 라이선스
        </a>
      </footer>
    </>
  );
}
