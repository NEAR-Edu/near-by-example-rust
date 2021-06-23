import { useRouter } from "next/router";
import { useCompile, useExercise } from "../../../state/exercise";
import Exercise from "../../../components/exercise/Exercise";
import styles from "../../../styles/ExercisePage.module.scss";
import Loading from "../../../components/loading/Loading";

const ForwardButton = ({ success, inProgress, onClick }) => {
  if (success) {
    return (
      <button
        className={styles.navButton}
        disabled={inProgress}
        onClick={onClick}
      >
        &rsaquo;
      </button>
    );
  } else {
    return (
      <button className={styles.run} disabled={inProgress} onClick={onClick}>
        {inProgress ? <Loading /> : "Run Tests"}
      </button>
    );
  }
};

export default function ExercisePage() {
  const router = useRouter();
  const { id } = router.query;
  const { explaination, code, testCode, loading, onCodeChange } =
    useExercise(id);
  const { stdout, annotations, success, inProgress, compileAndTest } =
    useCompile();

  if (loading) return <Loading />;

  const handleClick = async () => {
    if (success) router.push(`/exercises/${+id + 1}`);
    else await compileAndTest({ code, testCode });
  };

  return (
    <section className={styles.ExercisePage}>
      <section className={styles.controls}>
        <button className={styles.navButton}>&lsaquo;</button>
        <p className={success ? styles.pass : styles.fail}>
          {success
            ? `Passed ${String.fromCharCode(10003)}`
            : `Failed ${String.fromCharCode(215)}`}
        </p>
        <ForwardButton
          success={success}
          inProgress={inProgress}
          onClick={handleClick}
        />
      </section>
      <Exercise
        explaination={explaination}
        code={code}
        testCode={testCode}
        stdout={stdout}
        annotations={annotations}
        onCodeChange={onCodeChange}
      />
    </section>
  );
}
