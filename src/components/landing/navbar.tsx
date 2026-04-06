import Link from "next/link";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="h-5 w-5 text-primary" />
          SocialDoc
        </Link>

        <Link
          href="/contrato"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Criar contrato
        </Link>
      </div>
    </nav>
  );
}
