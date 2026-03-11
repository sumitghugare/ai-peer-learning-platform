// "use client";

// import { useState } from "react";
// import AuthInput from "@/components/AuthInput";
// import Link from "next/link";

// export default function SignupPage() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <main className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-black/70 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-800">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Create Account 🚀
//         </h1>

//         <form className="space-y-5">
//           <AuthInput
//             label="Username"
//             placeholder="Choose a username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           <AuthInput
//             label="Email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <AuthInput
//             label="Password"
//             type="password"
//             placeholder="Strong password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="submit"
//             className="
//               w-full
//               bg-white
//               text-black
//               py-3
//               rounded-lg
//               font-semibold
//               hover:bg-gray-200
//               transition
//             "
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-sm text-gray-400 text-center mt-6">
//           Already have an account?{" "}
//           <Link href="/login" className="text-white hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { signupUser } from "@/services/api";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await signupUser({ username, email, password });
      router.push("/login"); // ✅ redirect after signup
    } catch (err: any) {
      setError("User already exists or invalid data");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/70 p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account 🚀
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <AuthInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-white text-black py-3 rounded-lg font-semibold">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
