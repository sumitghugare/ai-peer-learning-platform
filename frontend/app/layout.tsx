// import "./globals.css";
// import Navbar from "@/components/Navbar";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50 text-gray-900">
//         <Navbar />
//         {children}
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-black to-gray-900 text-white">
        <Navbar />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}

