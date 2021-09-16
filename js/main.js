var rowId = 0;
var catBreeds = [];
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const dbName = "petDB";
const myLocalStorage = window.localStorage;

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

var request = indexedDB.open(dbName, 2);

request.onerror = function(event) {
    console.log("Database error");
};
request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("pets", { keyPath: "id" });
    objectStore.createIndex("petNameInput", "petNameInput", { unique: false });
};

var case1 = document.getElementById("case1");
var case2 = document.getElementById("case2");
var case3 = document.getElementById("case3");
var case4 = document.getElementById("case4");

function updata(){
    var request = indexedDB.open(dbName, 2);
    request.onsuccess = function(event) {
        var db = event.target.result;
        var tx = db.transaction("pets");
        var objectStore = tx.objectStore("pets");
        objectStore.getAll().onsuccess = function(event) {
            console.log(event.target.result);
            rowId = event.target.result.length;
            if(rowId>0){
                for(let i=0;i<rowId;i++){
                    let tr = document.createElement("tr")
                    tr.setAttribute("id", "row-" + (i+1));            
                    let tdimg = document.createElement("td");
                    let img = document.createElement("img");
                    let myLocalStorage = window.localStorage;
                    let imagen = myLocalStorage.getItem(i+1)
                    console.log(imagen)
                    img.setAttribute("class","rounded")
                    img.setAttribute("id","img-"+(i+1))
                    img.setAttribute("alt","Cinque Terre")
                    img.setAttribute("width","200" )
                    img.setAttribute("height","156")
                    img.setAttribute("src",imagen)
                    tdimg.appendChild(img);
                    tr.appendChild(tdimg); 
                    let pet= {
                        dateinput : event.target.result[i].dateinput,                        
                        ownername: event.target.result[i].ownername,
                        petname: event.target.result[i].petname,
                        microchipnum: event.target.result[i].microchipnum,
                        petage: event.target.result[i].petage,
                        petspecie: event.target.result[i].petspecie,
                        petsex: event.target.result[i].petsex,
                        petsize: event.target.result[i].petsize,
                        dangerousinput: event.target.result[i].dangerousinput,
                        esterilizadoinput: event.target.result[i].esterilizadoinput,
                        neightborinput: event.target.result[i].neightborinput,

                    }
                    Object.keys(pet).forEach((key) => {
                        let td = document.createElement("td");
                        td.innerHTML= pet[key];
                        tr.appendChild(td);
                    });
                    let tdActions = document.createElement("td");

                    let input = document.createElement("input");
                    input.setAttribute("id", "delete-" + (i+1));
                    input.setAttribute("type", "button");
                    input.value = "Eliminar";
                    input.onclick = function() {
                        
                        let id = this.getAttribute("id");
                        id = +id.replace("delete-", "");
                        document.getElementById("row-" + id).remove();
                        var id2 = id-1
                        deleteData(id2);
                        
                        myLocalStorage.removeItem(id)
                    };
                    
                    tdActions.appendChild(input);
                    //tr.appendChild(tdActions);
                    let inputeditar = document.createElement("input");
                    inputeditar.setAttribute("id", "editar-" + (i+1));
                    inputeditar.setAttribute("type", "button");
                    inputeditar.setAttribute("data-toggle","modal" )
                    inputeditar.value = "Editar";
                    

                    inputeditar.onclick = function() {
                        console.log("se leyo editar 1")
                        let id = this.getAttribute("id");
                        id = +id.replace("editar-", "");
                        if(event.target.result[(id-1)].microchipnum==""&& event.target.result[(id-1)].esterilizadoinput=="No"){
                            document.getElementById("editar-"+id).setAttribute("data-target","case1")
                            case1.style.display = "block";
                            case1.style.paddingRight = "17px";
                            case1.className="modal fade show";
                            document.getElementById("lable-m").setAttribute("class",+id+"");
                        }else if(event.target.result[(id-1)].microchipnum==""&& event.target.result[(id-1)].esterilizadoinput=="Si"){
                            document.getElementById("editar-"+id).setAttribute("data-target","case2")
                            case2.style.display = "block";
                            case2.style.paddingRight = "17px";
                            case2.className="modal fade show";
                            document.getElementById("lable-m").setAttribute("class",+id+"");
                        }else if(event.target.result[(id-1)].microchipnum!=""&& event.target.result[(id-1)].esterilizadoinput=="No"){
                            document.getElementById("editar-"+id).setAttribute("data-target","case3")
                            case3.style.display = "block";
                            case3.style.paddingRight = "17px";
                            case3.className="modal fade show";
                            document.getElementById("lable-e").setAttribute("class",+id+"");
                        }else{
                            document.getElementById("editar-"+id).setAttribute("data-target","case4")
                            case4.style.display = "block";
                            case4.style.paddingRight = "17px";
                            case4.className="modal fade show";
                            document.getElementById("lable-l").setAttribute("class",+id+"");
                        }
                    };
                
                    tdActions.appendChild(inputeditar);
                    tr.appendChild(tdActions);
                    document.getElementById("body-table").appendChild(tr);
                    
                    
                }
            
                
            }
        };
        
    };
};    
updata(); 

 
document.getElementById("save-edit1").onclick= function(){
    let id = document.getElementById("lable-m").getAttribute("class")
    document.getElementById("lable-m").removeAttribute("class")
    var request = indexedDB.open(dbName, 2);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var objectStore = db.transaction("pets", "readwrite").objectStore("pets");
		objectStore.getAll().onsuccess = function (event) {
            
            if(document.getElementById("microchip-edit").value!=""){
                event.target.result[(id-1)].microchipnum=document.getElementById("microchip-edit").value
                let date = new Date().toString();
                event.target.result[(id-1)].datemicrochip= date;
            }
            if(document.getElementById("esterilizado-edit").value!=""){
                event.target.result[(id-1)].esterilizadoinput=document.getElementById("esterilizado-edit").value
                let date = new Date().toString();
                event.target.result[(id-1)].dateesterilizado=date;
            }
            if(document.getElementById("size-edit").value!=""){
                event.target.result[(id-1)].petsize=document.getElementById("size-edit").value  
            }
            if(document.getElementById("dangerous-edit").value!=""){
                event.target.result[(id-1)].dangerousinput=document.getElementById("dangerous-edit").value                
            }
            if(document.getElementById("neightbor-edit").value!=""){
                event.target.result[(id-1)].neightborinput=document.getElementById("neightbor-edit").value
            }
            if(document.getElementById("neightbor-edit").value!=""||document.getElementById("dangerous-edit").value!=""||document.getElementById("size-edit").value!=""){
                let date = new Date().toString();
                event.target.result[(id-1)].dateedit=date;
            }

            var requestUpdate = objectStore.put(event.target.result[(id-1)]);
			requestUpdate.onsuccess = function(event){
				case1.style.display = "none";
  			    case1.className="modal fade";
  			    alert("Actualizado");
  			    window.location.reload();
			}

        }
    }

};
document.getElementById("close-edit1").onclick=function() {
    case1.style.display = "none";
    case1.className="modal fade";
};

