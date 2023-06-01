import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {

    apiKey: "AIzaSyBP5ncJLtquHKyyOKJRwpUu5JvmJQuOGFQ",

    authDomain: "sec-work.firebaseapp.com",

    databaseURL: "https://sec-work-default-rtdb.firebaseio.com",

    projectId: "sec-work",

    storageBucket: "sec-work.appspot.com",

    messagingSenderId: "675999585152",

    appId: "1:675999585152:web:255914e49a9fb7742ae765"
};

initializeApp(firebaseConfig);

const db = getDatabase();

const inp = document.querySelector('input');
const uploadBtn = document.querySelector('.upload');
const progressImg = document.querySelector('.progressImg');

let reader = new FileReader();

let files = [];

inp.onchange = function(e) {
    files = e.target.files;
    reader.readAsDataURL(e.target.files[0]);
    console.log(files[0]);
}

reader.onload = function() {
    let img = document.querySelector('img');
    img.src = reader.result;
}

function getNameAndEx(file) {
    let nameOfFile = file.name.split('.')[0];
    let exOfFile = file.name.split('.')[1];
    return [nameOfFile, exOfFile];
}

uploadBtn.onclick = async function() {
    let imgToUpload = files[0];
    const metaData = {
        contentType: imgToUpload.type
    }

    const storage = getStorage();

    const storageRef = sRef(storage, "Images/" + getNameAndEx(imgToUpload)[0] + "." + getNameAndEx(imgToUpload)[1]);

    const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
    uploadTask.on('state-changed', (snap) => {
        let progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        progressImg.innerHTML = 'upload: ' + Math.floor(progress) + '%';

    }, (error) => {
        alert("error");
    }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(uploadTask.snapshot.ref);
            console.log(downloadURL);
        })
    })
}

listAll(sRef(getStorage(), "Images")).then((res) => {
    res.items.forEach(element => {
        getDownloadURL(element).then((url) => {
            console.log(url);
        });
    });
})