import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Avatar from '../components/avatar'
import UserProvider from '../context/user'
import Account from '../components/account'

export default function Settings({ session }) {
    return (
        <Account />
    )
}
