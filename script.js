let images = [

];
let position = 0;

function changeImage( index ) {
    document.querySelector( '.main' ).style.backgroundImage = `url("${ images[index] }"`;
    document.querySelector( '.main' ).style.backgroundSize = `cover`;
    document.querySelector( '.main' ).style.backgroundRepeat = `no-repeat`;
}


function updatePositionBar( index = 0 ) {
    let result = '';
    for ( let i = 0; i < images.length; i++ ) {
        if ( i === index ) {
            result += String.fromCodePoint( '0x2022' );
        } else {
            result += '.';
        }
    }
    document.querySelector( '.position' ).innerText = result;
}

function next() {
    if ( position >= images.length - 1 ) {
        position = 0;
    } else {
        position += 1;
    }
    changeImage( position );
    updatePositionBar( position );
}

function nextListener() {
    document.querySelector( '.right-button' ).addEventListener( 'click', next );
}

function previous() {
    if ( position <= 0 ) {
        position = images.length - 1;
    } else {
        position -= 1;
    }
    changeImage( position );
    updatePositionBar( position );
}

function previousListener() {
    document.querySelector( '.left-button' ).addEventListener( 'click', previous );
}

function playPause() {
    const playButton = document.querySelector( '.play-button' );
    playButton.addEventListener( 'click', () => {
        if ( playButton.getAttribute( 'timer' ) ) {
            clearInterval( playButton.getAttribute( 'timer' ) );
            playButton.removeAttribute( 'timer' );
            playButton.innerText = String.fromCodePoint( '0x23EF' );
        } else {
            playButton.setAttribute( 'timer', setInterval( next, 1000 ) );
            playButton.innerText = String.fromCodePoint( '0x23F8' );
        }
    } );
}

function main() {
    nextListener();
    previousListener();
    updatePositionBar();
    playPause();
}

main();

async function getRandomImageUrl(){
    let response = await fetch('https://dog.ceo/api/breeds/image/random');
    let data = await response.json();
    return data.message;
}

function constructCarouselImages(){
    let promises = [];
    for(let i=0; i<=3; i++){
        promises.push(getRandomImageUrl());
    }
    Promise.all(promises).then(function (imageUrls) {
        images = imageUrls;
        next();
        const slideShow=document.getElementsByClassName("slideShow")[0];
        slideShow.style.display="block";
        document.getElementsByClassName("loaderWrapper")[0].style.display = "none";
    })
}

function breedList () {
    fetch('https://dog.ceo/api/breeds/list/all')
    .then(function(response){
        return response.json();
    }).then(data => showBreedList(data.message))
}

function showBreedList(breeds){
    let breedListUl  = document.getElementById("breedListUl");
    for(let breed in breeds){
        let li = document.createElement("li");
        li.className = "breedLi";
        li.textContent = breed;
        breedListUl.appendChild(li);
        
        li.addEventListener("click", function(){    
            getImgaesByBreed(breed);
            document.getElementById("message").style.display = "none"
        })
    } 
}

async function getImgaesByBreed(breed){
    let response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
    let data = await response.json();
    for(let i = 0; i<3; i++){
        const image = document.getElementById(`image${i}`);
        image.style.backgroundImage = `url("${data.message[i]}")`;
    }

}


breedList();

constructCarouselImages();

const list = document.getElementById("breedListUl")
list.addEventListener("click", function( event ) {
    let element = event.target;
    let breedName = element.textContent;
    let title = document.getElementById('breed-title')
    title.innerText = breedName.charAt(0).toUpperCase() + breedName.slice(1) + " 💜";
});
