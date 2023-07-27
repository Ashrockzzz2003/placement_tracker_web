import './globals.css';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway'
})

export const metadata = {
  title: 'Placement Tracker',
  description: 'Ashwin Narayanan S',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={raleway.variable}>
        <body>{children}</body>
    </html>
  )
}
