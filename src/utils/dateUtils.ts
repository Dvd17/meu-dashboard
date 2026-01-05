export type RenewalStatus = 'expired' | 'warning' | 'ok';

export function getRenewalStatus(dateString: string): RenewalStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewalDate = new Date(dateString);
    renewalDate.setHours(0, 0, 0, 0);

    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'warning';
    return 'ok';
}
