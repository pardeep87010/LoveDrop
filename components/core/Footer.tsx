import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Zap, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-rose-100/80 pt-14 pb-10 text-slate-600 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-rose-100/60">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Love<span className="text-rose-600">Link</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Transform your feelings into a personal interactive website with runaway buttons, sealed envelopes, and real-time WhatsApp alerts.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Private &amp; SSL Encrypted</span>
            </div>
          </div>

          {/* Col 2: Occasions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Occasions</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
              <li><Link href="/create?theme=sorry-apology" className="hover:text-rose-600 transition-colors">Heartfelt Apology (Maan Jao)</Link></li>
              <li><Link href="/create?theme=cat-proposal" className="hover:text-rose-600 transition-colors">Cute Proposal (Runaway NO)</Link></li>
              <li><Link href="/create?theme=birthday-queen" className="hover:text-rose-600 transition-colors">Birthday Celebration</Link></li>
              <li><Link href="/create?theme=bubu-dudu-hugs" className="hover:text-rose-600 transition-colors">1,000 Squishy Hugs</Link></li>
              <li><Link href="/create?theme=anniversary-memories" className="hover:text-rose-600 transition-colors">Anniversary Love Note</Link></li>
            </ul>
          </div>

          {/* Col 3: Product */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
              <li><a href="#how-it-works" className="hover:text-rose-600 transition-colors">How It Works</a></li>
              <li><a href="#chapters" className="hover:text-rose-600 transition-colors">5-Chapter Experience</a></li>
              <li><a href="#pricing" className="hover:text-rose-600 transition-colors">Pricing (₹99)</a></li>
              <li><a href="#faq" className="hover:text-rose-600 transition-colors">FAQ &amp; Help</a></li>
              <li><Link href="/apology" className="hover:text-rose-600 transition-colors">Dedicated Apology Flow</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Security &amp; Delivery</h4>
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Zero Watermarks Guaranteed</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-normal">
                Your custom surprise link remains active for 1 full year with unlimited views on all devices.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 LoveLink Studio. Crafted for romantic souls worldwide.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>1-Click UPI Payment</span>
            <span>•</span>
            <span>Real-Time WhatsApp Alerts</span>
            <span>•</span>
            <span>Confidential &amp; Safe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
