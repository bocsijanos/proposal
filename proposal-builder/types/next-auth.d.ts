import { UserRole } from '@prisma/client'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string | null
    role: UserRole
    avatarUrl: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: UserRole
      avatarUrl: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    avatarUrl: string | null
  }
}
