
//prevent the right click
// document.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
// });
function convertSecondsToMinsSecs(sec) {
    let min = Math.floor(sec / 60);
    let seconds = sec % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${min}:${seconds}`;
  }
  

async function main(){
    //getting songs from the folder
    const response =  await fetch('http://127.0.0.1:5500/musicClone/songs/');
    const data = await response.text();
    const div = document.createElement('div');
    div.innerHTML = data
    
    const all_a = div.querySelectorAll('a');
    const selectSongs = Array.from(all_a).filter( elem => elem.href.endsWith('.mp3'))

    const songs = selectSongs.map(element => element.href)
    
    const songName = selectSongs.map(element => {
      let i = element.title.replaceAll("(MP3_320K).mp3", "").replaceAll("(MP3_160K).mp3", "").replaceAll(".mp3", "").replaceAll("_", "").replaceAll("Video", '')
      if (i.length > 64) {
        i = i.substring(0, 64) + '...';
      }
      return i;
    });
    
    
    // making a div box for every song name
    const songContainer = document.querySelector(".song-container")
    
    songName.forEach(element => {
        const songBox = document.createElement("div")
        songBox.setAttribute("class","song-box pointer");
        songBox.innerHTML = 
        `<div class="song-icon"><i class='bx bx-music'></i></div>
        <div class="song-info">${element}</div>
        <div class="play-icon"><i class='bx bx-play-circle' ></i></div>`
        songContainer.append(songBox)
    });

    
    //playing song on click of the box
    let songsButton = document.querySelectorAll(".song-box")
    let currentAudio = null;
    
    songsButton.forEach((btn, index)=>{
        btn.addEventListener("click",function() {
            if (currentAudio) {
                currentAudio.pause();
            }
            currentAudio = new Audio(songs[index]);
            currentAudio.play();

            document.querySelector('.current-song').innerHTML = songName[index];
            
            document.querySelector('.controller-box').style.display= "block" ;

            playPause.innerHTML = `<i class='bx music-icons bx-pause'></i>`

            currentAudio.addEventListener('timeupdate',()=>{
                let songDuration = convertSecondsToMinsSecs(Math.round(currentAudio.duration)); 
                let currentTime = convertSecondsToMinsSecs(Math.round(currentAudio.currentTime)) 
                document.querySelector('.song-time').innerHTML =`${currentTime} / ${songDuration}`;
                
                document.querySelector('.sound-bar-fill').style.width = ((currentAudio.currentTime / currentAudio.duration )*100 ) + 1 + "%"
                document.querySelector('.progress-control-handle').style.left = (currentAudio.currentTime / currentAudio.duration )*100 + "%"
            })
            
             
        });
    });
    
    //play pause logic
    let playPause = document.querySelector('.play-pause')
    playPause.addEventListener('click',()=>{
        if(currentAudio.paused){
            currentAudio.play();
            playPause.innerHTML = `<i class='bx music-icons bx-pause'></i>`
            
        }
        else{
            currentAudio.pause()
            playPause.innerHTML = `<i class='bx bx-play music-icons'></i> `
        }
        
    })

    document.querySelector('.progress-control-bar').addEventListener( 'click', function(e) {
        currentAudio.currentTime = (e.offsetX / e.target.clientWidth) * currentAudio.duration;
        //e is event 
        // console.log(e.target.clientWidth); give width of element in px 
        
    });
    



    

    // 5:35:38 give play pause button functionality
    // givce folder and click on it to ope all songs in it

   
}
main()