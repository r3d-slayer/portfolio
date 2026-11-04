(() => {
  const model=XorNetwork.create();
  const demo=document.querySelector('.live-demo');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const samples=[[0,0],[0,1],[1,1],[1,0]];
  let sample=0,phase=0,timer=null,visible=false;
  function render() {
    const inputs=samples[sample];
    const {activations,output,prediction}=model.predict(inputs);
    demo.dataset.sample=String(sample); demo.dataset.phase=String(phase);
    document.querySelectorAll('.nn-node').forEach(node=>{
      const layer=Number(node.dataset.nodeLayer),value=activations[layer][Number(node.dataset.node)];
      node.classList.toggle('is-computing',layer===phase);
      node.style.opacity=layer<=phase?'1':'.35';
      node.dataset.activation=String(value);
      node.querySelector('text').textContent=layer===0?value:value.toFixed(2);
      node.querySelector('circle').style.fill=`rgba(137,157,111,${.08+value*.45})`;
    });
    document.querySelectorAll('.nn-edge').forEach(edge=>{
      const layer=Number(edge.dataset.layer),from=Number(edge.dataset.from),to=Number(edge.dataset.to);
      const weight=model.weights[layer][to][from];
      edge.style.stroke=weight<0?'#96998f':'#536e3d';
      edge.style.opacity=layer<phase?String(.12+Math.min(Math.abs(weight)/8,1)*activations[layer][from]*.75):'.07';
      edge.style.strokeWidth=String(1+Math.min(Math.abs(weight)/4,2));
      edge.classList.toggle('is-transmitting',layer===phase-1&&!motion.matches);
    });
    demo.dataset.prediction=String(prediction);demo.dataset.probability=String(output);demo.dataset.inputs=inputs.join(',');
  }
  function stop(){clearTimeout(timer);timer=null;}
  function tick(){timer=null;if(!visible||document.hidden||motion.matches)return;phase++;if(phase>=model.sizes.length){phase=0;sample=(sample+1)%samples.length;}render();schedule();}
  function schedule(){stop();if(visible&&!document.hidden&&!motion.matches)timer=setTimeout(tick,phase===model.sizes.length-1?1600:650);}
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener('change',()=>{phase=model.sizes.length-1;render();schedule();});
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.1}).observe(demo);}else{visible=true;}
  if(motion.matches)phase=model.sizes.length-1;
  render();schedule();
})();
