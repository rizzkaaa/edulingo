"use client";

import { useRouter } from "next/navigation";

export default function WrittenExpressionPart1Page() {

  const router = useRouter();

  const handleFinish = () => {

    const lessons =
      JSON.parse(
        localStorage.getItem("lessonStatus")
      );

    if (!lessons) return;

    if (lessons[0].status === "done") {

      router.push("/dashboard");

      return;

    }

    lessons[0].status = "done";

    if (
      lessons[1] &&
      lessons[1].status === "locked"
    ) {

      lessons[1].status = "progress";

    }

    localStorage.setItem(
      "lessonStatus",
      JSON.stringify(lessons)
    );

    router.push("/dashboard");

  };

  return (

    <div>

      <h1>
        Written Expression Part 1
      </h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}