"use client";
import { useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

function emit() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function showToast(message: string, type: "success" | "error" | "info" = "info") {
  const id = Math.random().toString(36).slice(2);
  toasts.push({ id, message, type });
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

export function useToasts() {
  const [state, setState] = useState<Toast[]>([]);

  useState(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((fn) => fn !== setState);
    };
  });

  return state;
}

export function ToastContainer() {
  const toasts = useToasts();
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-right ${
            toast.type === "success" ? "bg-green-600 text-white" :
            toast.type === "error" ? "bg-red-600 text-white" :
            "bg-card border text-foreground"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
