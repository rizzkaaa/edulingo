// "use client";
// //backend membuat tombol selesai terhubung ke firebse
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { auth, db } from "@/lib/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function ListeningComprehensionPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFinish = async () => {
//     setIsLoading(true);
//     try {
//       const user = auth.currentUser;
//       if (!user) return alert("Anda belum login!");

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const data = userSnap.data();
//         let lessons = data.lessonStatus || [];

//         if (lessons[6]?.status === "done") {
//           router.push("/dashboard");
//           return;
//         }

//         if (lessons[6]) {
//           lessons[6].status = "done";
//         }

//         await updateDoc(userRef, { lessonStatus: lessons });
//         router.push("/dashboard");
//       }
//     } catch (error) {
//       console.error("Gagal memperbarui:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Listening Comprehension</h1>
//       <button onClick={handleFinish} disabled={isLoading}>
//         {isLoading ? "Menyimpan..." : "SELESAI"}
//       </button>
//     </div>
//   );
// }

import { redirect } from "next/navigation";

export default function Home() {
  redirect(
    "/dashboard/lesson/listening_comprehension/listening_to_short_conversation",
  );
}
