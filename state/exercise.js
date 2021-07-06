import { useEffect, useState } from "react";

const getCompilationErrorsAnnotations = (stderr) => {
  return stderr
    .split("\n\n")
    .map(
      (msg) =>
        msg.match(
          /(?<type>warning|error)\[?.*\]?:(?<message>.*)\n\s+--> src\/lib.rs:(?<line>\d+):.*\n(?<detail>.*\n\d+ \| [\s\w\b:{},;^=`|#[\]()&->]*)/
        )?.groups
    )
    .filter((match) => match)
    .map(({ type, line, message, detail }) => ({
      type,
      row: Number(line) - 1,
      text: `${message}\n\n${detail}`,
    }));
};

const getTestCompilationErrorsAnnotations = (stdout) => {
  return stdout
    .split("\n\n")
    .map(
      (msg) =>
        msg.match(
          /---- tests::(?<name>\w+) stdout ----\n(?<message>.*), src\/lib.rs:(?<line>\d+)/
        )?.groups
    )
    .filter((match) => match)
    .map(({ line, message }) => ({
      type: "error",
      row: Number(line) - 1,
      text: message,
    }));
};

const getTestFailuresAnnotations = (stdout, code) => {
  const fnNames = code
    .split("\n")
    .map((line, lineNumber) => ({
      fnName: line.match(/pub fn (?<name>.*)\(.*\)/)?.groups?.name,
      lineNumber,
    }))
    .filter(({ fnName }) => fnName);
  return stdout
    .split("\n\n")
    .map(
      (msg) =>
        msg.match(
          /---- tests::(?<name>\w+) stdout ----\n(?<message>.*assertion failed(.|\n)*)/
        )?.groups
    )
    .filter((match) => match)
    .map(({ name, message }) => ({
      type: "error",
      row: fnNames.find(({ fnName }) => name.endsWith(fnName))?.lineNumber,
      text: message,
    }));
};

export const useExercise = (id) => {
  const [explanation, setExplanation] = useState();
  const [code, setCode] = useState();
  const [testCode, setTestCode] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setExplanation();
    setCode();
    setTestCode();
    fetch(`/api/exercises/${id}`)
      .then((res) => res.json())
      .then(({ explanation, starterCode, testCode }) => {
        setExplanation(explanation);
        setCode(starterCode);
        setTestCode(testCode);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return {
    explanation,
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
      const { stderr = "", stdout, success } = await res.json();
      console.log(getTestFailuresAnnotations(stdout, code));
      setAnnotations([
        ...getCompilationErrorsAnnotations(stderr),
        ...getTestCompilationErrorsAnnotations(stdout),
        ...getTestFailuresAnnotations(stdout, code),
      ]);
      setStdout(`${stderr}\n\n${stdout}`);
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
