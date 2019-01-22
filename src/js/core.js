let initQueue = [];
let updateQueue = [];

chronoSphere.addInitFunction = (newFunc) => {
  initQueue.push(newFunc);
}

chronoSphere.addUpdateFunction = (newFunc) => {
  updateQueue.push(newFunc);
}

chronoSphere.runInitFunctions = () => {
  initQueue.forEach(function(func){
    func();
  });
}

chronoSphere.runUpdateFunctions = () => {
  updateQueue.forEach(function(func){
    func();
  });
}