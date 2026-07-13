// This route exists so `/signin` resolves. The sign-in UI itself is rendered
// by the Amplify <Authenticator> in ../authProvider.tsx, which gates this page.
// Authenticated users are redirected to "/" by that provider, so this content
// is only a brief placeholder.
export default function SignInPage() {
  return null;
}
