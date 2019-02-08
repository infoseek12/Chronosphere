const initQueue = [];
const updateQueue = [];

chronoSphere.addInitFunction = newFunc => initQueue.push(newFunc);

chronoSphere.addUpdateFunction = newFunc => updateQueue.push(newFunc);

chronoSphere.runInitFunctions = () => initQueue.forEach(func => func());

chronoSphere.runUpdateFunctions = () => updateQueue.forEach(func => func());
