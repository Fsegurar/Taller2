var rowId = 0;
var catBreeds = [];

fetch("https://dog.ceo/api/breed/retriever/golden/images/random")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        document.getElementById("dogimage").setAttribute("src",data.message)   
    });

fetch("https://api.thecatapi.com/v1/images/search")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        document.getElementById("catimage").setAttribute("src", data[0].url)
    });
fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then(data => {       
        let petBreed = document.getElementById("dograza-input");
        Object.keys(data.message).map((breed) => {
            let option = document.createElement("option");
            option.innerHTML = breed;
            petBreed.appendChild(option);
        });
    });

fetch('https://api.thecatapi.com/v1/breeds')
	.then(response => response.json())
	.then(data => {
        catBreeds = data;
        let catBreed = document.getElementById("catraza-input");
        data.forEach((breed) => {
            let option = document.createElement("option");
            option.innerHTML = breed.name;
            catBreed.appendChild(option);
        }); 
    });
    
document.getElementById("petspecies-input").onclick = function(){    
    let raza =document.getElementById("petspecies-input").value;
    if(raza=="Perro"){
        console.log("Perro")
        document.getElementById("dograza-input").removeAttribute("disabled")
        document.getElementById("catraza-input").setAttribute("disabled",true)
    }else if(raza=="Gato"){
        console.log("gato")
        document.getElementById("catraza-input").removeAttribute("disabled")
        document.getElementById("dograza-input").setAttribute("disabled",true)
    }
}    

document.getElementById("petsave-button").onclick = function savePet() {
    rowId += 1;
    let pet = {
        dateinput : document.getElementById("date-input").value,
        ownername: document.getElementById("owner-input").value,
        petname: document.getElementById("petname-input").value,
        microchipnum: document.getElementById("petmicrochip-input").value,
        petage: document.getElementById("petage-input").value,
        petspecie: document.getElementById("petspecies-input").value,
        petsex: document.getElementById("petsex-input").value,
        petsize: document.getElementById("petsize-input").value,
        dangerousinput: document.getElementById("dangerous-input").value,
        esterilizadoinput: document.getElementById("esterilizado-input").value,
        neightborinput: document.getElementById("neightbor-input").value,
        
    };

    let tr = document.createElement("tr")
    tr.setAttribute("id", "row-" + rowId);

    let raza =document.getElementById("petspecies-input").value;
    if(raza=="Perro"){
        let tdimg = document.createElement("td");
        let img = document.createElement("img");
        let breed = document.getElementById("dograza-input").value;
        fetch('https://dog.ceo/api/breed/' + breed + '/images/random')
			.then(response => response.json())
			.then(data => {
                img.setAttribute("class","rounded")
                img.setAttribute("alt","Cinque Terre")
                img.setAttribute("width","200" )
                img.setAttribute("height","156")
				img.setAttribute("src",data.message);
			}); 
        tdimg.appendChild(img);
	    tr.appendChild(tdimg); 
    }else if(raza=="Gato"){
        let tdimg = document.createElement("td");
        let img = document.createElement("img");
        let breedName = document.getElementById("catraza-input").value;
		let breedId =catBreeds.find(breed => breedName==breed.name).id;
        fetch('https://api.thecatapi.com/v1/images/search?breed_ids='+breedId)
			.then(response => response.json())
			.then(data => {
				let catimage = data.map(cat=>cat.url);
				
				catimage.forEach(function(image)  {
                    img.setAttribute("class","rounded")
                    img.setAttribute("alt","Cinque Terre")
                    img.setAttribute("width","200" )
                    img.setAttribute("height","156")
					img.setAttribute("src",image)
				});
            });    
        tdimg.appendChild(img);
	    tr.appendChild(tdimg); 
    }
    
    Object.keys(pet).forEach((key) => {
        let td = document.createElement("td");
        td.innerHTML= pet[key];
        tr.appendChild(td);
    });
    let tdActions = document.createElement("td");

	let input = document.createElement("input");
    input.setAttribute("id", "delete-" + rowId);
    input.setAttribute("type", "button");
	input.value = "Eliminar";
    input.onclick = function() {
        let id = this.getAttribute("id");
		id = +id.replace("delete-", "");
		document.getElementById("row-" + id).remove();
    };
    tdActions.appendChild(input);
	tr.appendChild(tdActions);
	document.getElementById("body-table").appendChild(tr);
};