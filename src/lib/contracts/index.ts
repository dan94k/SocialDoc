import { socialMediaMonthlyConfig } from "./social-media-monthly";
import { packageArtsConfig } from "./package-arts";
import type { GenericContractTypeConfig } from "@/types/contract-engine";

export const CONTRACT_TYPES: GenericContractTypeConfig[] = [
  socialMediaMonthlyConfig,
  packageArtsConfig,
];

export function getContractType(id: string): GenericContractTypeConfig | undefined {
  return CONTRACT_TYPES.find((c) => c.id === id);
}
