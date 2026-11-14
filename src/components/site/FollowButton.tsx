import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow, useFollows } from "@/lib/store";

export function FollowButton({ sellerId, sellerCode, size = "default", variant }: { sellerId: string; sellerCode: string; size?: "sm" | "default" | "lg"; variant?: "hero" | "outline" | "glass" }) {
  const follows = useFollows();
  const on = follows.includes(sellerId);
  return (
    <Button
      type="button"
      size={size}
      variant={on ? "secondary" : variant ?? "outline"}
      aria-pressed={on}
      onClick={() => {
        toggleFollow(sellerId);
        toast(on ? `ألغيت متابعة ${sellerCode}` : `تتابع الآن ${sellerCode}`, {
          description: on ? undefined : "ستصلك تنبيهات بإعلاناته الجديدة عبر المنصة.",
        });
      }}
    >
      {on ? <BellOff /> : <Bell />} {on ? "إلغاء المتابعة" : "متابعة البائع"}
    </Button>
  );
}
