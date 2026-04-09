import type { ComponentType } from "react";
import type { ContractData } from "./contract";

export interface StepConfig {
  key: string;
  componentKey: string;
  title: string;
  validate: (data: ContractData) => boolean;
}

export interface ContractTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: StepConfig[];
  pdfComponentKey: string;
}

export type StepComponentRegistry = Record<string, ComponentType>;
export type PdfComponentRegistry = Record<
  string,
  ComponentType<{ data: ContractData; showWatermark: boolean }>
>;
