// app/api/auth/[...nextauth]/auth-options.ts
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'
import type { NextAuthOptions } from 'next-auth'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user && user.email) {
        const clientData = {
          email: user.email,
          name: user.name,
          mobile: null,
          is_guest: false,
          provider: account?.provider,
          provider_id: account?.providerAccountId,
          image_url: user.image,
          given_name: (profile as any)?.given_name,
          family_name: (profile as any)?.family_name,
          locale: (profile as any)?.locale,
          verified_email: (profile as any)?.email_verified ?? true,
          last_login_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('clients')
          .upsert(clientData, { onConflict: 'email' })
          .select();

        if (error) {
          console.error('Error upserting client:', error);
        } else {
          console.log('Client upserted successfully:', data);
        }
      } else {
        console.log('No user or email provided');
      }

      return true
    }
  }
}
