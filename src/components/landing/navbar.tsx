"use client";

import Link from "next/link";
import { FileText, Plus, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Novo Contrato", href: "/contrato", highlight: true },
  { label: "Contratos", href: "/dashboard" },
  { label: "Assinatura", href: "/assinar" },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCriarContrato = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      router.push("/contrato");
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <FileText className="h-5 w-5 text-primary" />
          SocialDoc
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 ml-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href || pathname?.startsWith(link.href + "/")
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Avatar com dropdown no hover */}
            <div className="relative ml-2 pl-2 border-l group">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name ?? "Avatar"}
                  className="h-8 w-8 rounded-full border cursor-pointer"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium cursor-pointer">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}

              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="w-44 rounded-xl border bg-background shadow-lg overflow-hidden">
                  {user.user_metadata?.full_name && (
                    <div className="px-3 py-2.5 border-b">
                      <p className="text-xs font-medium truncate">{user.user_metadata.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleCriarContrato}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Criar contrato
          </button>
        )}
      </div>
    </nav>
  );
}
