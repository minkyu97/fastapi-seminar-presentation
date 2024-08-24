import { useEffect } from "react";
import StarHistory from "./star-history.svg?react";
import "./style.css";

export default function Seminar0() {
  useEffect(() => {
    const [djangoLine, fastapiLine, flaskLine] =
      document.getElementsByClassName("xkcd-chart-xyline");

    const handleKeypress = (e: KeyboardEvent) => {
      if (e.code === "KeyR") {
        djangoLine.classList.toggle("start-django");
        fastapiLine.classList.toggle("start-fastapi");
        flaskLine.classList.toggle("start-flask");
      }
    };

    window.addEventListener("keypress", handleKeypress);
    return () => {
      window.removeEventListener("keypress", handleKeypress);
    };
  }, []);

  return (
    <>
      <section>
        <h1>Slide 1</h1>
        <StarHistory />
      </section>
      <section>
        <h1>Slide 2</h1>
      </section>
    </>
  );
}
