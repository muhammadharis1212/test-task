// custom.d.ts
declare namespace Express {
  interface Request {
    user?: {
      id: number;
      username: string;
      role: string;
    };
  }
}
