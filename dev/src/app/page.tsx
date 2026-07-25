"use client";

import { useState } from "react";
import { Header } from "../chrome/Header";
import { Hero } from "../chrome/Hero";
import { Footer } from "../chrome/Footer";
import { SideNav } from "../chrome/SideNav";
import { IntroSection } from "../chrome/IntroSection";
import { GroupHeader } from "../chrome/GroupHeader";
import { groupById, UI_SECTION_TO_SUBSECTION } from "../chrome/groups";
import { UiGroup } from "../sections/UiGroup";
import { NavigationGroup } from "../sections/NavigationGroup";
import { InteractionGroup } from "../sections/InteractionGroup";
import { ThemeGroup } from "../sections/ThemeGroup";
import { SurfacesGroup } from "../sections/SurfacesGroup";
import { HeroesGroup } from "../sections/HeroesGroup";
import { AppBlocksGroup } from "../sections/AppBlocksGroup";
import { DataGroup } from "../sections/DataGroup";
import { ListsGroup } from "../sections/ListsGroup";
import { CommerceGroup } from "../sections/CommerceGroup";
import { SocialGroup } from "../sections/SocialGroup";
import { PwaGroup } from "../sections/PwaGroup";

function initialUiTab() {
  if (typeof window === "undefined") return "formularios";
  const hash = window.location.hash.slice(1);
  return UI_SECTION_TO_SUBSECTION[hash] ?? "formularios";
}

export default function PlaygroundPage() {
  const [uiTab, setUiTab] = useState(initialUiTab);

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <Hero />

        <div className="flex gap-10">
          <SideNav activeUiTab={uiTab} onUiTabChange={setUiTab} />
          <div className="flex-1 min-w-0">
            <IntroSection />

            <GroupHeader group={groupById("ui")} count="15 componentes" />
            <UiGroup tab={uiTab} onTabChange={setUiTab} />

            <GroupHeader group={groupById("navigation")} count="3 componentes" />
            <NavigationGroup />

            <GroupHeader group={groupById("interaction")} count="6 componentes" />
            <InteractionGroup />

            <GroupHeader group={groupById("theme-group")} count="2 componentes · 1 hook" />
            <ThemeGroup />

            <GroupHeader group={groupById("surfaces")} count="6 componentes" />
            <SurfacesGroup />

            <GroupHeader group={groupById("heroes")} count="4 componentes" />
            <HeroesGroup />

            <GroupHeader group={groupById("app-blocks")} count="7 componentes" />
            <AppBlocksGroup />

            <GroupHeader group={groupById("data")} count="3 componentes" />
            <DataGroup />

            <GroupHeader group={groupById("lists")} count="5 componentes" />
            <ListsGroup />

            <GroupHeader group={groupById("commerce")} count="4 componentes" />
            <CommerceGroup />

            <GroupHeader group={groupById("social")} count="7 componentes" />
            <SocialGroup />

            <GroupHeader group={groupById("pwa-group")} count="7 componentes · varios hooks" />
            <PwaGroup />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
