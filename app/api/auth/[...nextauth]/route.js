var _a, _b;
import User from "../../../chatter/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "app/lib/mongodb";
//checked
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: (_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : '',
            clientSecret: (_b = process.env.GOOGLE_CLIENT_SECRET) !== null && _b !== void 0 ? _b : ''
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
            url = '/chatter';
            if (url.startsWith("/"))
                return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl)
                return url;
            return baseUrl;
        },
        async signIn({ user, account, profile, email, credentials }) {
            try {
                await dbConnect();
                let UserModel = User;
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
                    });
                    var res = await UserCreated.json();
                    return res;
                }
                return true;
            }
            catch (error) {
                throw new Error(error);
                return false;
            }
        }
    }
};
const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
