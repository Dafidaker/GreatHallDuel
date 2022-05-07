async function loginUser() {
    try {
        console.log("1")
        let name = document.getElementById("name").value;
        let password = document.getElementById("password").value;
        let result = await login(name, password);
        console.log(result)
        if (result.logged == 200 ) {
            alert('wait a swedc')
            window.location = "game.html"
        } else {
            document.getElementById("result").innerHTML = "Wrong username or password";
        }
    } catch (err) {
        console.log(err)
    }
}


