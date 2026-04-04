export default function Footer() {
  return (
    <footer className="border-t px-4 py-8">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">SocialDoc</p>
        <p>Feito para social medias brasileiros.</p>
        <p>&copy; {new Date().getFullYear()} SocialDoc. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
