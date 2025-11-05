async function enviarCadastroSeguro(dadosCadastro) {
    try {
        const response = await fetch('https://sua-api-vercel.vercel.app/api/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCadastro)
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