import { useEffect, useState } from "react";

export const useExercise = (id) => {
  const [explaination, setExplaination] = useState();
  const [code, setCode] = useState();
  const [testCode, setTestCode] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/exercises/${id}`)
      .then((res) => res.json())
      .then(({ explaination, starterCode, testCode }) => {
        setExplaination(explaination);
        setCode(starterCode);
        setTestCode(testCode);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return {
    explaination,
    code,
    testCode,
    loading,
    onCodeChange: (code) => setCode(code),
  };
};

export const useCompile = () => {
  const [stdout, setStdout] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [success, setSuccess] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const compileAndTest = async ({ code, testCode }) => {
    if (inProgress) return;
    setInProgress(true);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: `${code}\n\n${testCode}`,
          backtrace: false,
          channel: "stable",
          crateType: "lib",
          edition: "2018",
          mode: "debug",
          tests: true,
        }),
      });
      const { stderr, stdout, success } = await res.json();
      setAnnotations(
        [
          ...stderr.matchAll(
            /(warning|error)\[?.*\]?:.*\n\s+--> src\/lib.rs:(\d+):.*\n.*\n\d+ \| ([\s\w\b:{},;^=`|#[\]()&->]*)\n\n/g
          ),
        ].map(([, type, row, text]) => ({ type, row: Number(row) - 1, text }))
      );
      setStdout(stdout);
      setSuccess(success);
    } finally {
      setInProgress(false);
    }
  };

  return {
    stdout,
    annotations,
    success,
    inProgress,
    compileAndTest,
  };
};
