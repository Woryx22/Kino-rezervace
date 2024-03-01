function cena(cena){
    window.location.href="index.html";
    // console.log(cena);
    sessionStorage.setItem("cena", cena);
}
function idFilmu(idf){
    window.location.href="index.html";
    // console.log(idf);
    sessionStorage.setItem("idFilmu", idf);

    var nazevFilmu = document.getElementById('nf' + idf).innerText;
    sessionStorage.setItem('nazevFilmu', nazevFilmu);
}
function clearls(){
    localStorage.clear();
  }
