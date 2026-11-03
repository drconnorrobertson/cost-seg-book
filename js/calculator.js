(function () {
  'use strict';
  const names = ['basis','eligible','bonus','use','rate','fee'];
  function hundredths(value, maximum) {
    const s=String(value).trim();
    if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(s)) throw new Error('Complete every field with a nonnegative number and at most two decimal places. Use 0 only when confirmed.');
    const p=s.replace(/,/g,'').split('.');
    const n=Number(p[0])*100+Number((p[1]||'').padEnd(2,'0'));
    if (!Number.isSafeInteger(n) || n>maximum*100) throw new Error('Amounts must not exceed 1 billion; percentages must be between 0 and 100.');
    return n;
  }
  function calculate(v) {
    const basis=hundredths(v.basis,1000000000),eligible=hundredths(v.eligible,1000000000),fee=hundredths(v.fee,1000000000);
    const bonus=hundredths(v.bonus,100),use=hundredths(v.use,100),rate=hundredths(v.rate,100);
    if (eligible>basis) throw new Error('The assumed eligible portion cannot exceed the entered depreciable basis.');
    const deduction=Math.round(eligible*bonus/10000);
    const usable=Math.round(deduction*use/10000);
    const effect=Math.round(usable*rate/10000);
    return {basis,eligible,deduction,usable,effect,fee,effectLessFee:effect-fee};
  }
  if (typeof module!=='undefined' && module.exports) module.exports={calculate};
  if (typeof document==='undefined') return;
  document.addEventListener('DOMContentLoaded',function(){
    const form=document.getElementById('calc-form'),out=document.getElementById('calc-results');
    if (!form) return;
    const read=()=>Object.fromEntries(names.map(k=>[k,form.elements.namedItem(k).value]));
    const money=c=>'$'+(c/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    function render(){
      try {
        const r=calculate(read());out.replaceChildren();
        const text=document.createElement('p');text.textContent='Illustration from your inputs. The federal effect below is a gross amount, not incremental savings, a refund or an investment return.';out.append(text);
        const rows=[['Entered depreciable basis',r.basis],['Assumed bonus-eligible portion',r.eligible],['Modeled bonus deduction',r.deduction],['Assumed currently usable deduction',r.usable],['Gross illustrative federal tax effect',r.effect],['Entered study and implementation fee',r.fee],['Gross illustrative effect less entered fee',r.effectLessFee]];
        const list=document.createElement('dl');rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=money(value);list.append(dt,dd)});out.append(list);
      }catch(e){out.textContent=e.message;}
    }
    form.addEventListener('submit',e=>{e.preventDefault();render()});
    form.addEventListener('input',()=>{out.textContent='Inputs changed. Calculate again to refresh the illustration.'});
    document.getElementById('calc-example').addEventListener('click',()=>{const v={basis:'800000',eligible:'200000',bonus:'60',use:'50',rate:'37',fee:'2500'};names.forEach(k=>form.elements.namedItem(k).value=v[k]);render()});
    document.getElementById('calc-clear').addEventListener('click',()=>{form.reset();out.textContent='Entries cleared. Complete every field to calculate.'});
  });
})();
