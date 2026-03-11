// "use client";


// import { useEffect, useState } from "react";
// import { getQuestions } from "@/services/api";
// import QuestionCard from "@/components/QuestionCard";
// import Link from "next/link";

// type Question = {
//   id: number;
//   title: string;
//   body: string;
//   tags: string;
// };

// export default function Home() {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getQuestions()
//       .then((data) => setQuestions(Array.isArray(data) ? data : []))
//       .finally(() => setLoading(false));
//   }, []);

//   // 🔹 Remove duplicate questions by title
// const uniqueQuestions = questions.filter(
//   (q, index, self) =>
//     index === self.findIndex((t) => t.title === q.title)
// );

// // 🔹 Sort by newest first (higher id = newer)
// const sortedQuestions = [...uniqueQuestions].sort(
//   (a, b) => b.id - a.id
// );

// // 🔹 Show only latest 6 questions
// const latestQuestions = sortedQuestions.slice(0, 6);



//   return (
//     <main className="min-h-screen bg-gradient-to-br from-black to-gray-900">
//       {/* HERO SECTION */}
//       <section className="text-center py-20 px-6 text-white relative">
//        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90" />

//        <div className="relative z-10">

//         <h1 className="text-4xl font-extrabold mb-4">
//           Learn Together. Solve Doubts Faster.
//         </h1>
//         <p className="text-gray-300 max-w-2xl mx-auto mb-6">
//           Ask questions, get answers from the community, and let AI help
//           you learn smarter.
//         </p>

//         <Link
//           href="/ask"
//           className="
//             inline-block
//             bg-white
//             text-black
//             px-6
//             py-3
//             rounded-lg
//             font-semibold
//             hover:bg-gray-200
//             transition
//           "
//         >
//           Ask a Question
//         </Link>
//         </div>
//       </section>

//       {/* QUESTIONS LIST */}
//       <section className="max-w-6xl mx-auto px-6 pb-16">
//         <h2 className="text-2xl font-bold text-white mb-6">
//           Latest Questions
//         </h2>

//         {loading && (
//           <p className="text-gray-400 text-center">
//             Loading questions...
//           </p>
//         )}

//         {!loading && questions.length === 0 && (
//           <p className="text-gray-400 text-center">
//             No questions yet. Be the first to ask!
//           </p>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//          {latestQuestions.map((q) => (
//          <QuestionCard key={q.id} question={q} />
//         ))}
//       </div>

//       </section>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import { searchQuestions } from "@/services/api";

type Question = {
  id: number;
  title: string;
  body: string;
  tags: string;
};

export default function Home() {
  // 🔹 Search & filter state
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");

  // 🔹 Data state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch questions with search & tag
  useEffect(() => {
    setLoading(true);

    searchQuestions({ q: search, tag })
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [search, tag]);

  // 🔹 Remove duplicate questions by title
  const uniqueQuestions = questions.filter(
    (q, index, self) =>
      index === self.findIndex((t) => t.title === q.title)
  );

  // 🔹 Sort by newest first
  const sortedQuestions = [...uniqueQuestions].sort(
    (a, b) => b.id - a.id
  );

  // 🔹 Limit to latest 6
  const latestQuestions = sortedQuestions.slice(0, 6);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900">

      {/* HERO SECTION */}
      <section className="text-center py-20 px-6 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">
            Learn Together. Solve Doubts Faster.
          </h1>

          <p className="text-gray-300 mb-6">
            Ask questions, get answers from the community, and let AI help
            you learn smarter.
          </p>

          <Link
            href="/ask"
            className="
              inline-block
              bg-white
              text-black
              px-6
              py-3
              rounded-lg
              font-semibold
              hover:bg-gray-200
              transition
            "
          >
            Ask a Question
          </Link>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 mb-10 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded text-gray-900 focus:ring-2 focus:ring-black outline-none"
          />

          <input
            type="text"
            placeholder="Filter by tag (e.g. python)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border border-gray-300 p-3 rounded text-gray-900 focus:ring-2 focus:ring-black outline-none"
          />
        </div>
      </section>

      {/* QUESTIONS LIST */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Latest Questions
        </h2>

        {loading && (
          <p className="text-gray-400 text-center">
            Loading questions...
          </p>
        )}

        {!loading && latestQuestions.length === 0 && (
          <p className="text-gray-400 text-center">
            No questions found.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </section>

    </main>
  );
}
