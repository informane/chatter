import { getUserModel } from "../../../lib/chatter"
import User, { IUser, IUserDocument } from "../../../chatter/models/User";
import { Model } from "mongoose"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/dist/server/api-utils";
import dbConnect from "app/lib/mongodb";
//checked
export const authOptions = {
  // Configure one or more authentication providers
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    /*GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET
    }), 
*/
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      url = '/';
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account, profile, email, credentials }: any) {
      try {
        await dbConnect();
        let UserModel: Model<IUserDocument> = User;
        const UserExists = await UserModel.findOne({ email: user.email });
        if (!UserExists) {
          var UserCreated = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/user', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              google_id: user.id,
              one_signal_user_id: '',
              name: user.name,
              email: user.email,
              avatar: user.image,
              description: '',
              chat_ids: []
            }),
          })

          var res = await UserCreated.json();
          return res;
        }
        return true;
      } catch (error) {
        throw new Error(error);
        return false;
      }
    }
  }
}
const handler = NextAuth(authOptions);

export { handler as POST, handler as GET }