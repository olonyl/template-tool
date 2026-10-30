"use client";

import { useState } from "react";
import { PromoForm } from "@/components/PromoForm";
import { ProfileSelector } from "@/components/ui/ProfileSelector";
import { PROFILES, type Profile } from "@/lib/profiles";

export function AppShell() {
  const [profile, setProfile] = useState<Profile>("taller");
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
      <main className="flex flex-1 w-full">
        <PromoForm key={profile} profile={profile} />
      </main>
    </div>
  );
}
