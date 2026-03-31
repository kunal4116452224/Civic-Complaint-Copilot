"use client";
import { useState, useEffect, useCallback } from "react";
import type { Complaint } from "@/lib/types";

const STORAGE_KEY = "ccc_complaints_v1";

function load(): Complaint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(complaints: Complaint[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch {
    // localStorage full or unavailable — silently degrade
  }
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setComplaints(load());
    setLoaded(true);
  }, []);

  const save = useCallback((complaint: Complaint) => {
    setComplaints((prev) => {
      const next = [complaint, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const updateStatus = useCallback(
    (id: string, status: Complaint["status"]) => {
      setComplaints((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, status } : c));
        persist(next);
        return next;
      });
    },
    []
  );

  const remove = useCallback((id: string) => {
    setComplaints((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status !== "Resolved").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return { complaints, loaded, save, updateStatus, remove, stats };
}
