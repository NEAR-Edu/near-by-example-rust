import marked from "marked";
import { useState } from "react";
import Editor from "../editor/Editor";
import styles from "./Explaination.module.scss";

const Explaination = ({ className, explaination }) => (
  <section
    className={className}
    dangerouslySetInnerHTML={{ __html: marked(explaination) }}
  ></section>
);

const ExplainationCode = ({ explaination, testCode }) => (
  <>
    <Explaination className={styles.explaination} explaination={explaination} />
    <Editor className={styles.testCode} code={testCode} />
  </>
);

const OnlyExplaination = ({ explaination }) => (
  <Explaination className={styles.only} explaination={explaination} />
);

const OnlyTests = ({ testCode }) => (
  <Editor className={styles.only} code={testCode} />
);

const OnlyStdout = ({ stdout }) => <pre className={styles.only}>{stdout}</pre>;

export default function ExplainationTabs({ explaination, testCode, stdout }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const tabs = [
    { Component: ExplainationCode, label: "Explaination And Tests" },
    { Component: OnlyExplaination, label: "Explaination" },
    { Component: OnlyTests, label: "Tests" },
    { Component: OnlyStdout, label: "stdout" },
  ];

  const { Component } = tabs[currentTabIndex];

  return (
    <section className={styles.Explaination}>
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
        explaination={explaination}
        testCode={testCode}
        stdout={stdout}
      />
    </section>
  );
}
