"use client";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const assistants = ["Test AI", "Jenny", "Real Assistant", "Test PU Assistant", "Morgan", "Riley"];

export default function AgentsPage() {
  return (
    <AppShell title="Ai-Agents">
      <div className="grid grid-cols-12 gap-6 text-white">
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/10">+ Create Assistant</Button>
          </div>
          <Input placeholder="Search Assistants" className="mb-3 bg-white/5 border-white/10 placeholder:text-white/40 text-white" />
          <div className="rounded-md border border-white/10 divide-y divide-white/10">
            {assistants.map((a) => (
              <button key={a} className="w-full text-left px-3 py-3 hover:bg-white/5">{a}</button>
            ))}
          </div>
        </aside>
        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          <Card className="bg-black/60 border border-white/10 text-white">
            <CardHeader>
              <CardTitle>Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>First Message</Label>
                <Input className="bg-white/5 border-white/10 placeholder:text-white/40 text-white" defaultValue="Hi there, this is Test AI from customer support. How can I help you today?" />
              </div>
              <div className="grid gap-2">
                <Label>System Prompt</Label>
                <Textarea className="h-60 bg-white/5 border-white/10 text-white placeholder:text-white/40" defaultValue={`# Lead Qualification & Nurturing Agent Prompt\n\n## Identity & Purpose\nYou are Morgan, a business development voice assistant...`}></Textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Provider</Label>
                  <Select defaultValue="openai">
                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Provider" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">openai</SelectItem>
                      <SelectItem value="anthropic">anthropic</SelectItem>
                      <SelectItem value="groq">groq</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Model</Label>
                  <Select defaultValue="gpt-4o">
                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Model" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                      <SelectItem value="sonnet-3.5">sonnet-3.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-violet-600 hover:bg-violet-500">Update Assistant</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}