import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Scale, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIQD, formatNum, type Listing } from "@/lib/market";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/listings/$id"
      params={{ id: listing.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={listing.image} alt={listing.title} loading="lazy" width={1024} height={768} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Badge variant="accent" className="shadow-card">{listing.type} · {listing.breed}</Badge>
          {listing.verified && (
            <Badge variant="success" className="gap-1 shadow-card"><BadgeCheck className="size-3.5" /> موثّق</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg leading-snug">{listing.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {listing.governorate} — {listing.district}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Scale className="size-3.5" /> {formatNum(listing.avgWeight)} كغم</span>
          <span>العدد: {formatNum(listing.count)}</span>
          {listing.vetCertificate && <span className="flex items-center gap-1 text-success"><Stethoscope className="size-3.5" /> فحص بيطري</span>}
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-dashed border-border pt-3">
          <div>
            <p className="text-xs text-muted-foreground">السعر للرأس</p>
            <p className="font-display text-xl font-bold text-primary">{formatIQD(listing.pricePerHead)}</p>
          </div>
          <span className="text-xs text-muted-foreground">{formatNum(listing.offers)} عروض سرية</span>
        </div>
      </div>
    </Link>
  );
}
