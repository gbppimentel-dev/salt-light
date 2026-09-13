import { ArrowLeft, CheckCircle2, Code2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const stackGroups = [
  {
    title: "Frontend",
    description: "The application interface, interaction, and visual system.",
    items: [
      { name: "React", detail: "Component-based user interface", icon: "react", color: "61DAFB" },
      { name: "Vite", detail: "Development server and production bundler", icon: "vite", color: "646CFF" },
      { name: "JavaScript", detail: "Application language", icon: "javascript", color: "F7DF1E" },
      { name: "React Router", detail: "Client-side routing and protected pages", icon: "reactrouter", color: "CA4245" },
      { name: "TanStack Query", detail: "Server-state caching and query management", icon: "reactquery", color: "FF4154" },
      { name: "Tailwind CSS", detail: "Responsive utility-first styling", icon: "tailwindcss", color: "06B6D4" },
      { name: "Radix UI", detail: "Accessible UI primitives", icon: "radixui", color: "161618" },
      { name: "Framer Motion", detail: "Page and component animations", icon: "framer", color: "0055FF" },
      { name: "Lucide", detail: "Interface icon library", icon: "lucide", color: "F56565" },
    ],
  },
  {
    title: "Backend & Integrations",
    description: "Identity, data, security, and Scripture content.",
    items: [
      { name: "Supabase", detail: "Backend-as-a-service and client SDK", icon: "supabase", color: "3ECF8E" },
      { name: "PostgreSQL", detail: "Relational application database", icon: "postgresql", color: "4169E1" },
      { name: "Supabase Auth", detail: "Persistent sessions and account management", icon: "supabase", color: "3ECF8E" },
      { name: "Google OAuth", detail: "Secure Google account sign-in", icon: "google", color: "4285F4" },
      { name: "Row Level Security", detail: "Database access policies per signed-in user", fallback: "RLS" },
      { name: "API.Bible", detail: "Bible translations and passage previews", fallback: "AB" },
    ],
  },
  {
    title: "App Delivery",
    description: "Web deployment, installation, and mobile packaging.",
    items: [
      { name: "Vercel", detail: "Web hosting and deployment", icon: "vercel", color: "000000" },
      { name: "Progressive Web App", detail: "Installable standalone web experience", fallback: "PWA" },
      { name: "Workbox", detail: "Service worker and update management", icon: "workbox", color: "4285F4" },
      { name: "Capacitor", detail: "Native Android and iOS bridge", icon: "capacitor", color: "119EFF" },
      { name: "Android", detail: "Native Android application target", icon: "android", color: "3DDC84" },
      { name: "iOS", detail: "Native iPhone and iPad application target", icon: "apple", color: "000000" },
    ],
  },
  {
    title: "Tools & Supporting Libraries",
    description: "Development workflow, feedback, exports, and content presentation.",
    items: [
      { name: "Visual Studio Code", detail: "Primary code editor", icon: "visualstudiocode", color: "007ACC" },
      { name: "Git", detail: "Source control", icon: "git", color: "F05032" },
      { name: "GitHub", detail: "Repository hosting and collaboration", icon: "github", color: "181717" },
      { name: "Android Studio", detail: "Android emulator, debugging, and APK builds", icon: "androidstudio", color: "3DDC84" },
      { name: "Xcode", detail: "iOS simulator, signing, and release builds", icon: "xcode", color: "147EFB" },
      { name: "Google Fonts", detail: "Inter and Space Grotesk typefaces", icon: "googlefonts", color: "4285F4" },
      { name: "Sonner", detail: "In-app toast notifications", fallback: "S" },
      { name: "html2canvas", detail: "Character and devotion image exports", fallback: "HC" },
    ],
  },
];

function TechLogo({ item }) {
  const logoUrl = item.icon ? `https://cdn.simpleicons.org/${item.icon}/${item.color || "111111"}` : null;

  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
      <span className="text-[10px] font-bold text-muted-foreground">{item.fallback || item.name.slice(0, 2)}</span>
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${item.name} logo`}
          className="absolute h-6 w-6 object-contain"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

export default function TechStackPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/character"
            className="mb-3 inline-flex min-h-[36px] items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Character
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Built with Intention</h1>
              <p className="mt-1 text-sm text-muted-foreground">The tools behind Salt &amp; Light.</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardContent className="p-5 sm:p-6">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Salt &amp; Light is a React application backed by Supabase, delivered as an installable PWA,
            and packaged for mobile through Capacitor. Every technology below is part of the current project.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Google OAuth authentication</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Supabase Row Level Security</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Web, Android, and iOS-ready</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {stackGroups.map((group) => (
          <section key={group.title}>
            <div className="mb-3 px-1">
              <h2 className="font-display text-base font-bold">{group.title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{group.description}</p>
            </div>
            <Card>
              <CardContent className="divide-y p-0">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50">
                    <TechLogo item={item} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-xs text-muted-foreground">
        Brand marks belong to their respective owners. <ExternalLink className="h-3 w-3" />
      </p>
    </div>
  );
}
