import { useState } from "react";
import Editor from "../editor/Editor";
import styles from "./Explaination.module.scss";

const ExplainationCode = ({ explaination, testCode }) => (
  <>
    <section className={styles.explaination}>{explaination}</section>
    <Editor className={styles.testCode} code={testCode} />
  </>
);

const OnlyExplaination = ({ explaination }) => (
  <section className={styles.only}>{explaination}</section>
);

const OnlyTests = ({ testCode }) => (
  <Editor className={styles.only} code={testCode} />
);

const OnlyStdout = ({ stdout }) => <pre className={styles.only}>{stdout}</pre>;

export default function Explaination({ explaination, testCode, stdout }) {
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
