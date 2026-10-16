export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AppError {
  message: string;
  status?: number;
}
