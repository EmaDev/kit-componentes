"use client";

import { Header } from "../chrome/Header";
import { Hero } from "../chrome/Hero";
import { SideNav } from "../chrome/SideNav";
import { IntroSection } from "../chrome/IntroSection";
import { GroupHeader } from "../chrome/GroupHeader";
import { GROUPS } from "../chrome/groups";
import { AtomsGroup } from "../sections/AtomsGroup";
import { InteractionGroup } from "../sections/InteractionGroup";
import { DataGroup } from "../sections/DataGroup";
import { ThemeGroup } from "../sections/ThemeGroup";
import { SurfacesGroup } from "../sections/SurfacesGroup";
import { PwaGroup } from "../sections/PwaGroup";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <Hero />

        <div className="flex gap-10">
          <SideNav />
          <div className="flex-1 min-w-0">
            <IntroSection />

            <GroupHeader group={GROUPS[0]} count="13 componentes" />
            <AtomsGroup />

            <GroupHeader group={GROUPS[1]} count="6 componentes" />
            <InteractionGroup />

            <GroupHeader group={GROUPS[2]} count="3 componentes" />
            <DataGroup />

            <GroupHeader group={GROUPS[3]} count="2 componentes · 1 hook" />
            <ThemeGroup />

            <GroupHeader group={GROUPS[4]} count="4 componentes" />
            <SurfacesGroup />

            <GroupHeader group={GROUPS[5]} count="7 componentes · varios hooks" />
            <PwaGroup />
          </div>
        </div>
      </div>
    </div>
  );
}
