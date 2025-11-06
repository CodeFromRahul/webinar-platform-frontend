"use client";

import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

function Step({ index, title, desc, done }: { index: number; title: string; desc: string; done?: boolean }) {
  return (
    <button className={`w-full text-left rounded-xl border border-white/10 px-4 py-3 flex items-center justify-between text-white ${done ? "bg-white/10" : "bg-white/5 hover:bg-white/10"}`}>
      <div className="flex items-center gap-3">
        <div className={`h-6 w-6 grid place-items-center rounded-full text-xs ${done ? "bg-violet-600 text-white" : "bg-white/10 text-white"}`}>{index}</div>
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-sm text-white/60">{desc}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-white/50" />
    </button>
  );
}

export default function Dashboard() {
  return (
    <AppShell title="Home">
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-7">
          <h1 className="text-3xl font-semibold mb-4 text-white">Get maximum Conversion from your webinars</h1>
          <div className="space-y-3">
            <Step index={1} title="Connect Stripe" desc="Connect your Stripe account to start accepting payments" done />
            <Step index={2} title="Create AI Agent" desc="Set up an AI agent to automate your webinar interactions" done />
            <Step index={3} title="Create a webinar" desc="Set up your first webinar to start collecting leads" />
          </div>
        </section>
        <section className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-4">
          <Card className="bg-black/60 border border-white/10 text-white min-h-[140px] grid place-items-center">
            <div className="text-center">
              <div className="text-3xl">⬆️</div>
              <div className="mt-2 text-sm text-white/60">Browse or drag a pre-recorded webinar file</div>
            </div>
          </Card>
          <Card className="bg-black/60 border border-white/10 text-white min-h-[140px] grid place-items-center">
            <div className="text-center">
              <div className="text-3xl">🎥</div>
              <div className="mt-2 text-sm text-white/60">Browse or drag a pre-recorded webinar file</div>
            </div>
          </Card>
        </section>

        <section className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/60 border border-white/10 text-white">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-medium text-white">John Doe</div>
                  <div className="text-sm text-white/70">Johndoe@gmail.com</div>
                  <div className="mt-2 text-xs text-white/60">New Customer • Tag 2 • Tag 3</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-black/60 border border-white/10 text-white">
            <CardHeader>
              <CardTitle>See the list of your current customers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1,2].map((i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-medium text-white">John Doe</div>
                  <div className="text-sm text-white/70">Johndoe@gmail.com</div>
                  <div className="mt-2 text-xs"><span className="mr-2 rounded-md bg-white/10 text-white px-2 py-0.5">New</span><span className="rounded-md bg-white/10 text-white px-2 py-0.5">Hot Lead</span></div>
                  <div className="mt-1 text-xs text-white/60">Updated At: May 12, 2025</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}