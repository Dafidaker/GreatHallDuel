async function registerUser(){
    try{
        let name = document.getElementById("name").value;
        let password = document.getElementById("password").value;
        let conf_password = document.getElementById("password_2").value;
        let player = {
            name: name,
            password: password
        };
        if (password == conf_password){
            let result = await register(player);
            if(result.inserted){
                alert("Register was successful");
                window.location = "index.html"
            }else{
                document.getElementById("result").innerHTML = "Not able to register";
            }
        } else {
            alert("Password dosen't match")
        }
    } catch(err){
        console.log(err)
    }
}