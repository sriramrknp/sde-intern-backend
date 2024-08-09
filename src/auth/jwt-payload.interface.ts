// Interface defining the structure of the JWT payload
export interface JwtPayload {
    username: string; // User's username
    sub: number;      // Subject (usually user ID)
}