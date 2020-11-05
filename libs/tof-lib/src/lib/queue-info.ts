
export class QueueInfo {
  packageId: string;
  implementationGuideId: string;
  userId?: string;
  userName?: string;
  active: boolean;
  queuedAt: Date;
  publishStartedAt?: Date;
}
