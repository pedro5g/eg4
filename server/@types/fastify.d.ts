import "fastify"

type Payload = {
  accessToken: string
  refreshToken: string
}

declare module "fastify" {
  export interface FastifyRequest {
    // getUserId: () => string
    user: {
      id: string
      role: "ADMIN" | "SELLER" | "CLIENT"
    }
    getCookie: (cookieName: string) => string
  }
  export interface FastifyReply {
    setAuthCookies: ({ accessToken, refreshToken }: Payload) => FastifyReply
    signOut: () => FastifyReply
  }
}
