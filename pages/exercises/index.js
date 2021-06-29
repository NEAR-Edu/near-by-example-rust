import Link from "next/link";
import { useExercises } from "../../state/near";
import styles from "../../styles/ExercisesPage.module.scss";

export default function ExercisesPage() {
  const exercises = useExercises();

  return (
    <ul className={styles.Exercises}>
      {exercises.map(({ title, status }, i) => (
        <li key={title}>
          <Link href={`/exercises/${i}`}>
            <a>
              <span className={styles.title}>{title}</span>
              {status ? (
                <span className={styles.pass}>✓</span>
              ) : (
                <span className={styles.fail}>&otimes;</span>
              )}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
