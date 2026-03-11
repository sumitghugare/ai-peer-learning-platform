// import Link from "next/link";

// type Question = {
//   id: number;
//   title: string;
//   body: string;
//   tags: string;
// };

// export default function QuestionCard({ question }: { question: Question }) {
//   return (
//     <Link href={`/question/${question.id}`}>
//       <div
//         className="
//           group
//           relative
//           bg-white
//           p-6
//           rounded-2xl
//           shadow-md
//           border
//           hover:shadow-2xl
//           hover:-translate-y-1
//           transition-all
//           cursor-pointer
//         "
//       >
//         {/* Left Accent Bar */}
//         <div className="absolute left-0 top-0 h-full w-1 bg-black rounded-l-2xl opacity-0 group-hover:opacity-100 transition" />

//         {/* Title */}
//         <h2 className="text-lg font-semibold text-gray-900 group-hover:underline">
//           {question.title}
//         </h2>

//         {/* Body */}
//         <p className="text-sm text-gray-700 mt-3 leading-relaxed line-clamp-2">
//           {question.body}
//         </p>

//         {/* Footer */}
//         <div className="mt-4 flex items-center justify-between">
//           {/* Tags */}
//           <div className="flex flex-wrap gap-2">
//             {question.tags.split(",").map((tag) => (
//               <span
//                 key={tag}
//                 className="
//                   text-xs
//                   bg-gray-100
//                   text-gray-700
//                   px-3
//                   py-1
//                   rounded-full
//                   font-medium
//                 "
//               >
//                 #{tag.trim()}
//               </span>
//             ))}
//           </div>

//           {/* CTA */}
//           <span className="text-xs text-gray-400 group-hover:text-black transition">
//             View →
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }
import Link from "next/link";

export default function QuestionCard({ question }: any) {
  return (
    <div
      className="
        group
        relative
        bg-white
        rounded-2xl
        p-6
        flex
        flex-col
        h-full
        border
        border-gray-200
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* LEFT ACCENT BAR */}
      <div className="absolute left-0 top-0 h-full w-1 bg-black rounded-l-2xl opacity-0 group-hover:opacity-100 transition" />

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition">
        {question.title}
      </h3>

      {/* BODY */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {question.body}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags?.split(",").map((tag: string) => (
          <span
            key={tag}
            className="
              text-xs
              font-medium
              bg-gray-100
              text-gray-700
              px-3
              py-1
              rounded-full
              transition
              group-hover:bg-black
              group-hover:text-white
            "
          >
            #{tag.trim()}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Community Question
        </span>

        <Link
          href={`/question/${question.id}`}
          className="
            text-sm
            font-medium
            text-gray-500
            flex
            items-center
            gap-1
            transition
            group-hover:text-black
          "
        >
          View
          <span className="group-hover:translate-x-1 transition">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
