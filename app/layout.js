export const metadata = { title: 'SolarEase' }
export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body style={{margin:0,padding:0}}>{children}</body>
    </html>
  )
}
