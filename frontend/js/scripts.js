function logar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token); // Salva o token no navegador
                document.getElementById('login').style.display = 'none';
                document.getElementById('recados').style.display = 'block';
                carregarRecados();
            } else {
                alert('Erro ao fazer login!');
            }
        });
}


function carregarRecados() {
    const token = localStorage.getItem('token'); // Recupera o token salvo

    fetch('http://localhost:3000/recados', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById('lista-recados');
            lista.innerHTML = '';
            data.forEach(recado => {
                const li = document.createElement('li');
                li.textContent = `${recado.conteudo} - ${recado.data_envio}`;
                lista.appendChild(li);
            });
        })
        .catch(err => {
            alert('Erro ao carregar recados!');
        });
}

// novo

function adicionarRecado() {
    const token = localStorage.getItem('token');
    const conteudo = prompt("Digite o seu recado:");

    if (!conteudo) {
        alert("Recado não pode ser vazio!");
        return;
    }

    fetch('http://localhost:3000/recados/criar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ conteudo, usuario_id: 1 }) // Alterar conforme o usuário logado
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert("Recado adicionado com sucesso!");
            carregarRecados();
        } else {
            alert("Erro ao adicionar recado!");
        }
    });
}
