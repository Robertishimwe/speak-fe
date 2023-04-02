(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function o(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(t){if(t.ep)return;t.ep=!0;const r=o(t);fetch(t.href,r)}})();const g="/assets/bot-61bdb6bf.svg",h="/assets/user-bcdeb18e.svg",l=document.querySelector("form"),a=document.querySelector("#chat_container");let m;function y(e){e.textContent="",m=setInterval(()=>{e.textContent+=".",e.textContent==="...."&&(e.textContent="")},300)}function b(e,n){let o=0,s=setInterval(()=>{o<n.length?(e.innerHTML+=n.charAt(o),o++):clearInterval(s)},20)}function v(){const e=Date.now(),o=Math.random().toString(16);return`id-${e}-${o}`}function f(e,n,o){return`
        <div class="wrapper ${e&&"ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${e?g:h} 
                      alt="${e?"bot":"user"}" 
                    />
                </div>
                <div class="message" id=${o}>${n}</div>
            </div>
        </div>
    `}const i=new webkitSpeechRecognition;let d;i.continuous=!0;i.interimResults=!0;i.lang="en-US";let p;i.start();i.onresult=e=>{clearTimeout(p),d=e.results[e.results.length-1][0].transcript.trim(),p=setTimeout(()=>{i.stop()},5e3)};i.onerror=e=>{console.error(`Speech recognition error occurred: ${e.error}`)};i.onend=()=>{console.log("text"),console.log(`text ${d}`),console.log("Speech recognition stopped."),u()};const u=async e=>{const n=d;a.innerHTML+=f(!1,n),l.reset();const o=v();a.innerHTML+=f(!0," ",o),a.scrollTop=a.scrollHeight;const s=document.getElementById(o);y(s);const t=await fetch("https://drab-gray-swordfish-boot.cyclic.app/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n})});if(clearInterval(m),s.innerHTML=" ",t.ok){const c=(await t.json()).bot.trim();b(s,c),i.start()}else{const r=await t.text();s.innerHTML="Something went wrong",alert(r)}};l.addEventListener("submit",u);l.addEventListener("keyup",e=>{e.keyCode===13&&u()});