document.getElementById("save-edit2").onclick= function(){
    let id = document.getElementById("lable-m").getAttribute("class")
    document.getElementById("lable-m").removeAttribute("class")
    var request = indexedDB.open(dbName, 2);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var objectStore = db.transaction("pets", "readwrite").objectStore("pets");
		objectStore.getAll().onsuccess = function (event) {
            
            if(document.getElementById("microchip-edit2").value!=""){
                event.target.result[(id-1)].microchipnum=document.getElementById("microchip-edit2").value
                let date = new Date().toString();
                event.target.result[(id-1)].datemicrochip= date;
            }
            if(document.getElementById("size-edit2").value!=""){
                event.target.result[(id-1)].petsize=document.getElementById("size-edit2").value  
            }
            if(document.getElementById("dangerous-edit2").value!=""){
                event.target.result[(id-1)].dangerousinput=document.getElementById("dangerous-edit2").value                
            }
            if(document.getElementById("neightbor-edit2").value!=""){
                event.target.result[(id-1)].neightborinput=document.getElementById("neightbor-edit2").value
            }
            if(document.getElementById("neightbor-edit2").value!=""||document.getElementById("dangerous-edit2").value!=""||document.getElementById("size-edit2").value!=""){
                let date = new Date().toString();
                event.target.result[(id-1)].dateedit=date;
            }

            var requestUpdate = objectStore.put(event.target.result[(id-1)]);
			requestUpdate.onsuccess = function(event){
				case2.style.display = "none";
  			    case2.className="modal fade";
  			    alert("Actualizado");
  			    window.location.reload();
			}

        }
    }

};
document.getElementById("close-edit2").onclick=function() {
    case2.style.display = "none";
    case2.className="modal fade";
};

