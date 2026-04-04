export default function PdfPreview() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold">Contrato profissional de verdade</h2>
        <p className="mt-3 text-muted-foreground">
          Formatado, com clausulas claras e pronto para imprimir ou enviar por WhatsApp.
        </p>

        {/* PDF mockup */}
        <div className="mt-10 mx-auto max-w-sm">
          <div className="relative rounded-lg border bg-white shadow-2xl p-8 text-left transform rotate-1 hover:rotate-0 transition-transform">
            {/* Simulated PDF content */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="h-3 w-48 mx-auto rounded bg-gray-800" />
                <div className="mt-1 h-2 w-36 mx-auto rounded bg-gray-800" />
              </div>
              <div className="space-y-2 pt-4">
                <div className="h-2.5 w-24 rounded bg-gray-700" />
                <div className="h-2 w-full rounded bg-gray-200" />
                <div className="h-2 w-3/4 rounded bg-gray-200" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2.5 w-32 rounded bg-gray-700" />
                <div className="h-2 w-full rounded bg-gray-200" />
                <div className="h-2 w-5/6 rounded bg-gray-200" />
                <div className="h-2 w-2/3 rounded bg-gray-200" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2.5 w-40 rounded bg-gray-700" />
                <div className="h-2 w-full rounded bg-gray-200" />
                <div className="h-2 w-4/5 rounded bg-gray-200" />
              </div>
              <div className="flex justify-between pt-6">
                <div className="w-24 border-t border-gray-400 pt-1">
                  <div className="h-1.5 w-20 rounded bg-gray-300" />
                </div>
                <div className="w-24 border-t border-gray-400 pt-1">
                  <div className="h-1.5 w-20 rounded bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
