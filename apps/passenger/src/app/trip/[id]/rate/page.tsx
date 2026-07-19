"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("ubar_user") || "{}");

    try {
      // Submit rating
      await fetch(`/api/trips/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratedById: user.id, stars, comment }),
      });

      // Submit payment
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: id, passengerId: user.passengerId, method: paymentMethod }),
      });

      router.push("/home");
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen p-4">
      <div className="max-w-md mx-auto w-full space-y-6 pt-8">
        <h1 className="text-2xl font-bold text-center">Rate Your Ride</h1>

        {/* Stars */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">How was your ride?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStars(s)}
                className={`text-4xl transition-transform cursor-pointer ${s <= stars ? "scale-110" : "opacity-30"}`}
              >
                {s <= stars ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-24 rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />

        {/* Payment Method */}
        <div className="space-y-3">
          <p className="font-medium">Payment Method</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "CASH", label: "Cash", icon: "💵" },
              { value: "EVC_PLUS", label: "EVC Plus", icon: "📱" },
              { value: "SAHAL", label: "Sahal", icon: "📱" },
              { value: "EDAHAB", label: "eDahab", icon: "📱" },
              { value: "KAAH", label: "Kaah", icon: "📱" },
            ].map((pm) => (
              <button
                key={pm.value}
                onClick={() => setPaymentMethod(pm.value)}
                className={`p-3 rounded-lg border-2 text-center text-sm transition-all cursor-pointer ${
                  paymentMethod === pm.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-xl">{pm.icon}</span>
                <p className="mt-1">{pm.label}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Processing..." : "Submit Rating & Pay"}
        </button>
      </div>
    </main>
  );
}
