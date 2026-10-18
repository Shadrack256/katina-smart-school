// assets/js/config.js

const SUPABASE_URL = 'https://bsczkxphnueseuodervh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzY3preHBobnVlc2V1b2RlcnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNzM2NjMsImV4cCI6MjEwNzg0OTY2M30.iLxKAO3VbKCvETXsj0MjzGpp4xT_Q505luuV8IF9Hj4';

// Initialize Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. Basic helper function to check if a user is logged in
async function checkSession() {
    const { data: { session }, error } = await db.auth.getSession();
    
    if (!session) {
        // If no session exists, redirect to login
        window.location.href = '../index.html';
    }
    return session;
}