"use client";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const leads = [
  { name: "Perrin", email: "prodigiestesting@gmail.com", phone: "", tags: ["PU"] },
];

export default function LeadPage() {
  return (
    <AppShell title="Lead">
      <Card className="bg-black/60 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-white/90">The home to all your customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search customer..." className="max-w-md bg-white/5 border-white/10 placeholder:text-white/40 text-white" />
          </div>
          <div className="grid grid-cols-4 text-sm text-white/60 px-2 py-2 border-b border-white/10"> 
            <div>Name</div><div>Email</div><div>Phone</div><div>Tags</div>
          </div>
          {leads.map((l) => (
            <div key={l.email} className="grid grid-cols-4 px-2 py-3 border-b border-white/5">
              <div>{l.name}</div>
              <div className="text-white/80">{l.email}</div>
              <div className="text-white/80">{l.phone || "-"}</div>
              <div className="text-white/80">{l.tags.join(", ")}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}