document.getElementById("save-edit3").onclick= function(){
    let id = document.getElementById("lable-e").getAttribute("class")
    document.getElementById("lable-e").removeAttribute("class")
    var request = indexedDB.open(dbName, 2);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var objectStore = db.transaction("pets", "readwrite").objectStore("pets");
		objectStore.getAll().onsuccess = function (event) {
            
            if(document.getElementById("esterilizado-edit3").value!=""){
                event.target.result[(id-1)].esterilizadoinput=document.getElementById("esterilizado-edit3").value
                let date = new Date().toString();
                event.target.result[(id-1)].dateesterilizado=date;
            }
            if(document.getElementById("size-edit3").value!=""){
                event.target.result[(id-1)].petsize=document.getElementById("size-edit3").value  
            }
            if(document.getElementById("dangerous-edit3").value!=""){
                event.target.result[(id-1)].dangerousinput=document.getElementById("dangerous-edit3").value                
            }
            if(document.getElementById("neightbor-edit3").value!=""){
                event.target.result[(id-1)].neightborinput=document.getElementById("neightbor-edit3").value
            }
            if(document.getElementById("neightbor-edit3").value!=""||document.getElementById("dangerous-edit3").value!=""||document.getElementById("size-edit3").value!=""){
                let date = new Date().toString();
                event.target.result[(id-1)].dateedit=date;
            }

            var requestUpdate = objectStore.put(event.target.result[(id-1)]);
			requestUpdate.onsuccess = function(event){
				case3.style.display = "none";
  			    case3.className="modal fade";
  			    alert("Registro Actualizado");
  			    window.location.reload();
			}

        }
    }

};
document.getElementById("close-edit3").onclick=function() {
    case3.style.display = "none";
    case3.className="modal fade";
};

document.getElementById("save-edit4").onclick= function(){
    let id = document.getElementById("lable-l").getAttribute("class")
    document.getElementById("lable-l").removeAttribute("class")
    var request = indexedDB.open(dbName, 2);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var objectStore = db.transaction("pets", "readwrite").objectStore("pets");
		objectStore.getAll().onsuccess = function (event) {
            
            if(document.getElementById("size-edit4").value!=""){
                event.target.result[(id-1)].petsize=document.getElementById("size-edit4").value  
            }
            if(document.getElementById("dangerous-edit4").value!=""){
                event.target.result[(id-1)].dangerousinput=document.getElementById("dangerous-edit4").value                
            }
            if(document.getElementById("neightbor-edit4").value!=""){
                event.target.result[(id-1)].neightborinput=document.getElementById("neightbor-edit4").value
            }
            if(document.getElementById("neightbor-edit4").value!=""||document.getElementById("dangerous-edit4").value!=""||document.getElementById("size-edit4").value!=""){
                let date = new Date().toString();
                event.target.result[(id-1)].dateedit=date;
            }

            var requestUpdate = objectStore.put(event.target.result[(id-1)]);
			requestUpdate.onsuccess = function(event){
				case4.style.display = "none";
  			    case4.className="modal fade";
  			    alert("Registro Actualizado");
  			    window.location.reload();
			}

        }
    }

};
document.getElementById("close-edit4").onclick=function() {
    case4.style.display = "none";
    case4.className="modal fade";
};

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
};    

