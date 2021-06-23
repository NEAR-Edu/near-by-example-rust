import Editor from "../editor/Editor";
import ExplanationTabs from "../explanation/ExplanationTabs";
import styles from "./Exercise.module.scss";

export default function Exercise({
  explanation,
  code,
  testCode,
  stdout,
  annotations,
  onCodeChange,
}) {
  return (
    <section className={styles.Exercise}>
      <ExplanationTabs
        explanation={explanation}
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
