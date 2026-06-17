const state={all:[],updated:null};
async function load(){try{const r=await fetch("tournaments.json",{cache:"no-store"});const d=await r.json();state.all=Array.isArray(d)?d:(d.tournaments||[]);state.updated=d.updated||null;}catch(e){state.all=[];}render();}
function fmtDate(iso){if(!iso)return"Date TBD";const d=new Date(iso+"T00:00:00");if(isNaN(d))return iso;return d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"});}
function isUpcoming(t){if(!t.date)return true;return t.date>=new Date().toISOString().slice(0,10);}
function matches(t,q){if(!q)return true;return [t.name,t.course,t.charity].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase());}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function card(t){const m=[];if(t.cost)m.push(`<span class="pill">${esc(t.cost)}</span>`);if(t.format)m.push(`<span class="pill">${esc(t.format)}</span>`);if(t.time)m.push(`<span class="pill">${esc(t.time)}</span>`);
const cta=t.registration_url?`<a class="reg" href="${esc(t.registration_url)}" target="_blank" rel="noopener">Register</a>`:(t.contact?`<div class="course">Contact: ${esc(t.contact)}</div>`:"");
return `<article class="card"><span class="date">${fmtDate(t.date)}</span><h3>${esc(t.name||"Charity Scramble")}</h3>${t.course?`<div class="course">${esc(t.course)}</div>`:""}${t.charity?`<div class="course">Benefiting ${esc(t.charity)}</div>`:""}<div class="meta">${m.join("")}</div>${cta}</article>`;}
function render(){const q=document.getElementById("search").value.trim();const up=document.getElementById("upcomingOnly").checked;let rows=state.all.filter(t=>matches(t,q));if(up)rows=rows.filter(isUpcoming);
document.getElementById("list").innerHTML=rows.map(card).join("");document.getElementById("empty").hidden=rows.length>0;
document.getElementById("count").textContent=rows.length?`${rows.length} tournament${rows.length===1?"":"s"}`:"";
document.getElementById("updated").textContent=state.updated?`Last updated ${fmtDate(state.updated)}`:"";}
document.getElementById("search").addEventListener("input",render);
document.getElementById("upcomingOnly").addEventListener("change",render);load();
