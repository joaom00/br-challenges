import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { User, connectMongoose } from 'service/mongoose'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    })
  ],
  callbacks: {
    async signIn({ user }) {
      await connectMongoose()

      const isUser = await User.findOneAndUpdate({ email: user.email }, user)

      if (isUser) {
        console.log('usuário já cadastrado')
        return true
      }

      await User.create({ ...user, role: 'normal' })

      return true
    },
    async session({ session }) {
      await connectMongoose()

      const { user } = session

      if (user) {
        const userMongo = await User.findOne({ email: user.email })

        return {
          ...session,
          user: {
            ...user,
            ...userMongo._doc
          }
        }
      }

      return session
    }
  }
})
