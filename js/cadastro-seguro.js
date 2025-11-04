async function enviarCadastroSeguro(dadosCadastro) {
    try {
        const response = await fetch('https://api.github.com/repos/rosterwork/action/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'manual-cadastro',
                client_payload: {
                    dados: dadosCadastro,
                    timestamp: new Date().toISOString(),
                    origem: 'site-github-pages'
                }
            })
        });
        
        if (response.ok) {
            return { success: true, message: 'Cadastro enviado para processamento' };
        } else {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

if (typeof window !== 'undefined') {
    window.enviarCadastroSeguro = enviarCadastroSeguro;
}