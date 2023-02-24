document.formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
        //"this" renvoie à "la valeur ce formulaire"
        let user = {
            email: this.email.value,
            password: this.password.value,
        };
    
        //on envoie les entrées de l'utilisateurs vers le serveur et on attend une réponse fetch('http://localhost:5678/api/users/login', {
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
            alert('Email ou mot de passe incorrect')
        })
    
    })

/*document.formLogin.addEventListener('submit', async function(e) {
e.preventDefault();
    //"this" renvoie à "la valeur ce formulaire"
    let user = {
        email: this.email.value,
        password: this.password.value,
    };

    //on envoie les entrées de l'utilisateurs vers le serveur et on attend une réponse
    let response = await fetch('http://localhost:5678/api/users/login', {
        method: 'post',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    const result = await response.json();
    window.localStorage.setItem("token", result.token);

    //Redirige user vers index si la réponse existe
    if (response.ok){
        console.log(result);
        window.location.replace("../index/index.html"); 
    }

    //Affiche message d'erreur si mdp ou user incorrect
    //Voir pour mettre un message plus joli ?
    else {
        alert('Email ou mot de passe incorrect')
    }

})*/



