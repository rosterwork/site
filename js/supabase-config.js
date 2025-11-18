const SUPABASE_URL = 'https://dyrroflwjsntlunwteod.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cnJvZmx3anNudGx1bnd0ZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTQ1NjEsImV4cCI6MjA3Nzc3MDU2MX0.ItqYhIeLNAnhRCUjIGRmIXKE_skDk4s1JH816cf7Cto';

// === REMOVER ESTA PARTE QUANDO SISTEMA ESTIVER PRONTO ===
const SUPABASE_SECRET_KEY_LOCAL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cnJvZmx3anNudGx1bnd0ZW9kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NDU2MSwiZXhwIjoyMDc3NzcwNTYxfQ.pNaZmHp4k8CYVrQLfPWcpCa-xNLqVJL8FRlSGzDQoxY';
const isLocalSupabase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// === FIM DA PARTE PARA REMOVER ===

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('Biblioteca Supabase não carregada!');
    return null;
  }
  
  if (!supabaseClient) {
    // Detecção automática de ambiente
    const key = isLocalSupabase ? SUPABASE_SECRET_KEY_LOCAL : SUPABASE_ANON_KEY;
    supabaseClient = supabase.createClient(SUPABASE_URL, key);
  }
  
  return supabaseClient;
}

function getSupabaseClient() {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

async function testSupabaseConnection() {
  try {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Cliente Supabase não inicializado');
    }
    
    const { data, error } = await client
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro na conexão Supabase:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Conexão estabelecida' };
    
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return { success: false, error: error.message };
  }
}