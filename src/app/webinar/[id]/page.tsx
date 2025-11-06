"use client";

import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function useWebinar(id: string) {
  const [item, setItem] = useState<any>(null);
  useEffect(() => {
    const list = localStorage.getItem("webinars") || "[]";
    const found = JSON.parse(list).find((x: any) => x.id === id);
    setItem(found);
  }, [id]);
  return item;
}

function useCountdown(targetISO: string) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    if (!targetISO) return;
    const t = new Date(targetISO).getTime();
    const i = setInterval(() => setDiff(Math.max(0, t - Date.now())), 1000);
    return () => clearInterval(i);
  }, [targetISO]);
  const d = Math.floor(diff / (24 * 60 * 60 * 1000));
  const h = Math.floor((diff / (60 * 60 * 1000)) % 24);
  const m = Math.floor((diff / (60 * 1000)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, finished: diff === 0 };
}

export default function WebinarLanding() {
  const params = useParams();
  const id = params?.id as string;
  const data = useWebinar(id);

  const dateTimeISO = useMemo(() => {
    if (!data) return "";
    const [hh, mm] = (data.time || "12:00").split(":");
    const hour24 = (data.period === "PM" ? (parseInt(hh) % 12) + 12 : parseInt(hh) % 12).toString().padStart(2, "0");
    return `${data.date}T${hour24}:${mm}:00`;
  }, [data]);

  // Add safe date object + formatted strings to avoid Invalid Date issues
  const dateObj = useMemo(() => {
    if (!dateTimeISO) return null;
    const d = new Date(dateTimeISO);
    return isNaN(d.getTime()) ? null : d;
  }, [dateTimeISO]);

  const { d, h, m, s } = useCountdown(dateTimeISO);

  if (!data) return <div className="min-h-[60vh] grid place-items-center bg-black text-white">No webinar found</div>;

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10 bg-black text-white">
      <div className="text-center max-w-lg">
        <h2 className="text-2xl font-medium mb-6">Seems like you are a little early</h2>
        <div className="mx-auto grid grid-cols-4 gap-2 max-w-md mb-6">
          {[{label: 'Days', val: d},{label:'Hours',val:h},{label:'Minutes',val:m},{label:'Seconds',val:s}].map((b) => (
            <div key={b.label} className="rounded-md bg-white/5 border border-white/10 p-3">
              <div className="text-2xl font-semibold tabular-nums">{b.val.toString().padStart(2,'0')}</div>
              <div className="text-xs text-white/60">{b.label}</div>
            </div>
          ))}
        </div>
        <div className="relative mx-auto mb-4 aspect-[16/9] w-full max-w-lg overflow-hidden rounded-xl border border-white/10">
          <Image src={data.thumbnail || "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop"} alt={data.name} fill className="object-cover" unoptimized />
        </div>
        <Button className="mb-5 bg-violet-600 hover:bg-violet-500">Get Reminder</Button>
        <h3 className="text-xl font-semibold">{data.name}</h3>
        <p className="mt-1 text-sm text-white/70">{data.description}</p>
        <div className="mt-5 flex items-center justify-center gap-2 text-sm">
          {dateObj && (
            <>
              <div className="rounded-md bg-white/5 border border-white/10 px-3 py-1">{dateObj.toLocaleDateString()}</div>
              <div className="rounded-md bg-white/5 px-3 py-1 border border-white/10">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}