import { socialMediaMonthlyConfig } from "./social-media-monthly";
import type { ContractTypeConfig } from "@/types/contract-config";

export const CONTRACT_TYPES: ContractTypeConfig[] = [
  socialMediaMonthlyConfig,
];

export function getContractType(id: string): ContractTypeConfig | undefined {
  return CONTRACT_TYPES.find((c) => c.id === id);
}
