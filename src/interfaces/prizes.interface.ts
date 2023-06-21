export interface Prize {
  name: string;
  rules: {
    originalDailyLimit: number;
    dailyLimit: number;
    totalSupply: number;
    supplyLeft: number;
  };
}
