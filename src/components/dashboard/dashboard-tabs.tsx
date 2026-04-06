"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ContractList from "./contract-list";
import SubscriptionTab from "./subscription-tab";
import type { ContractData } from "@/types/contract";
import { CheckCircle, X } from "lucide-react";

interface Contract {
  id: string;
  created_at: string;
  client_name: string;
  data: ContractData;
}

interface Subscription {
  status: string;
  current_period_end: string | null;
  stripe_customer_id: string;
}

interface Purchase {
  id: string;
  created_at: string;
  type: "single" | "subscription";
  amount_brl: number;
  status: string;
}

type Tab = "contratos" | "assinatura";

interface Props {
  contracts: Contract[];
  subscription: Subscription | null;
  purchases: Purchase[];
  showSubscribedBanner?: boolean;
}

export default function DashboardTabs({
  contracts,
  subscription,
  purchases,
  showSubscribedBanner,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("contratos");
  const [bannerVisible, setBannerVisible] = useState(showSubscribedBanner ?? false);

  return (
    <div>
      {/* Success banner */}
      {bannerVisible && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium">Assinatura ativada com sucesso! </span>
            <span className="text-green-700">Agora você pode gerar contratos ilimitados.</span>
          </div>
          <button
            onClick={() => setBannerVisible(false)}
            className="text-green-600 hover:text-green-800 ml-4"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-8">
        {(["contratos", "assinatura"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize",
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "contratos" ? "Contratos" : "Assinatura & Gastos"}
          </button>
        ))}
      </div>

      {activeTab === "contratos" && <ContractList contracts={contracts} />}
      {activeTab === "assinatura" && (
        <SubscriptionTab subscription={subscription} purchases={purchases} />
      )}
    </div>
  );
}
