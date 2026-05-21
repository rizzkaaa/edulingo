"use client";

import { useRouter } from "next/navigation";

export default function StructurePart1Page() {

  const router = useRouter();

  const handleFinish = () => {

    const lessons =
      JSON.parse(
        localStorage.getItem("lessonStatus")
      );

    if (!lessons) return;

    // kalau sudah selesai, jangan ubah apa-apa lagi
    if (lessons[0].status === "done") {

      router.push("/dashboard");

      return;

    }

    lessons[0].status = "done";

    // buka materi berikutnya kalau masih locked
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
        Structure Part 1
      </h1>

      <button onClick={handleFinish}>
        SELESAI
      </button>

    </div>

  );

}