(function() {
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                console.log(form.checkValidity())
                event.preventDefault();
                event.stopPropagation();
            }else if(form.checkValidity()===true){
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
                    datemicrochip: "",
                    dateesterilizado: "",
                    dateedit: "",
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
                        img.setAttribute("id","img-"+rowId)
                        img.setAttribute("width","200" )
                        img.setAttribute("height","156")
                        img.setAttribute("src",data.message);
                        let myLocalStorage = window.localStorage;
            	        myLocalStorage.setItem(rowId, data.message);
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
                            img.setAttribute("id","img-"+rowId)
                            img.setAttribute("alt","Cinque Terre")
                            img.setAttribute("width","200" )
                            img.setAttribute("height","156")
                            img.setAttribute("src",image)
                            let myLocalStorage = window.localStorage;
            	            myLocalStorage.setItem(rowId, image);
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
                            
                tdActions.appendChild(input);
                
                let inputeditar = document.createElement("input");
                inputeditar.setAttribute("id", "editar-" + rowId);
                inputeditar.setAttribute("type", "button");
                inputeditar.value = "Editar";  
                event.preventDefault();
                event.stopPropagation();
                            
                tdActions.appendChild(inputeditar);
                tr.appendChild(tdActions);
                document.getElementById("body-table").appendChild(tr);
                var request = indexedDB.open(dbName, 2);
                request.onsuccess = function(event) {
                   var db = event.target.result;
                   var customerObjectStore = db.transaction("pets", "readwrite").objectStore("pets");
                   pet["id"] = rowId;
                   
                   customerObjectStore.add(pet);
                   alert("Registro creado");     
                    window.location.reload()
               };

               console.log(document.getElementById("row-"+rowId))
            };
            form.classList.add('was-validated');
        }, false);
    });       
    ;
})();

function deleteData(id) {
    var request = indexedDB.open(dbName, 2);
        request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction("pets", "readwrite")
  
        transaction.oncomplete = function(event) {
            console.log("delete completed");
        };
    
        transaction.onerror = function(event) {
            console.log("Database error "+ transaction.error );
        };
    
        var objectStore = transaction.objectStore("pets");
    
        var objectStoreRequest = objectStore.delete(id);
    
        objectStoreRequest.onsuccess = function(event) {
        console.log("Request successful.");
        };
    }; 
};

