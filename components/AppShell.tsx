"use client";

import { useState } from "react";
import { Image, Megaphone } from "lucide-react";
import { FacebookCoverForm } from "@/components/FacebookCoverForm";
import { PromoForm } from "@/components/PromoForm";
import { ProfileSelector } from "@/components/ui/ProfileSelector";
import { PROFILES, type Profile } from "@/lib/profiles";

export function AppShell() {
  const [profile, setProfile] = useState<Profile>("taller");
  const [view, setView] = useState<"promos" | "cover">("promos");
  const config = PROFILES[profile];

  return (
    <div className="flex flex-col flex-1">
      <header
        className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 transition-colors duration-300"
        style={{ backgroundColor: config.headerBg }}
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={profile}
            src={profile === "taller" ? "/logo.svg" : "/chikitech-logo.png"}
            alt=""
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Generador de promociones</h1>
            <p className="text-sm" style={{ color: config.headerSub }}>
              {config.name}
            </p>
          </div>
        </div>
        <ProfileSelector value={profile} onChange={setProfile} />
      </header>
      {profile === "taller" && <div role="tablist" aria-label="Formato" className="flex gap-2 border-b border-[#e3e8f2] px-4 py-3 sm:px-8">
        {([
          { id: "promos", label: "Promociones", icon: Megaphone },
          { id: "cover", label: "Portada Facebook", icon: Image },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${view === id ? "bg-[#15649f] text-white" : "text-[#475569] hover:bg-[#eaf4fd]"}`}>
            <Icon size={16} />{label}
          </button>
        ))}
      </div>}
      <main className="flex flex-1 w-full">
        {profile === "taller" && view === "cover" ? <FacebookCoverForm /> : <PromoForm key={profile} profile={profile} />}
      </main>
    </div>
  );
}
