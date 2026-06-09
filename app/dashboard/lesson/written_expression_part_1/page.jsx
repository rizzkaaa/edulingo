// "use client";
// //backend membuat tombol selesai terhubung ke firebse
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { auth, db } from "@/lib/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function WrittenExpressionPart1Page() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFinish = async () => {
//     setIsLoading(true);

//     try {
//       const user = auth.currentUser;

//       if (!user) {
//         alert("Anda belum login!");
//         setIsLoading(false);
//         return;
//       }

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const data = userSnap.data();
//         let lessons = data.lessonStatus || [];

//         if (lessons.length === 0) {
//           lessons = Array.from({ length: 7 }, (_, i) => ({
//             status: i === 0 ? "progress" : "locked",
//             path: `/materi/${i + 1}`
//           }));
//         }

//         if (lessons[0]?.status === "done") {
//           router.push("/dashboard");
//           return;
//         }

//         if (lessons[0]) {
//           lessons[0].status = "done";
//         }

//         if (lessons[1] && lessons[1].status === "locked") {
//           lessons[1].status = "progress";
//         }

//         await updateDoc(userRef, {
//           lessonStatus: lessons,
//         });

//         router.push("/dashboard");
//       }
//     } catch (error) {
//       console.error("Gagal memperbarui progres:", error);
//       alert("Terjadi kesalahan saat menyimpan progres.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Written Expression Part 1</h1>
//       <button onClick={handleFinish} disabled={isLoading}>
//         {isLoading ? "Menyimpan..." : "SELESAI"}
//       </button>
//     </div>
//   );
// }

import { redirect } from "next/navigation";

export default function Home() {
  // redirect("/dashboard/lesson/written_expression_part_1/subject_-_verb_agreement");
  redirect("/dashboard/lesson/written_expression_part_1/parallel_structure_with_coordinate_conjunctions");
}
