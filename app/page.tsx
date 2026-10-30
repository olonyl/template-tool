import { PromoForm } from "@/components/PromoForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="px-8 py-6 bg-[#0d0f2b] flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={40} height={40} className="rounded-lg" />
        <div>
          <h1 className="text-xl font-bold text-white">Generador de promociones</h1>
          <p className="text-sm text-[#9399b3]">El Taller de Don Ronald</p>
        </div>
      </header>
      <main className="flex flex-1 w-full">
        <PromoForm />
      </main>
    </div>
  );
}

