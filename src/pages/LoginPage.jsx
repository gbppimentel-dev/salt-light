import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.94v2.78h3.15c1.84-1.69 2.91-4.18 2.91-7.75Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.15-2.78c-.87.59-1.99.94-3.28.94-2.52 0-4.66-1.7-5.42-3.99H3.32v2.87A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.58 13.56A5.85 5.85 0 0 1 6.28 12c0-.54.1-1.06.3-1.56V7.57H3.32A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.06 1.07 4.43l3.26-2.87Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.45c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.82 3.51 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.68 5.32l3.26 2.87C7.34 8.15 9.48 6.45 12 6.45Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  async function handleGoogleSignIn() {
    setError("");
    setIsSubmitting(true);

    try {
      const { error: googleError } = await signInWithGoogle();

      if (googleError) {
        throw googleError;
      }
    } catch (err) {
      setError(err?.message || "Google sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <main className="w-full max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-xl">
        <div className="grid md:grid-cols-2">
          <section className="relative overflow-hidden bg-primary p-8 text-primary-foreground sm:p-10">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-white/10" />

            <div className="relative">
              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Salt &amp; Light
              </div>

              <h1 className="max-w-sm text-3xl font-bold tracking-tight sm:text-4xl">
                Grow faithfully, one day at a time.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/80 sm:text-base">
                Build intentional habits, reflect on God&apos;s Word, and make
                meaningful progress in your Christian life.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span className="text-sm">Keep your devotions in one place</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <Heart className="h-4 w-4" />
                  </span>
                  <span className="text-sm">
                    Turn daily faith into meaningful progress
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center p-8 sm:p-10">
            <div className="mx-auto w-full max-w-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Welcome to Salt &amp; Light
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Continue your journey
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Sign in securely with Google to access your personal faith
                journey.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border bg-background px-4 py-3 font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleIcon />
                <span>
                  {isSubmitting ? "Opening Google..." : "Continue with Google"}
                </span>
                {!isSubmitting && <ArrowRight className="ml-auto h-4 w-4" />}
              </button>

              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="my-7 h-px bg-border" />

              <div className="rounded-xl bg-muted/60 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">No password needed</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      New here? Your Salt &amp; Light account is created
                      automatically the first time you continue with Google.
                    </p>
                  </div>
                </div>
              </div>

              {/* <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
                by continuing, you agree to use Salt &amp; Light 
              </p> */}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}