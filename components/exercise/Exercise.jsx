import Editor from "../editor/Editor";
import ExplainationTabs from "../explaination/ExplainationTabs";
import styles from "./Exercise.module.scss";

export default function Exercise({
  explaination,
  code,
  testCode,
  stdout,
  annotations,
  onCodeChange,
}) {
  return (
    <section className={styles.Exercise}>
      <ExplainationTabs
        explaination={explaination}
        testCode={testCode}
        stdout={stdout}
      />
      <Editor
        className={styles.code}
        highlightLine={44}
        annotations={annotations}
        code={code}
        onCodeChange={onCodeChange}
      />
    </section>
  );
}
