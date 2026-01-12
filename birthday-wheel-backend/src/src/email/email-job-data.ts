export interface EmailJobData {
  user: { name: string; email: string };
  prize: { name: string; description?: string; id: number };
}
