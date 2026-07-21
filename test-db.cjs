const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://klrkdizvnhlbcvrpfnob.supabase.co', 'sb_publishable_CXSVC0sTM7XRs2uRD4WcNQ_uk1OCUyr');

async function test() {
  console.log('Testing users table...');
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error fetching users:', error.message);
  } else {
    console.log('Users table exists! Rows:', data.length);
  }
}
test();
