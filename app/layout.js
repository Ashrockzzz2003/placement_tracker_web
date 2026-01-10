import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import AppShell from "./components/AppShell";

export const metadata = {
    title: "Amrita Placement Tracker",
    description:
        "A web app to track the placements of CSE Department, Amrita Vishwa Vidyapeetham, Coimbatore.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
              <ThemeProvider>
                <AppShell>
                  {children}
                </AppShell>
              </ThemeProvider>
            </body>
        </html>
    );
}