document.getElementById("filter-button").onclick=function(){
    
    let speciefilter = document.getElementById("filterespecies-input").value;
    let sexfilter = document.getElementById("filtersex-input").value;
    let sizefilter = document.getElementById("filtersize-input").value;
    let microchipilter = document.getElementById("filtermicrochip-input").value;
    let dangerousfilter = document.getElementById("filterdangeruos-input").value;
    let esterilizadofilter = document.getElementById("filteresterilizado-input").value;
    var request = indexedDB.open(dbName, 2);
    request.onsuccess = function(event) {
        var db = event.target.result;
        var tx = db.transaction("pets");
        var objectStore = tx.objectStore("pets");
        objectStore.getAll().onsuccess = function(event) {
            if(rowId>0){
                if((speciefilter=="Seleccione")&& (sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petspecie!=speciefilter){
                            var num=j+1;
                            document.getElementById("row-"+num).remove();
                        }
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (speciefilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petsex!=sexfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&&(speciefilter=="Seleccione")&&(microchipilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petsize!=sizefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                    }
                }
                //filro solo microchip
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&(speciefilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].microchipnum==""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].microchipnum!=""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&&(speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].dangerousinput!=dangerousfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                    }
                }
                else if((speciefilter=="Seleccione")&&(sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&microchipilter=="Seleccione"){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].esterilizadoinput!=esterilizadofilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                        
                    }
                }
                //microchip
                else if((speciefilter=="Seleccione")&&(sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&dangerousfilter=="Seleccione"){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].microchipnum==""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].microchipnum!=""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                   
                    }
                }
                else if((speciefilter=="Seleccione")&&(sexfilter=="Seleccione")&&(microchipilter=="Seleccione")&&dangerousfilter=="Seleccione"){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsize!=sizefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                        
                    }
                }
                else if((speciefilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&&dangerousfilter=="Seleccione"){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsex!=sexfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                        
                    }
                }
                else if((sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&&dangerousfilter=="Seleccione"){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petspecie!=speciefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }
                        
                    }
                }
                else if((speciefilter=="Seleccione")&&(sexfilter=="Seleccione")&&(sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].microchipnum==""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].microchipnum!=""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                   
                    }
                }
                else if((speciefilter=="Seleccione")&&(sexfilter=="Seleccione")&&(microchipilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].petsize!=sizefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }                  
                    }
                }
                else if((speciefilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].petsex!=sexfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }                  
                    }
                }
                else if((sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&&(microchipilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].petspecie!=speciefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }                  
                    }
                }
                else if((sexfilter=="Seleccione")&&(speciefilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsize!=sizefilter || event.target.result[j].microchipnum==""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsize!=sizefilter || event.target.result[j].microchipnum!=""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((sizefilter=="Seleccione")&&(speciefilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsex!=sexfilter || event.target.result[j].microchipnum==""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsex!=sexfilter || event.target.result[j].microchipnum!=""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((sizefilter=="Seleccione")&&(sexfilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petspecie!=speciefilter || event.target.result[j].microchipnum==""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petspecie!=speciefilter || event.target.result[j].microchipnum!=""){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((microchipilter=="Seleccione")&&(speciefilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsize!=sizefilter || event.target.result[j].petsex!=sexfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }                
                    }
                }
                else if((microchipilter=="Seleccione")&&(sexfilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsize!=sizefilter || event.target.result[j].petspecie!=speciefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }                
                    }
                } 
                else if((microchipilter=="Seleccione")&&(sizefilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].petsex!=sexfilter || event.target.result[j].petspecie!=speciefilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }                
                    }
                }  
                else if((speciefilter=="Seleccione")&&(sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter ||event.target.result[j].dangerousinput!=dangerousfilter  || event.target.result[j].microchipnum==""|| event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].microchipnum!=""|| event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                } 
                else if((speciefilter=="Seleccione")&&(sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter ||event.target.result[j].dangerousinput!=dangerousfilter  || event.target.result[j].microchipnum==""|| event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].microchipnum!=""|| event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((sexfilter=="Seleccione")&&(sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter ||event.target.result[j].dangerousinput!=dangerousfilter  || event.target.result[j].microchipnum==""|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter || event.target.result[j].dangerousinput!=dangerousfilter || event.target.result[j].microchipnum!=""|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((speciefilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((sexfilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }                
                    }
                }
                else if((microchipilter=="Seleccione")&&(dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                    
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter  ||  event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter|| event.target.result[j].petspecie!=speciefilter){
                            
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((microchipilter=="Seleccione")&&(speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                    
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter  ||event.target.result[j].dangerousinput!=dangerousfilter||  event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter){
                            
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((microchipilter=="Seleccione")&&(sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                    
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter  ||event.target.result[j].dangerousinput!=dangerousfilter||  event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((microchipilter=="Seleccione")&&(sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                    
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter  ||event.target.result[j].dangerousinput!=dangerousfilter||  event.target.result[j].petsex!=sexfilter|| event.target.result[j].petspecie!=speciefilter){
                            
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((sexfilter=="Seleccione")&&(sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].petsex!=sexfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dpetsex!=sexfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((microchipilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].petsex!=sexfilter|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                            document.getElementById("row-" + (j+1)).remove();
                        }   
                    }
                }
                else if((sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter   || event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsex!=sexfilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsex!=sexfilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].petsex!=sexfilter   || event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].petsex!=sexfilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter!="Seleccione")&& (sexfilter!="Seleccione")&&(sizefilter!="Seleccione")&&(microchipilter!="Seleccione")&&(dangerousfilter!="Seleccione")&& (speciefilter!="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  ||event.target.result[j].petsex!=sexfilter   || event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if(event.target.result[j].esterilizadoinput!=esterilizadofilter  ||event.target.result[j].petsex!=sexfilter  || event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter|| event.target.result[j].petsize!=sizefilter|| event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&&(sizefilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&&(microchipilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petsize!=sizefilter|| event.target.result[j].dangerousinput!=dangerousfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }     
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petsex!=sexfilter|| event.target.result[j].dangerousinput!=dangerousfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }     
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sizefilter=="Seleccione")&&(microchipilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petspecie!=speciefilter|| event.target.result[j].dangerousinput!=dangerousfilter){
                        
                            document.getElementById("row-" + (j+1)).remove();
                        }     
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sizefilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sizefilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (microchipilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petsex!=sexfilter|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter){    
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (microchipilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petspecie!=speciefilter|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter){    
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (microchipilter=="Seleccione")&& (sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petspecie!=speciefilter|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsex!=sexfilter){    
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsize!=sizefilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (microchipilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if( event.target.result[j].petsize!=sizefilter|| event.target.result[j].dangerousinput!=dangerousfilter||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter){
                            document.getElementById("row-" + (j+1)).remove();
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")&& (sexfilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")&& (sizefilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")&& (sizefilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petsize!=sizefilter||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petsize!=sizefilter||event.target.result[j].petsex!=sexfilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petsize!=sizefilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petsize!=sizefilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")&& (sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione")&& (dangerousfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(microchipilter=="Si"){
                            if( event.target.result[j].microchipnum==""||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter||event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }else if(microchipilter=="No"){
                            if( event.target.result[j].microchipnum!=""||event.target.result[j].petsex!=sexfilter||event.target.result[j].petspecie!=speciefilter||event.target.result[j].petsize!=sizefilter){
                            
                                document.getElementById("row-" + (j+1)).remove();
                            }
                        }        
                    }
                }
                else if((esterilizadofilter=="Seleccione") && (dangerousfilter=="Seleccione")&& (microchipilter=="Seleccione")&& (speciefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petsex!=sexfilter || event.target.result[j].petsize!=sizefilter){            
                            document.getElementById("row-" + (j+1)).remove();
                        }                    
                    }
                }
                else if((esterilizadofilter=="Seleccione") && (dangerousfilter=="Seleccione")&& (microchipilter=="Seleccione")&& (sexfilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petspecie!=speciefilter || event.target.result[j].petsize!=sizefilter){            
                            document.getElementById("row-" + (j+1)).remove();
                        }                    
                    }
                }
                else if((esterilizadofilter=="Seleccione") && (dangerousfilter=="Seleccione")&& (microchipilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petspecie!=speciefilter || event.target.result[j].petsize!=sizefilter|| event.target.result[j].petsex!=sexfilter){            
                            document.getElementById("row-" + (j+1)).remove();
                        }                    
                    }
                }
                else if((esterilizadofilter=="Seleccione") && (dangerousfilter=="Seleccione")&& (microchipilter=="Seleccione")&& (sizefilter=="Seleccione")){
                    
                    for(let j=0;j<rowId;j++){
                        if(event.target.result[j].petspecie!=speciefilter || event.target.result[j].petsex!=sexfilter){            
                            document.getElementById("row-" + (j+1)).remove();
                        }                    
                    }
                }
                document.getElementById("filterespecies-input").setAttribute("disabled","disabled");
                document.getElementById("filtersex-input").setAttribute("disabled","disabled");
                document.getElementById("filtersize-input").setAttribute("disabled","disabled");
                document.getElementById("filtermicrochip-input").setAttribute("disabled","disabled");
                document.getElementById("filterdangeruos-input").setAttribute("disabled","disabled");
                document.getElementById("filteresterilizado-input").setAttribute("disabled","disabled");
                document.getElementById("filter-button").setAttribute("disabled","disabled")  ;           
            }
        }
    }
}

document.getElementById("cleanfilter-button").onclick=function(){
    for(let i=0;i<rowId;i++){
        try {
            document.getElementById("row-" + (i+1)).remove();
        } catch (error) {
            console.log("i="+i);
        }
        
    }
    updata();
    document.getElementById("filterespecies-input").removeAttribute("disabled");
    document.getElementById("filtersex-input").removeAttribute("disabled");
    document.getElementById("filtersize-input").removeAttribute("disabled");
    document.getElementById("filtermicrochip-input").removeAttribute("disabled");
    document.getElementById("filterdangeruos-input").removeAttribute("disabled");
    document.getElementById("filteresterilizado-input").removeAttribute("disabled");
    document.getElementById("filter-button").removeAttribute("disabled");
}

