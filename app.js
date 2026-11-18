
(function(){
  var cur="0", prev=null, op=null, fresh=false, error=false;
  var out=document.getElementById("out"), expr=document.getElementById("expr");
  var sym={"+":"+","-":"−","*":"×","/":"÷"};

  function fmt(s){
    if(error) return s;
    var neg=s[0]==="-", t=neg?s.slice(1):s, p=t.split(".");
    p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g," ");
    return (neg?"-":"")+p.join(".");
  }
  function render(){
    out.textContent=fmt(cur);
    out.classList.toggle("err",error);
    expr.textContent=prev!==null&&op?fmt(prev)+" "+sym[op]:"";
  }
  function compute(a,b,o){
    a=parseFloat(a); b=parseFloat(b);
    var r;
    if(o==="+") r=a+b; else if(o==="-") r=a-b; else if(o==="*") r=a*b;
    else if(o==="/"){ if(b===0) return null; r=a/b; }
    return String(parseFloat(r.toPrecision(12)));
  }
  function fail(){ error=true; cur="0 ga bo‘lib bo‘lmaydi"; prev=null; op=null; render(); }
  function reset(){ cur="0"; prev=null; op=null; fresh=false; error=false; }

  function digit(d){
    if(error) reset();
    if(fresh){ cur="0"; fresh=false; }
    if(d==="."){ if(cur.indexOf(".")===-1) cur+="."; }
    else if(cur==="0") cur=d;
    else if(cur.replace(/[-.]/g,"").length<15) cur+=d;
    render();
  }
  function operator(o){
    if(error) return;
    if(op&&!fresh){
      var r=compute(prev,cur,op);
      if(r===null) return fail();
      cur=r;
    }
    prev=cur; op=o; fresh=true; render();
  }
  function equals(){
    if(error||!op) return;
    var r=compute(prev,cur,op);
    if(r===null) return fail();
    expr.textContent=fmt(prev)+" "+sym[op]+" "+fmt(cur)+" =";
    cur=r; prev=null; op=null; fresh=true;
    out.textContent=fmt(cur); out.classList.remove("err");
  }
  function percent(){
    if(error) return;
    cur=String(parseFloat((parseFloat(cur)/100).toPrecision(12))); fresh=true; render();
  }
  function back(){
    if(error) return reset(), render();
    if(fresh) return;
    cur=cur.length>1&&!(cur.length===2&&cur[0]==="-")?cur.slice(0,-1):"0"; render();
  }
  function press(k){
    if(/^[0-9.]$/.test(k)) digit(k);
    else if("+-*/".indexOf(k)>-1) operator(k);
    else if(k==="="||k==="Enter") equals();
    else if(k==="%") percent();
    else if(k==="back"||k==="Backspace") back();
    else if(k==="C"||k==="Escape"||k==="Delete"){ reset(); render(); }
  }
  document.getElementById("keys").addEventListener("click",function(e){
    var b=e.target.closest("button"); if(b) press(b.dataset.k);
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Enter") e.preventDefault();
    if(e.key===","){ press("."); return; }
    press(e.key);
  });
  render();
})();
