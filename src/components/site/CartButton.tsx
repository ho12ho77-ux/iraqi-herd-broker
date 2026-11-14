import { ShoppingBasket, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removeCartItem, setCartItem, useCart } from "@/lib/store";
import type { Listing } from "@/lib/market";
import { cn } from "@/lib/utils";

export function CartButton({ listing, count, compact, className }: { listing: Listing; count?: number; compact?: boolean; className?: string }) {
  const cart = useCart();
  const inCart = listing.id in cart;
  return (
    <Button
      type="button"
      variant={inCart ? "secondary" : compact ? "outline" : "ink"}
      size={compact ? "sm" : "lg"}
      className={cn(className)}
      aria-pressed={inCart}
      onClick={() => {
        if (inCart) {
          removeCartItem(listing.id);
          toast("أُزيل من السلة", { description: listing.title });
        } else {
          setCartItem(listing.id, count ?? listing.count);
          toast.success("أُضيف إلى سلتك", { description: "يمكنك تقديم العرض السري لاحقاً من صفحة السلة." });
        }
      }}
    >
      {inCart ? <Check /> : <ShoppingBasket />}
      {inCart ? "في السلة" : compact ? "للسلة" : "أضف إلى السلة"}
    </Button>
  );
}
