import marked from "marked";
import { useState } from "react";
import Editor from "../editor/Editor";
import styles from "./Explanation.module.scss";

const Explanation = ({ className, explanation }) => (
  <section
    className={className}
    dangerouslySetInnerHTML={{ __html: marked(explanation) }}
  ></section>
);

const ExplanationCode = ({ explanation, testCode }) => (
  <>
    <Explanation className={styles.explanation} explanation={explanation} />
    <Editor className={styles.testCode} code={testCode} />
  </>
);

const OnlyExplanation = ({ explanation }) => (
  <Explanation className={styles.only} explanation={explanation} />
);

const OnlyTests = ({ testCode }) => (
  <Editor className={styles.only} code={testCode} />
);

const OnlyStdout = ({ stdout }) => <pre className={styles.only}>{stdout}</pre>;

export default function ExplanationTabs({ explanation, testCode, stdout }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const tabs = [
    { Component: ExplanationCode, label: "Explanation And Tests" },
    { Component: OnlyExplanation, label: "Explanation" },
    { Component: OnlyTests, label: "Tests" },
    { Component: OnlyStdout, label: "stdout" },
  ];

  const { Component } = tabs[currentTabIndex];

  return (
    <section className={styles.Explanation}>
      <nav className={styles.tabs}>
        {tabs.map(({ label }, index) => (
          <button
            className={index === currentTabIndex ? styles.active : ""}
            key={index}
            onClick={() => setCurrentTabIndex(index)}
          >
            {label}
          </button>
        ))}
      </nav>
      <Component
        explanation={explanation}
        testCode={testCode}
        stdout={stdout}
      />
    </section>
  );
}
