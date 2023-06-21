export interface User {
  _id?: string;
  email: string;
  gamesPlayedToday?: [
    {
      gameId: string;
      timesPlayed: number;
    },
  ];
  prizesWonToday?: string[];
}
