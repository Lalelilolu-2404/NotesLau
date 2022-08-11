var settingsmenu = document.querySelector(".settings-menu")
var darkBtn = document.getElementById("dark-btn")
var menubar = document.querySelector('.settings-menu-inner')

function settingsMenuToggle(chorip) {
    // console.log(elem.parentElement);
    settingsmenu.classList.add("settings-menu-height");
    document.addEventListener("click", e => {
    if(e.target != chorip && e.target != menubar) {
            settingsmenu.classList.remove("settings-menu-height");
        }
    });
}

darkBtn.onclick = function(){
    darkBtn.classList.toggle("dark-btn-on")
    document.body.classList.toggle("dark-theme")

    if(localStorage.getItem("theme") == "light"){
        localStorage.setItem("theme", "dark");
    }
    else{
        localStorage.setItem("theme", "light");
    }
}


if(localStorage.getItem("theme") == "light"){
    darkBtn.classList.remove("dark-btn-on");
    document.body.classList.remove("dark-theme");
}
else if(localStorage.getItem("theme") == "dark"){
    darkBtn.classList.add("dark-btn-on");
    document.body.classList.add("dark-theme");  
}
else {
    localStorage.setItem("theme","light");
}

localStorage.setItem("theme", "light");
localStorage.getItem("theme");

// Popup notes

const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header img"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"];
// getting localStaorage notestof if exist and parsing them 
// to js object else passing an empty array to notestof
// const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let notes = [];
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Add Letter";
    popupTitle.innerText = "Add a new Letter For Peluchito"
    popupBox.classList.remove("show");
});

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value;

    if(noteTitle != '' && noteDesc != '') {
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear(),
        hh = dateObj.getHours(),
        mm = dateObj.getMinutes(),
        ss = dateObj.getSeconds(),
        ampm = "AM";

        if(hh >= 12){
            hh = hh - 12;
            ampm = "PM";
        }
        hh = hh == 0 ? hh = 12 : hh;
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        ss = ss < 10 ? "0" + ss : ss;

        var etat;
        let noteInfo = {
            title: noteTitle, description: noteDesc,
            date: `${month} ${day}, ${year}`,
            heure: `${hh}: ${mm}: ${ss} ${ampm}`,
            action: etat,
        }
        
        if(!isUpdate) {
            // notes.push(noteInfo); // adding new note to notes
            noteInfo.action = {
                index: -1,
                upnote: 'neutral',
            }
            // console.log(noteInfo);
            transfert(noteInfo);
        } else {
            noteInfo.action = {
                index: updateId,
                upnote: 'update',
            }
            transfert(noteInfo);
        }

        // let etat = {
        //     index: '4',
        //     upnote: 'update',
        // }

        
        // transfert(noteInfo);

        // console.log(noteInfo);

        //  saving notes to local storage
        // localStorage.setItem("notes", JSON.stringify(notes));
        // // console.log(month, day, year);
        closeIcon.click();
        getData();
    }
})
// showNotes();

function showMenu(elem) {
    // console.log(elem.parentElement);
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
    if(e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function updateNote(noteId, title, desc) {
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Letter for Peluchito";
    // console.log(noteId, title, desc);
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure?");
    if(!confirmDel) return;
    let del = {action:{
        index: noteId,
        upnote: 'delete',
    }
    }
    transfert(del);
    getData();
}

async function transfert(noteInfo) {
    const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteInfo)
    };
    const response = await fetch('/api', options);
    const data = await response.json();
    // console.log(data);
}

// //transfert with paramétres
// const api_url = `tofitos/${lat},${lon}`;
// const response = await fetch(api_url);
// const json = await response.json();

async function getData() {
    const response = await fetch('/apiget');
    const notes = await response.json();
    // console.log(notes);
    await showNotes(notes);
}
getData();

async function showNotes(notes) {
    document.querySelectorAll(".note").forEach(note => note.remove());
    // console.log(notes);
    notes.forEach((note, index) => {
            let liTag = `<li class="note">
                            <div class="details">
                                <p>${note.title}</p>
                                <span>${note.description}</span>
                            </div>
                            <div class="botton-content">
                                <div class="datess">
                                    <span>${note.date}</span>
                                    <span id="heure">${note.heure}</span>
                                </div>
                                <div class="settings">
                                    <img onclick="showMenu(this)" src="media/Wow.webp">
                                    <ul class="menu-note">
                                        <li onclick = "updateNote(${index}, '${note.title}', '${note.description}')"><img src="media/Ya veo.webp">Edit</li>
                                        <li onclick = "deleteNote(${index})"><img src="media/Lolxd.webp">Delete</li>      
                                    </ul>
                                </div>
                            </div>
                        </li>`;    
    addBox.insertAdjacentHTML("afterend", liTag)    
    })
}
// getData();