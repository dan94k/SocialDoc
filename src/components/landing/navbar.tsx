"use client";

import Link from "next/link";
import { FileText, Plus, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { useContractStore } from "@/stores/contract-store";

const NAV_LINKS = [
  { label: "Novo Contrato", href: "/contrato", highlight: true },
  { label: "Contratos", href: "/dashboard" },
  { label: "Assinatura", href: "/assinatura" },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const resetContract = useContractStore((s) => s.resetContract);

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
      resetContract();
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
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(5,11,24,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl shrink-0"
          style={{ color: "#ffffff", fontFamily: "var(--font-display)" }}
        >
          <FileText className="h-5 w-5" style={{ color: "#d4ff00" }} />
          SocialDoc
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.highlight ? (
                <button
                  key={link.href}
                  onClick={handleCriarContrato}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold ml-1 transition-all duration-200 hover:scale-[1.03]"
                  style={{ background: "#d4ff00", color: "#050b18" }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    color:
                      pathname === link.href || pathname?.startsWith(link.href + "/")
                        ? "#ffffff"
                        : "rgba(255,255,255,0.45)",
                    background:
                      pathname === link.href || pathname?.startsWith(link.href + "/")
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Avatar com dropdown no hover */}
            <div
              className="relative ml-2 pl-2 group"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name ?? "Avatar"}
                  className="h-8 w-8 rounded-full cursor-pointer"
                  style={{ border: "2px solid rgba(255,255,255,0.15)" }}
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer"
                  style={{ background: "#d4ff00", color: "#050b18" }}
                >
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}

              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div
                  className="w-44 rounded-2xl overflow-hidden"
                  style={{
                    background: "#0d1525",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {user.user_metadata?.full_name && (
                    <div
                      className="px-3 py-2.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <p className="text-xs font-medium truncate" style={{ color: "#ffffff" }}>
                        {user.user_metadata.full_name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {user.email}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
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
            className="rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "#d4ff00", color: "#050b18" }}
          >
            Criar contrato
          </button>
        )}
      </div>
    </nav>
  );
}
