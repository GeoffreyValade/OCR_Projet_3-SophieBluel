document.formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
        //"this" renvoie à "la valeur de ce formulaire"
    let user = {
        email: this.email.value,
        password: this.password.value,
    };
    
    //envoi des entrées de l'utilisateurs vers le serveur et on attend une réponse fetch('http://localhost:5678/api/users/login'
    fetch('http://localhost:5678/api/users/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(resp=>resp.json())
    .then(json=> {
        if (!json.token) throw new Error('json not ok')
        else {
                sessionStorage.setItem("token", json.token)
                window.location.replace("../index/index.html")
        }
    })
    .catch(err => {
        console.error(err)
        alert('Erreur dans l’identifiant ou le mot de passe')
    })   
})
