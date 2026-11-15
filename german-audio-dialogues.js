/* Original A1 role-play prompts based on lesson themes in Dabei! A1.1, A1.2, A1.3.
   Not publisher audio or official textbook exercises. */
window.EBDAA_GERMAN_DIALOGUES=[[["Wie heißt du?","Ich heiße Mira."],["Woher kommst du?","Ich komme aus Ägypten."],["Wie geht es dir?","Mir geht es gut, danke."],["Was trinkst du gern?","Ich trinke gern Wasser."],["Wie findest du die Musik?","Ich finde sie toll."]],[["Wer ist das?","Das ist meine Schwester."],["Wie alt ist dein Bruder?","Er ist dreizehn Jahre alt."],["Ist das deine Mutter?","Ja, das ist meine Mutter."],["Habt ihr Geschwister?","Ja, ich habe einen Bruder."],["Wie heißt dein Opa?","Mein Opa heißt Ali."]],[["Wann hast du Deutsch?","Am Montag."],["Was ist dein Lieblingsfach?","Mein Lieblingsfach ist Deutsch."],["Hast du einen Bleistift?","Ja, hier bitte."],["Was hast du in der ersten Stunde?","Mathe."],["Möchtest du mitkommen?","Ja, gern."]],[["Wann hast du Geburtstag?","Im Mai."],["Wie spät ist es?","Es ist acht Uhr."],["Darf ich mitkommen?","Ja, gern."],["Wohin gehen wir?","In den Wald."],["Was machen wir heute?","Wir machen einen Ausflug."]],[["Was machst du gern?","Ich spiele gern Tennis."],["Kannst du schwimmen?","Ja, ich kann schwimmen."],["Wann fährst du Rad?","Im Sommer."],["Wie ist deine Freundin?","Sie ist nett."],["Kommst du mit?","Ja, sehr gern."]],[["Was kostet die Hose?","Zwanzig Euro."],["Kann ich Ihnen helfen?","Ja, ich suche ein Geschenk."],["Welche Farbe möchtest du?","Ich möchte Blau."],["Ist das teuer?","Nein, das ist billig."],["Möchten Sie die Jacke?","Ja, bitte."]],[["Magst du Hunde?","Ja, Hunde sind toll."],["Wo ist die Katze?","In der Küche."],["Was frisst dein Hund?","Er frisst Fleisch."],["Wie war das Wochenende?","Es war schön."],["Hattet ihr ein Haustier?","Ja, wir hatten eine Katze."]],[["Wohin fährst du in den Ferien?","Nach Berlin."],["Womit fährst du?","Mit dem Zug."],["Wann fährt der Zug ab?","Um neun Uhr."],["Was möchtest du machen?","Ich möchte schwimmen."],["Brauchst du eine Fahrkarte?","Ja, bitte."]]];
window.EBDAA_GERMAN_AUDIO=(function(){
let recognition=null;
function speak(text,rate=0.85){
  if(!("speechSynthesis" in window))return false;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang="de-DE";u.rate=rate;
  const voices=window.speechSynthesis.getVoices();
  const german=voices.find(v=>v.lang.toLowerCase().startsWith("de"));
  if(german)u.voice=german;
  window.speechSynthesis.speak(u);return true;
}
function stop(){try{window.speechSynthesis?.cancel();recognition?.abort()}catch(e){}recognition=null}
function listen(onResult,onError){
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition)return false;
 try{recognition?.abort();recognition=new Recognition();recognition.lang="de-DE";recognition.interimResults=false;recognition.maxAlternatives=1;
 recognition.onresult=e=>onResult(e.results[0][0].transcript);
 recognition.onerror=e=>onError(e.error||"microphone");recognition.onnomatch=()=>onError("no-match");recognition.start();return true;
 }catch(e){onError(e.message);return false}
}
return {speak,stop,listen}
})();