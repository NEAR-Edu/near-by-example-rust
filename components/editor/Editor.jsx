import dynamic from "next/dynamic";
import styles from "./Editor.module.scss";

const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    await import("ace-builds/src-noconflict/mode-rust");
    await import("ace-builds/src-noconflict/theme-pastel_on_dark");
    return ace;
  },
  {
    ssr: false,
  }
);

export default function Editor({
  className,
  highlightLine,
  annotations,
  code,
  onCodeChange,
}) {
  return (
    <AceEditor
      className={className}
      mode="rust"
      theme="pastel_on_dark"
      value={code}
      readOnly={!onCodeChange}
      onChange={onCodeChange}
      fontSize="1rem"
      annotations={annotations}
      markers={
        highlightLine
          ? [
              {
                className: styles.highlight,
                startRow: highlightLine,
                startCol: 0,
                endRow: highlightLine,
                type: "fullLine",
              },
            ]
          : []
      }
    />
  );
}
