import "./globals.css";

export const metadata = {
  title: "EduLingo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}