import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowDown, ArrowRight, Menu, X, MapPin, Phone, MessageCircle, Check, Leaf, Heart } from 'lucide-react';
import './style.css';
gsap.registerPlugin(ScrollTrigger);
const MAP = 'https://maps.app.goo.gl/Z7iuQg7QLAbgowMh8?g_st=ac';
const PHONE = '919503502689';
const PACKS = [
  {id:'modak-5', name:'Everyday sweetness', product:'Ukadiche Modak', size:5, price:225, image:'single', tag:'A LITTLE TREAT', description:'Steamed rice flour, filled with coconut and jaggery.'},
  {id:'modak-11', name:'The family gathering', product:'Ukadiche Modak', size:11, price:495, image:'group', tag:'MADE TO SHARE', description:'The same traditional Modak, ready for your family table.'},
  {id:'modak-21', name:'A sweet celebration', product:'Ukadiche Modak', size:21, price:945, image:'platter', tag:'FOR YOUR OCCASION', description:'A suggested larger pack for pujas and celebrations.'},
];
const EXTRA = [
  {id:'chirota', product:'Chirota Sweet', price:'₹300–₹800', image:'chirota', description:'A sweet addition from the kitchen’s listed menu.'},
  {id:'salad', product:'Green Salad', price:'₹150–₹250', image:'salad', description:'A fresh option from the kitchen’s listed menu.'},
];
const OPTIONS = [...PACKS, ...EXTRA, {id:'custom',product:'Custom Modak quantity'}, {id:'catering',product:'Catering & tiffin enquiry'}];
const money = n => `₹${n.toLocaleString('en-IN')}`;
const localDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function Mark(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c0 14-23 25-23 40 0 10 46 10 46 0C55 31 32 20 32 6Z"/><path d="M32 8c-8 23-13 29-13 41M32 8c8 23 13 29 13 41M32 8v44"/><path d="M6 56h52"/></svg>}
function Order({close,product}) {
  const [selection,setSelection] = useState(product || 'modak-5');
  const [quantity,setQuantity] = useState('1');
  const [date,setDate] = useState('');
  const [errors,setErrors] = useState({});
  const [status,setStatus] = useState('');
  const box = useRef(null);
  const backdrop = useRef(null);
  const selected = OPTIONS.find(p => p.id === selection);
  const minDate = localDate(new Date(Date.now()+86400000));
  const unitLabel = selected?.size ? 'Number of packs' : selection === 'custom' ? 'Number of Modaks' : 'Quantity (confirm size with kitchen)';
  const numericQuantity = Number(quantity);
  const estimatedTotal = selected?.size ? selected.price*numericQuantity : null;
  const description = selected?.size ? `${selected.product}, suggested ${selected.size}-piece pack` : selected.product;
  const message = `Namaste! I'd like to enquire about ${description}. ${unitLabel}: ${quantity}. Preferred date: ${date}. ${selected?.size ? `Indicative prototype estimate: ${money(estimatedTotal)} (not confirmed business pricing). ` : ''}Please confirm pricing, pack availability, 24-hour lead time, and pickup/delivery charges. I understand this is an enquiry, not a confirmed order. Thank you!`;
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow='hidden'; box.current?.focus();
    const viewport = window.visualViewport;
    const resize = () => {
      backdrop.current?.style.setProperty('--dialog-viewport',`${viewport?.height || innerHeight}px`);
      backdrop.current?.style.setProperty('--dialog-top',`${viewport?.offsetTop || 0}px`);
    };
    resize(); viewport?.addEventListener('resize',resize); viewport?.addEventListener('scroll',resize);
    const keydown = e => {
      if(e.key==='Escape') close();
      if(e.key==='Tab') {
        const nodes=[...box.current.querySelectorAll('button:not(:disabled),a[href],input,select')].filter(n=>n.getClientRects().length);
        const first=nodes[0],last=nodes[nodes.length-1];
        if(e.shiftKey && (document.activeElement===first || document.activeElement===box.current)){e.preventDefault();last?.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}
      }
    };
    document.addEventListener('keydown',keydown);
    return () => {document.body.style.overflow=overflow;document.removeEventListener('keydown',keydown);viewport?.removeEventListener('resize',resize);viewport?.removeEventListener('scroll',resize);previous?.focus();};
  }, []);
  function submit(e) {
    e.preventDefault();
    const next={};
    if(!Number.isInteger(numericQuantity) || numericQuantity<1 || numericQuantity>100) next.quantity='Enter a whole number from 1 to 100. For larger orders, call us.';
    if(!date) next.date='Choose your preferred date.';
    else if(date<minDate) next.date='Choose tomorrow or a later date. The kitchen will confirm the 24-hour lead time.';
    setErrors(next);
    if(Object.keys(next).length){setTimeout(()=>box.current.querySelector('[aria-invalid="true"]')?.focus(),0);return;}
    const opened=window.open(href,'_blank');
    if(opened) opened.opener=null;
    setStatus(opened?'opened':'blocked');
  }
  return <div className="modal-backdrop" ref={backdrop} onClick={e=>e.target===e.currentTarget&&close()}>
    <div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title" aria-describedby="order-description" ref={box} tabIndex={-1}>
      <button className="close" onClick={close} aria-label="Close order enquiry"><X/></button>
      <p className="eyebrow">DIRECTLY WITH YOUR LOCAL KITCHEN</p>
      <h2 id="order-title">Your Modak<br/><em>order enquiry.</em></h2>
      <p id="order-description">Choose what you’d like, then send your request on WhatsApp. The kitchen confirms the price, availability and delivery. No payment or booking happens here.</p>
      {status ? <div className="enquiry-result" role="status">
        <Check size={24}/><h3>{status==='opened'?'Your enquiry is ready.':'WhatsApp didn’t open.'}</h3>
        <p>{status==='opened'?'Finish sending the message in WhatsApp, then wait for the kitchen to confirm. Your order is not booked yet.':'Your browser may have blocked the new tab. Use the link below or call the kitchen.'}</p>
        <a className="button button-dark" href={href} target="_blank" rel="noopener noreferrer">Open your WhatsApp message <ArrowUpRight size={18}/></a>
        <button className="text-link" onClick={()=>setStatus('')}>Edit my enquiry <ArrowRight size={16}/></button>
      </div> : <form onSubmit={submit} noValidate>
        <label htmlFor="product-select">Product / suggested pack</label>
        <select id="product-select" value={selection} onChange={e=>{setSelection(e.target.value);setQuantity('1');setErrors({});}}>
          {OPTIONS.map(p=><option key={p.id} value={p.id}>{p.product}{p.size?` · ${p.size} pieces · ${money(p.price)} estimate`:''}</option>)}
        </select>
        {selected?.size && <div className="estimate-note">Suggested pack and indicative price based on nearby menus. This business has not confirmed these options.</div>}
        {!selected?.size && <div className="estimate-note">{selected?.price?`${selected.price} is the profile-listed range. `:''}Pack size and current price are confirmed by the kitchen.</div>}
        <div className="order-fields">
          <div><label htmlFor="quantity">{unitLabel} *</label><input id="quantity" type="number" inputMode="numeric" min="1" max="100" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} required aria-invalid={!!errors.quantity} aria-describedby={errors.quantity?'quantity-error':undefined}/>{errors.quantity&&<p className="field-error" id="quantity-error">{errors.quantity}</p>}</div>
          <div><label htmlFor="date">Preferred date *</label><input id="date" type="date" min={minDate} value={date} onChange={e=>setDate(e.target.value)} required aria-invalid={!!errors.date} aria-describedby={errors.date?'date-error':undefined}/>{errors.date&&<p className="field-error" id="date-error">{errors.date}</p>}</div>
        </div>
        {selected?.size && <div className="estimate-total"><span>{Number.isFinite(estimatedTotal)&&numericQuantity>=1?`${selected.size*numericQuantity} Modaks · indicative total`:'Indicative total'}</span><strong>{Number.isFinite(estimatedTotal)&&numericQuantity>=1?money(estimatedTotal):'—'}</strong><small>Delivery charge, taxes and final pricing to be confirmed.</small></div>}
        <button type="submit" className="button button-dark"><MessageCircle size={18}/> Prepare WhatsApp enquiry <ArrowUpRight size={18}/></button>
        <small className="form-help">Please book at least 24 hours ahead. Required fields are marked *.</small>
      </form>}
      <a className="modal-call" href="tel:+919503502689"><Phone size={17}/> Prefer to call? +91 95035 02689</a>
    </div>
  </div>;
}
function Experience() {
  const section=useRef(null),canvas=useRef(null),cache=useRef([]),progressBar=useRef(null),render=useRef(()=>{});
  const [manual,setManual]=useState(0),[ready,setReady]=useState(false),[reduced,setReduced]=useState(false),[failed,setFailed]=useState(false);
  const frameCount=79;
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion=()=>{setReduced(media.matches);requestAnimationFrame(()=>ScrollTrigger.refresh());};
    updateMotion();media.addEventListener('change',updateMotion);
    let alive=true,target=1,started=false,next=1;
    const ctx=canvas.current.getContext('2d');
    const mobile=matchMedia('(max-width: 760px)').matches;
    const width=mobile?300:480,height=mobile?525:840;
    canvas.current.width=width;canvas.current.height=height;
    const path=n=>`/assets/${mobile?'reveal-mobile':'reveal'}/frame-${String(n).padStart(3,'0')}.webp`;
    const draw=n=>{
      target=n;
      const img=cache.current[n];
      if(img?.complete&&img.naturalWidth){ctx.drawImage(img,0,0,width,height);canvas.current.dataset.frame=String(n);setReady(true);}
      if(progressBar.current)progressBar.current.style.width=`${(n-1)/(frameCount-1)*100}%`;
    };
    render.current=draw;
    const load=n=>new Promise(resolve=>{
      const img=new Image();img.onload=()=>{if(alive&&n===target)draw(n);resolve();};img.onerror=()=>{if(alive&&n===1)setFailed(true);resolve();};cache.current[n]=img;img.src=path(n);
    });
    async function worker(){while(alive&&next<=frameCount)await load(next++);}
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!started){started=true;for(let i=0;i<4;i++)worker();observer.disconnect();}},{rootMargin:'500px'});
    observer.observe(section.current);
    const trigger=ScrollTrigger.create({trigger:section.current,start:'top top',end:'bottom bottom',onUpdate:self=>{if(!media.matches){const n=Math.round(self.progress*(frameCount-1));setManual(n);draw(n+1);}}});
    return()=>{alive=false;observer.disconnect();trigger.kill();media.removeEventListener('change',updateMotion);};
  },[]);
  return <section id="experience" className={`experience ${reduced?'reduced':''}`} ref={section} aria-label="Interactive Modak reveal">
    <div className="experience-sticky">
      <div className="experience-heading"><p className="eyebrow">A CLOSER LOOK AT THE CLASSIC</p><h2>A little mystery.<br/><em>A delicious reveal.</em></h2></div>
      <a className="experience-skip" href="#story">Skip to our story <ArrowDown size={16}/></a>
      <div className="experience-image"><img src="/assets/hero.jpg" alt="A Modak resting on a banana leaf" loading="lazy"/><canvas ref={canvas} style={{opacity:ready?1:0}} role="img" aria-label="Scroll-controlled Modak opening to reveal its filling"/></div>
      <div className="ingredient ingredient-left"><span>01 / THE DELICATE SHELL</span><h3>Soft. Steamed.<br/>Beautifully folded.</h3><p>A tender rice flour shell.</p><i/></div>
      <div className="ingredient ingredient-right"><span>02 / THE SWEET HEART</span><h3>Coconut.<br/>Golden jaggery.</h3><p>A little taste of home.</p><i/></div>
      <div className="experience-bottom"><span><ArrowDown size={15}/>{failed?'FILM UNAVAILABLE · ENJOY THE STILL PHOTO':reduced?'EXPLORE THE REVEAL BY HAND':'SCROLL TO OPEN · SCROLL BACK TO CLOSE'}</span><div className="progress-track"><div ref={progressBar}/></div><label className="manual">Explore by hand<input aria-label="Open the Modak manually" type="range" min="0" max="78" value={manual} onChange={e=>{setManual(Number(e.target.value));render.current(1+Number(e.target.value));}}/></label></div>
    </div>
  </section>;
}
function Catalogue({open}) {
  return <section id="offerings" className="offerings section-pad">
    <div className="section-heading"><div><p className="eyebrow">CHOOSE YOUR SWEET MOMENT</p><h2>Good things.<br/><em>Beautifully shared.</em></h2></div><p>Classic coconut-jaggery Modak. Choose a suggested pack, then confirm your order with the kitchen.</p></div>
    <div className="catalogue-notice"><span>INDICATIVE PROTOTYPE MENU</span><p>Modak packs and prices below are suggested from nearby menus, and are awaiting this business’s confirmation.</p></div>
    <div className="product-grid">{PACKS.map(p=><article className="product-card" key={p.id}>
      <div className="product-image"><img src={`/assets/${p.image}.jpg`} alt={`Business profile photo of ${p.product}: ${p.size===5?'single handcrafted Modak':p.size===11?'Modak on a banana leaf':'a Modak platter'}`} loading="lazy"/><span>{p.tag}</span></div>
      <div className="product-label"><h3>{p.name}</h3><span className="veg-mark" aria-label="Vegetarian"/></div>
      <span className="product-name">{p.product}</span><p>{p.description}</p>
      <div className="pack-details"><span>Suggested pack · {p.size} pieces</span><span>Classic coconut & jaggery</span></div>
      <div className="product-price"><strong>{money(p.price)}</strong><span>indicative / pack<br/>{money(p.price/p.size)} per piece</span></div>
      <button className="button button-dark" onClick={()=>open(p.id)}>Order now <ArrowUpRight size={18}/></button><small className="card-order-note">WhatsApp enquiry · final price confirmed by kitchen</small>
    </article>)}</div>
    <details className="pricing-reference"><summary>How we estimated the Modak prices</summary><p>Suggested packs use ₹45 per piece. Nearby <a href="https://www.zomato.com/pune/ukadiche-modak-bhosari/order" target="_blank" rel="noopener noreferrer">Bhosari menu listings</a> show ₹229 for 5 and ₹489 for 11; <a href="https://ghargutigodwa.com/en/products/ukdiche-modak" target="_blank" rel="noopener noreferrer">Gharguti Godwa’s Pune menu</a> lists ₹35 per piece. These are different businesses. Their listings inform the prototype only; pack availability, final prices and delivery charges must be confirmed with Ukadiche Modak.</p></details>
    <div className="extra-heading"><h3>Also from our kitchen</h3><span>FROM THE BUSINESS PROFILE</span></div>
    <div className="extra-grid">{EXTRA.map(p=><article className={`extra-card ${p.id}`} key={p.id}><div className="extra-image"><img src={`/assets/${p.image}.jpg`} alt={`${p.product} photograph from the business profile`} loading="lazy"/></div><div><h3>{p.product}</h3><p>{p.description}</p><strong>{p.price}</strong><small>Profile-listed range · pack size and variants to be confirmed</small><button className="text-link" onClick={()=>open(p.id)}>Enquire on WhatsApp <ArrowUpRight size={17}/></button></div></article>)}</div>
    <div className="catalogue-footer"><span>Planning something bigger?</span><button className="text-link" onClick={()=>open('custom')}>Custom Modak quantity <ArrowRight size={16}/></button><button className="text-link" onClick={()=>open('catering')}>Catering & tiffin <ArrowRight size={16}/></button></div>
  </section>;
}
function App() {
  const [menu,setMenu]=useState(false),[order,setOrder]=useState(null);
  const open=id=>{setMenu(false);setOrder(id||'modak-5');};
  return <>
    <div className="announcement">HANDCRAFTED TRADITION. A HEART FULL OF SWEETNESS.<span>PRE-ORDER 24 HOURS AHEAD <ArrowUpRight size={12}/></span></div>
    <header><a className="brand" href="#" aria-label="Ukadiche Modak home"><Mark/><div><strong>Ukadiche Modak</strong><span>उकडीचे मोदक</span></div></a>
      <nav className={menu?'nav open':'nav'} aria-label="Main navigation">{[['Products','offerings'],['Our Story','story'],['Reviews','reviews'],['Contact','visit']].map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
      <button className="nav-order" onClick={()=>open()}>Order on WhatsApp <ArrowUpRight size={17}/></button><button className="menu-toggle" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>
    <main>
      <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="line"/> FROM MAHARASHTRA, WITH LOVE</p><h1>A little fold<br/>of <em>tradition.</em></h1><p className="hero-description">Traditional steamed Modak with coconut-jaggery filling. Pre-order from our Pimpri-Chinchwad kitchen, at least 24 hours ahead.</p><div className="hero-actions"><a className="button button-dark" href="#offerings">Explore Modaks <ArrowRight size={18}/></a><button className="button button-secondary" onClick={()=>open()}><MessageCircle size={17}/> Order on WhatsApp</button></div><a href={MAP} target="_blank" rel="noopener noreferrer" className="rating"><span className="rating-number">4.8</span><div><span className="stars">★★★★★</span><span>136 Google reviews · profile recording</span></div><ArrowUpRight size={16}/></a></div><div className="hero-art"><div className="hero-photo"><img src="/assets/hero.jpg" alt="Traditional steamed Modak on a banana leaf" fetchPriority="high"/></div><span className="hero-index">उकडीचे मोदक · THE MAHARASHTRIAN CLASSIC</span></div><div className="hero-bottom"><span>PIMPRI-CHINCHWAD · MAHARASHTRA</span><a href="#offerings">FIND YOUR SWEET MOMENT <ArrowDown size={14}/></a></div></section>
      <Catalogue open={open}/>
      <Experience/>
      <section id="story" className="story section-pad"><div className="story-photo"><img src="/assets/platter.jpg" alt="The business’s handmade Modak arranged on banana leaves" loading="lazy"/></div><div className="story-copy"><p className="eyebrow">WHY OUR KITCHEN? · आपल्या घरची चव</p><h2>Your local kitchen.<br/><em>A familiar favourite.</em></h2><p>Find us at Polite Hermitage in Shivatej Nagar. Our customers come for steamed rice-flour Modak with coconut-jaggery filling, enjoyed warm with ghee. The owner’s profile describes eleven years in the business and a kitchen that has grown into catering and tiffin services.</p><ul className="story-highlights"><li><Leaf size={19}/><span><strong>The classic combination</strong>Rice flour, coconut and jaggery.</span></li><li><Heart size={19}/><span><strong>For your occasion</strong>Custom Modak quantities and catering enquiries.</span></li><li><Check size={19}/><span><strong>Plan a little ahead</strong>The kitchen asks for at least 24 hours’ notice.</span></li></ul><a className="text-link" href={MAP} target="_blank" rel="noopener noreferrer">Visit our neighbourhood kitchen <ArrowUpRight size={17}/></a></div></section>
      <section id="reviews" className="reviews section-pad"><div className="section-heading"><div><p className="eyebrow">REAL CUSTOMERS. KIND WORDS.</p><h2>Loved, one bite<br/><em>at a time.</em></h2></div><a className="review-score" href={MAP} target="_blank" rel="noopener noreferrer"><strong>4.8<span>/5</span></strong><span className="stars">★★★★★</span><small>136 reviews on Google <ArrowUpRight size={14}/></small></a></div><div className="review-grid">{[{name:'Taniksha Patil',quote:'Absolutely delicious!',initials:'TP'},{name:'Niranjan Tilekar',quote:'All time favorite Ukadiche Modak and a must try destination without doubt.',initials:'NT'},{name:'Santosh Kulkarni',quote:'Coming again and again. Hot n sweet Modak supplied.',initials:'SK'}].map(r=><article className="review-card" key={r.name}><div className="review-top"><span className="stars">★★★★★</span><span className="google-g" aria-label="Google">G</span></div><blockquote>“{r.quote}”</blockquote><div className="review-person"><span>{r.initials}</span><div><strong>{r.name}</strong><small>Google review excerpt</small></div></div></article>)}</div><div className="reviews-foot"><span>Rating and excerpts from the supplied Google Business Profile recording; counts may change.</span><a className="text-link" href={MAP} target="_blank" rel="noopener noreferrer">Read all Google reviews <ArrowUpRight size={17}/></a></div></section>
      <section id="order" className="order-section section-pad"><p className="eyebrow">A SIMPLE WAY TO SOMETHING SWEET</p><h2>Your next sweet moment.<br/><em>Just a conversation away.</em></h2><ol className="order-process"><li><span>01</span><strong>Choose your Modaks</strong><p>Select a suggested pack or custom quantity.</p></li><li><span>02</span><strong>Send a WhatsApp enquiry</strong><p>Share your preferred date with the kitchen.</p></li><li><span>03</span><strong>Confirm directly</strong><p>Agree on price, availability and pickup or delivery.</p></li></ol><button className="button button-cream" onClick={()=>open()}><MessageCircle size={18}/> Enquire on WhatsApp <ArrowUpRight size={18}/></button><small>Please book 24 hours ahead. Delivery areas and charges confirmed by the kitchen.</small></section>
      <section id="visit" className="visit section-pad"><div><p className="eyebrow">COME SAY NAMASTE</p><h2>Your neighbourhood<br/><em>sweet spot.</em></h2></div><div className="visit-details"><p><MapPin size={20}/><span>Shop No. 10, Polite Hermitage<br/>Shivtej Nagar Road, Shivatej Nagar<br/>Pimpri-Chinchwad, Maharashtra 411019</span></p><a href="tel:+919503502689"><Phone size={18}/> +91 95035 02689</a><a className="text-link" href={MAP} target="_blank" rel="noopener noreferrer">Get directions on Google Maps <ArrowUpRight size={17}/></a><small>Delivery and on-site services · Free street parking<br/>The profile recording lists an 8 pm closing time. Call to confirm today’s hours.</small></div></section>
    </main>
    <footer><a className="brand" href="#"><Mark/><div><strong>Ukadiche Modak</strong><span>उकडीचे मोदक</span></div></a><span>A little fold of tradition. A little taste of home.</span><a href="#">BACK TO TOP ↑</a><div className="footer-note">Website prototype · Business details and reviews from the supplied profile recording. Suggested Modak packs and prices are indicative. Cinematic imagery from the supplied animation.</div></footer>
    <div className="mobile-order-bar"><a href="#offerings">Explore products</a><button onClick={()=>open()}><MessageCircle size={18}/> Order on WhatsApp</button></div>
    <button className="floating-order" aria-label="Enquire on WhatsApp" onClick={()=>open()}><MessageCircle size={23}/><span>Order on WhatsApp</span></button>
    {order&&<Order product={order} close={()=>setOrder(null)}/>}
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
