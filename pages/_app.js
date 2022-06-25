import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import UserProvider from "../context/user";
import CustomNavbar from "../components/navbar";

import "../styles/main.scss";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      checkUser();
    });
    checkUser();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
  }

  function logout() {
    supabase.auth.signOut();
    setUser(null);
    window.location.reload(false);
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserProvider>
        <div>
          <CustomNavbar user={user} logout={logout}></CustomNavbar>
          <div className="py-8 px-16">
            <Component {...pageProps} />
          </div>
        </div>
      </UserProvider>
    </>
  );
}

export default MyApp;
