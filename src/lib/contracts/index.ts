import { socialMediaMonthlyConfig } from "./social-media-monthly";
import { packageArtsConfig } from "./package-arts";
import type { ContractTypeConfig } from "@/types/contract-config";

export const CONTRACT_TYPES: ContractTypeConfig[] = [
  socialMediaMonthlyConfig,
  packageArtsConfig,
];

export function getContractType(id: string): ContractTypeConfig | undefined {
  return CONTRACT_TYPES.find((c) => c.id === id);
}
