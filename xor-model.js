// Fully connected multilayer sigmoid model; SGD/backpropagation on XOR.
(() => {
  function create() {
    let seed = 41;
    const random = () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed/4294967296; };
    const sizes = [2,6,5,4,3,1];
    const weights = sizes.slice(1).map((count,layer)=>Array.from({length:count},()=>Array.from({length:sizes[layer]},()=>random()*4-2)));
    const biases = sizes.slice(1).map(count=>Array.from({length:count},()=>random()-.5));
    const sigmoid = x=>1/(1+Math.exp(-x));
    function predict(inputs) {
      const activations = [inputs.slice()];
      weights.forEach((layer,index)=>activations.push(layer.map((row,j)=>sigmoid(row.reduce((sum,w,k)=>sum+w*activations[index][k],biases[index][j])))));
      const output=activations.at(-1)[0];
      return {activations,output,prediction:Number(output>=.5)};
    }
    const samples=[[0,0,0],[0,1,1],[1,0,1],[1,1,0]];
    for(let epoch=0;epoch<12000;epoch++) {
      for(const [a,b,target] of samples) {
        const {activations,output}=predict([a,b]);
        const deltas = Array(weights.length); deltas[weights.length-1]=[output-target];
        for(let layer=weights.length-2;layer>=0;layer--) deltas[layer]=activations[layer+1].map((value,j)=>weights[layer+1].reduce((sum,row,k)=>sum+row[j]*deltas[layer+1][k],0)*value*(1-value));
        weights.forEach((layer,index)=>layer.forEach((row,j)=>{ row.forEach((w,k)=>{row[k]-=.4*deltas[index][j]*activations[index][k];});biases[index][j]-=.4*deltas[index][j]; }));
      }
    }
    return {predict,weights,sizes};
  }
  globalThis.XorNetwork={create};
})();
